/**
 * PF: Questionnaire Schema Foundation
 * Types for the draft_answers → submit pipeline.
 *
 * Design contract:
 *   - Upload-to-autofill HYDRATES questionnaire state. It does NOT create records.
 *   - Manual entry and upload share the same save pipeline (upsertDraft).
 *   - Questionnaire is the single source of truth until submission.
 *   - Employee licenses are repeatable normalized rows, not a flat text field.
 *   - Employee tags replace scattered array columns (populations_served, etc.).
 */

// ── Core answer map ──────────────────────────────────────────────────────────
// All questionnaire field values live here as a flat key→value map.
// This is the shape of questionnaire_draft_answers.answer_json in the DB.
export interface QuestionnaireAnswers {
  // Basics
  first_name?: string;
  last_name?: string;
  email?: string;
  date_of_birth?: string;
  // Credentials (flat fields — repeatable licenses are in EmployeeLicense rows)
  npi_number?: string;
  caqh_number?: string;
  // Address
  address?: string;
  city?: string;
  county?: string;
  state?: string;
  zip_code?: string;
  // Catch-all for future fields without a schema migration
  [key: string]: string | undefined;
}

// ── Autofill confidence ──────────────────────────────────────────────────────
// Per-field confidence scores returned from document extraction (0.0–1.0).
// Fields below AUTOFILL_CONFIDENCE_THRESHOLD should be flagged for manual review.
export const AUTOFILL_CONFIDENCE_THRESHOLD = 0.75;

export interface AutofillConfidence {
  [fieldKey: string]: number; // 0.0 – 1.0
}

// ── Draft ────────────────────────────────────────────────────────────────────
export type AutofillSource = 'manual' | 'upload' | 'mixed';

export interface QuestionnaireDraft {
  id: string;
  workspace_id: string;
  worker_profile_id: string;
  answer_json: QuestionnaireAnswers;
  autofill_source: AutofillSource;
  autofill_confidence: AutofillConfidence;
  uploaded_file_url: string | null;
  upload_filename: string | null;
  /** Field keys that have been manually confirmed — skip re-autofill on next upload */
  locked_fields: string[];
  questionnaire_version: number;
  created_at: string;
  updated_at: string;
}

// ── Employee Licenses ────────────────────────────────────────────────────────
// Repeatable — one row per license. A worker can hold LPC + NCC + LICSW, etc.
export interface EmployeeLicense {
  id: string;
  workspace_id: string;
  worker_profile_id: string;
  license_type: string;       // e.g. 'LPC', 'LCSW', 'NCC'
  license_number: string | null;
  issuing_state: string | null;
  issued_date: string | null;  // ISO date string
  expiry_date: string | null;  // ISO date string
  is_primary: boolean;
  source: 'manual' | 'upload';
  created_at: string;
  updated_at: string;
}

export type EmployeeLicenseInsert = Omit<EmployeeLicense, 'id' | 'created_at' | 'updated_at'>;

// ── Employee Tags ────────────────────────────────────────────────────────────
// Unified tag table replacing populations_served[], provider_ethnicity[], etc.
export type EmployeeTagType = 'population' | 'ethnicity' | 'modality' | 'language' | 'specialty' | 'other';

export interface EmployeeTag {
  id: string;
  workspace_id: string;
  worker_profile_id: string;
  tag_type: EmployeeTagType;
  tag_value: string;
  source: 'manual' | 'upload';
  created_at: string;
}

export type EmployeeTagInsert = Omit<EmployeeTag, 'id' | 'created_at'>;

// ── Upload Pipeline ──────────────────────────────────────────────────────────
// Shape of the autofill result returned from the document extraction step.
// This is NOT persisted directly — it is used to hydrate the questionnaire draft.
export interface AutofillExtractionResult {
  answers: QuestionnaireAnswers;
  licenses: Array<Omit<EmployeeLicenseInsert, 'workspace_id' | 'worker_profile_id' | 'source'>>;
  tags: Array<Omit<EmployeeTagInsert, 'workspace_id' | 'worker_profile_id' | 'source'>>;
  confidence: AutofillConfidence;
  filename: string;
  file_url: string | null;
}

// ── Save Pipeline Input ──────────────────────────────────────────────────────
// Shared input shape for both manual save and upload-hydrated save.
// Both paths flow through upsertQuestionnaireDraft().
export interface SaveDraftPayload {
  workspace_id: string;
  worker_profile_id: string;
  answers: QuestionnaireAnswers;
  licenses: EmployeeLicenseInsert[];
  tags: EmployeeTagInsert[];
  /** Pass extraction result to record autofill metadata; omit for manual saves */
  autofill?: Pick<AutofillExtractionResult, 'confidence' | 'filename' | 'file_url'>;
  /** Field keys the user has explicitly confirmed; merged with existing locked_fields */
  newly_locked_fields?: string[];
}
