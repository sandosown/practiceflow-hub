/**
 * PF: Questionnaire Service
 *
 * Single save pipeline for both manual entry and upload-to-autofill.
 * Upload hydrates questionnaire state — it does NOT create records directly.
 *
 * All reads/writes go through the Supabase tables:
 *   questionnaire_draft_answers  (1 row per worker per workspace)
 *   employee_licenses            (N rows per worker — repeatable)
 *   employee_tags                (N rows per worker — unified tags)
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  QuestionnaireDraft,
  EmployeeLicense,
  EmployeeLicenseInsert,
  EmployeeTag,
  EmployeeTagInsert,
  SaveDraftPayload,
  AutofillExtractionResult,
  AutofillSource,
  QuestionnaireAnswers,
} from '@/types/questionnaire';
import { AUTOFILL_CONFIDENCE_THRESHOLD } from '@/types/questionnaire';

const WORKSPACE_ID = 'w1';

// ── Draft CRUD ───────────────────────────────────────────────────────────────

export async function getDraft(workerProfileId: string): Promise<QuestionnaireDraft | null> {
  const { data, error } = await supabase
    .from('questionnaire_draft_answers')
    .select('*')
    .eq('workspace_id', WORKSPACE_ID)
    .eq('worker_profile_id', workerProfileId)
    .maybeSingle();

  if (error) { console.error('[questionnaireService] getDraft error', error); return null; }
  return data as QuestionnaireDraft | null;
}

/**
 * Unified upsert for both manual saves and upload-hydrated saves.
 * - If no existing draft: creates one.
 * - If existing draft: merges answers, respects locked_fields for autofill paths.
 * - Replaces licenses and tags transactionally (delete-then-insert per worker).
 */
export async function upsertQuestionnaireDraft(payload: SaveDraftPayload): Promise<QuestionnaireDraft | null> {
  const { workspace_id, worker_profile_id, answers, licenses, tags, autofill, newly_locked_fields } = payload;

  // 1. Load existing draft to merge locked fields
  const existing = await getDraft(worker_profile_id);
  const existingLocked = existing?.locked_fields ?? [];
  const mergedLocked = Array.from(new Set([...existingLocked, ...(newly_locked_fields ?? [])]));

  // 2. When this is an autofill (upload) save, respect locked fields:
  //    don't overwrite fields the user has manually confirmed.
  let mergedAnswers: QuestionnaireAnswers = answers;
  if (autofill && existing) {
    mergedAnswers = { ...answers };
    for (const lockedKey of existingLocked) {
      const existingVal = (existing.answer_json as QuestionnaireAnswers)[lockedKey];
      if (existingVal !== undefined && existingVal !== '') {
        mergedAnswers[lockedKey] = existingVal;
      }
    }
  }

  // 3. Determine autofill_source
  const source: AutofillSource = autofill
    ? existing?.autofill_source === 'manual' && Object.keys(existing.answer_json ?? {}).length > 0
      ? 'mixed'
      : 'upload'
    : existing?.autofill_source === 'upload'
      ? 'mixed'
      : 'manual';

  // 4. Upsert draft row
  const draftRow = {
    workspace_id,
    worker_profile_id,
    answer_json: mergedAnswers,
    autofill_source: source,
    autofill_confidence: autofill?.confidence ?? existing?.autofill_confidence ?? {},
    uploaded_file_url: autofill?.file_url ?? existing?.uploaded_file_url ?? null,
    upload_filename: autofill?.filename ?? existing?.upload_filename ?? null,
    locked_fields: mergedLocked,
    questionnaire_version: (existing?.questionnaire_version ?? 0) + (autofill ? 0 : 0), // version bump on submit, not save
    updated_at: new Date().toISOString(),
  };

  const { data: savedDraft, error: draftError } = await supabase
    .from('questionnaire_draft_answers')
    .upsert(draftRow, { onConflict: 'workspace_id,worker_profile_id' })
    .select()
    .maybeSingle();

  if (draftError) {
    console.error('[questionnaireService] upsert draft error', draftError);
    return null;
  }

  // 5. Replace licenses (delete existing, insert new)
  await supabase
    .from('employee_licenses')
    .delete()
    .eq('workspace_id', workspace_id)
    .eq('worker_profile_id', worker_profile_id);

  if (licenses.length > 0) {
    const licenseRows = licenses.map(l => ({
      ...l,
      workspace_id,
      worker_profile_id,
    }));
    const { error: licErr } = await supabase.from('employee_licenses').insert(licenseRows);
    if (licErr) console.error('[questionnaireService] insert licenses error', licErr);
  }

  // 6. Replace tags (delete existing, insert new)
  await supabase
    .from('employee_tags')
    .delete()
    .eq('workspace_id', workspace_id)
    .eq('worker_profile_id', worker_profile_id);

  if (tags.length > 0) {
    const tagRows = tags.map(t => ({
      ...t,
      workspace_id,
      worker_profile_id,
    }));
    const { error: tagErr } = await supabase.from('employee_tags').insert(tagRows);
    if (tagErr) console.error('[questionnaireService] insert tags error', tagErr);
  }

  return savedDraft as QuestionnaireDraft | null;
}

