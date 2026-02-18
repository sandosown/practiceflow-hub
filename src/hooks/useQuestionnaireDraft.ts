/**
 * PF: useQuestionnaireDraft
 *
 * React hook that owns the questionnaire draft state.
 * Both manual entry and upload-autofill paths use this hook
 * as the single interface to the draft_answers pipeline.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  QuestionnaireDraft,
  EmployeeLicense,
  EmployeeTag,
  EmployeeTagType,
  QuestionnaireAnswers,
  AutofillExtractionResult,
  EmployeeLicenseInsert,
  EmployeeTagInsert,
} from '@/types/questionnaire';
import {
  getDraft,
  getLicenses,
  getTags,
  upsertQuestionnaireDraft,
  applyAutofillToQuestionnaire,
  getLowConfidenceFields,
} from '@/lib/questionnaire/questionnaireService';
import { POPULATIONS_OPTIONS, ETHNICITY_OPTIONS } from '@/data/gpMockData';

const WORKSPACE_ID = 'w1';

export interface UseDraftReturn {
  // State
  draft: QuestionnaireDraft | null;
  answers: QuestionnaireAnswers;
  licenses: EmployeeLicense[];
  tags: EmployeeTag[];
  lowConfidenceFields: string[];
  loading: boolean;
  saving: boolean;
  // Answers
  setAnswer: (key: keyof QuestionnaireAnswers, value: string) => void;
  // Licenses (repeatable)
  addLicense: (license?: Partial<EmployeeLicense>) => void;
  updateLicense: (id: string, patch: Partial<EmployeeLicense>) => void;
  removeLicense: (id: string) => void;
  setPrimaryLicense: (id: string) => void;
  // Tags
  toggleTag: (tagType: EmployeeTagType, tagValue: string) => void;
  hasTag: (tagType: EmployeeTagType, tagValue: string) => boolean;
  // Save pipeline (shared by manual + upload)
  saveDraft: (lockFields?: string[]) => Promise<void>;
  // Upload-to-autofill: hydrates draft, does NOT create records
  applyAutofill: (extraction: AutofillExtractionResult) => Promise<void>;
  // Lock a field (marks it as manually confirmed, immune to re-autofill)
  lockField: (fieldKey: string) => void;
}

export function useQuestionnaireDraft(workerProfileId: string): UseDraftReturn {
  const [draft, setDraft] = useState<QuestionnaireDraft | null>(null);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [licenses, setLicenses] = useState<EmployeeLicense[]>([]);
  const [tags, setTags] = useState<EmployeeTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const lockedFieldsRef = useRef<string[]>([]);

  // Load on mount
  useEffect(() => {
    if (!workerProfileId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [d, ls, ts] = await Promise.all([
        getDraft(workerProfileId),
        getLicenses(workerProfileId),
        getTags(workerProfileId),
      ]);
      if (cancelled) return;
      setDraft(d);
      setAnswers(d?.answer_json ?? {});
      setLicenses(ls);
      setTags(ts);
      lockedFieldsRef.current = d?.locked_fields ?? [];
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [workerProfileId]);

  const lowConfidenceFields = draft ? getLowConfidenceFields(draft) : [];

  // ── Answers ──────────────────────────────────────────────────────────────
  const setAnswer = useCallback((key: keyof QuestionnaireAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }, []);

  // ── Licenses ─────────────────────────────────────────────────────────────
  const addLicense = useCallback((partial?: Partial<EmployeeLicense>) => {
    const newLicense: EmployeeLicense = {
      id: crypto.randomUUID(),
      workspace_id: WORKSPACE_ID,
      worker_profile_id: workerProfileId,
      license_type: '',
      license_number: null,
      issuing_state: null,
      issued_date: null,
      expiry_date: null,
      is_primary: false,
      source: 'manual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...partial,
    };
    setLicenses(prev => [...prev, newLicense]);
  }, [workerProfileId]);

  const updateLicense = useCallback((id: string, patch: Partial<EmployeeLicense>) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  }, []);

  const removeLicense = useCallback((id: string) => {
    setLicenses(prev => prev.filter(l => l.id !== id));
  }, []);

  const setPrimaryLicense = useCallback((id: string) => {
    setLicenses(prev => prev.map(l => ({ ...l, is_primary: l.id === id })));
  }, []);

  // ── Tags ─────────────────────────────────────────────────────────────────
  const toggleTag = useCallback((tagType: EmployeeTagType, tagValue: string) => {
    setTags(prev => {
      const exists = prev.some(t => t.tag_type === tagType && t.tag_value === tagValue);
      if (exists) return prev.filter(t => !(t.tag_type === tagType && t.tag_value === tagValue));
      const newTag: EmployeeTag = {
        id: crypto.randomUUID(),
        workspace_id: WORKSPACE_ID,
        worker_profile_id: workerProfileId,
        tag_type: tagType,
        tag_value: tagValue,
        source: 'manual',
        created_at: new Date().toISOString(),
      };
      return [...prev, newTag];
    });
  }, [workerProfileId]);

  const hasTag = useCallback((tagType: EmployeeTagType, tagValue: string): boolean => {
    return tags.some(t => t.tag_type === tagType && t.tag_value === tagValue);
  }, [tags]);

  // ── Lock field ────────────────────────────────────────────────────────────
  const lockField = useCallback((fieldKey: string) => {
    lockedFieldsRef.current = Array.from(new Set([...lockedFieldsRef.current, fieldKey]));
  }, []);

  // ── Shared save pipeline ──────────────────────────────────────────────────
  const saveDraft = useCallback(async (lockFields?: string[]) => {
    setSaving(true);
    try {
      const licenseInserts: EmployeeLicenseInsert[] = licenses.map(l => ({
        workspace_id: WORKSPACE_ID,
        worker_profile_id: workerProfileId,
        license_type: l.license_type,
        license_number: l.license_number,
        issuing_state: l.issuing_state,
        issued_date: l.issued_date,
        expiry_date: l.expiry_date,
        is_primary: l.is_primary,
        source: l.source,
      }));

      const tagInserts: EmployeeTagInsert[] = tags.map(t => ({
        workspace_id: WORKSPACE_ID,
        worker_profile_id: workerProfileId,
        tag_type: t.tag_type,
        tag_value: t.tag_value,
        source: t.source,
      }));

      const saved = await upsertQuestionnaireDraft({
        workspace_id: WORKSPACE_ID,
        worker_profile_id: workerProfileId,
        answers,
        licenses: licenseInserts,
        tags: tagInserts,
        newly_locked_fields: lockFields ?? lockedFieldsRef.current,
      });

      if (saved) {
        setDraft(saved);
        lockedFieldsRef.current = saved.locked_fields;
      }
    } finally {
      setSaving(false);
    }
  }, [workerProfileId, answers, licenses, tags]);

  // ── Upload-to-autofill ────────────────────────────────────────────────────
  // Hydrates questionnaire state from extraction result.
  // Does NOT create a worker_profile record.
  const applyAutofill = useCallback(async (extraction: AutofillExtractionResult) => {
    setSaving(true);
    try {
      const saved = await applyAutofillToQuestionnaire(workerProfileId, extraction);
      if (!saved) return;

      // Hydrate local state from what was saved
      setDraft(saved);
      setAnswers(saved.answer_json ?? {});
      lockedFieldsRef.current = saved.locked_fields;

      // Reload licenses and tags from DB (autofill wrote them)
      const [ls, ts] = await Promise.all([
        getLicenses(workerProfileId),
        getTags(workerProfileId),
      ]);
      setLicenses(ls);
      setTags(ts);
    } finally {
      setSaving(false);
    }
  }, [workerProfileId]);

  return {
    draft,
    answers,
    licenses,
    tags,
    lowConfidenceFields,
    loading,
    saving,
    setAnswer,
    addLicense,
    updateLicense,
    removeLicense,
    setPrimaryLicense,
    toggleTag,
    hasTag,
    saveDraft,
    applyAutofill,
    lockField,
  };
}