// ── Licenses ─────────────────────────────────────────────────────────────────

export async function getLicenses(workerProfileId: string): Promise<EmployeeLicense[]> {
  const { data, error } = await supabase
    .from('employee_licenses')
    .select('*')
    .eq('workspace_id', WORKSPACE_ID)
    .eq('worker_profile_id', workerProfileId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) { console.error('[questionnaireService] getLicenses error', error); return []; }
  return (data ?? []) as EmployeeLicense[];
}

// ── Tags ─────────────────────────────────────────────────────────────────────

export async function getTags(workerProfileId: string): Promise<EmployeeTag[]> {
  const { data, error } = await supabase
    .from('employee_tags')
    .select('*')
    .eq('workspace_id', WORKSPACE_ID)
    .eq('worker_profile_id', workerProfileId)
    .order('tag_type', { ascending: true });

  if (error) { console.error('[questionnaireService] getTags error', error); return []; }
  return (data ?? []) as EmployeeTag[];
}

// ── Upload-to-Autofill Pipeline ───────────────────────────────────────────────

/**
 * Receives an AutofillExtractionResult (from document parse / AI extraction)
 * and hydrates the questionnaire draft. Does NOT create a worker_profile record.
 *
 * Fields below AUTOFILL_CONFIDENCE_THRESHOLD are included but flagged —
 * the UI layer decides how to highlight them for manual review.
 */
export async function applyAutofillToQuestionnaire(
  workerProfileId: string,
  extraction: AutofillExtractionResult
): Promise<QuestionnaireDraft | null> {
  const licenses: EmployeeLicenseInsert[] = extraction.licenses.map((l, idx) => ({
    workspace_id: WORKSPACE_ID,
    worker_profile_id: workerProfileId,
    license_type: l.license_type,
    license_number: l.license_number ?? null,
    issuing_state: l.issuing_state ?? null,
    issued_date: l.issued_date ?? null,
    expiry_date: l.expiry_date ?? null,
    is_primary: idx === 0,
    source: 'upload',
  }));

  const tags: EmployeeTagInsert[] = extraction.tags.map(t => ({
    workspace_id: WORKSPACE_ID,
    worker_profile_id: workerProfileId,
    tag_type: t.tag_type,
    tag_value: t.tag_value,
    source: 'upload',
  }));

  return upsertQuestionnaireDraft({
    workspace_id: WORKSPACE_ID,
    worker_profile_id: workerProfileId,
    answers: extraction.answers,
    licenses,
    tags,
    autofill: {
      confidence: extraction.confidence,
      filename: extraction.filename,
      file_url: extraction.file_url,
    },
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns field keys where confidence is below threshold (needs manual review) */
export function getLowConfidenceFields(draft: QuestionnaireDraft): string[] {
  if (!draft.autofill_confidence) return [];
  return Object.entries(draft.autofill_confidence)
    .filter(([, score]) => score < AUTOFILL_CONFIDENCE_THRESHOLD)
    .map(([key]) => key);
}

/** Check whether a field was populated by upload (vs manually entered) */
export function isAutofilled(draft: QuestionnaireDraft, fieldKey: string): boolean {
  return draft.autofill_source !== 'manual' && fieldKey in (draft.autofill_confidence ?? {});
}
