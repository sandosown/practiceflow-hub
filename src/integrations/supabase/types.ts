export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      employee_licenses: {
        Row: {
          created_at: string
          expiry_date: string | null
          id: string
          is_primary: boolean
          issued_date: string | null
          issuing_state: string | null
          license_number: string | null
          license_type: string
          source: string | null
          updated_at: string
          worker_profile_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_primary?: boolean
          issued_date?: string | null
          issuing_state?: string | null
          license_number?: string | null
          license_type: string
          source?: string | null
          updated_at?: string
          worker_profile_id: string
          workspace_id?: string
        }
        Update: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_primary?: boolean
          issued_date?: string | null
          issuing_state?: string | null
          license_number?: string | null
          license_type?: string
          source?: string | null
          updated_at?: string
          worker_profile_id?: string
          workspace_id?: string
        }
        Relationships: []
      }
      employee_tags: {
        Row: {
          created_at: string
          id: string
          source: string | null
          tag_type: string
          tag_value: string
          worker_profile_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          source?: string | null
          tag_type: string
          tag_value: string
          worker_profile_id: string
          workspace_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          source?: string | null
          tag_type?: string
          tag_value?: string
          worker_profile_id?: string
          workspace_id?: string
        }
        Relationships: []
      }
      gp_announcements: {
        Row: {
          body: string
          created_at: string
          created_by_profile_id: string
          id: string
          pinned: boolean
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          created_by_profile_id: string
          id?: string
          pinned?: boolean
          title: string
          updated_at?: string
          workspace_id?: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by_profile_id?: string
          id?: string
          pinned?: boolean
          title?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      gp_clients: {
        Row: {
          created_at: string
          date_of_birth: string | null
          first_name: string
          id: string
          last_name: string
          location: string | null
          primary_clinician_profile_id: string | null
          status: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          first_name: string
          id?: string
          last_name: string
          location?: string | null
          primary_clinician_profile_id?: string | null
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          id?: string
          last_name?: string
          location?: string | null
          primary_clinician_profile_id?: string | null
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      gp_payers: {
        Row: {
          claims_address: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          id: string
          notes: string | null
          payer_id: string | null
          payer_name: string
          submission_deadlines: string | null
          workspace_id: string
        }
        Insert: {
          claims_address?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          id?: string
          notes?: string | null
          payer_id?: string | null
          payer_name: string
          submission_deadlines?: string | null
          workspace_id?: string
        }
        Update: {
          claims_address?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          id?: string
          notes?: string | null
          payer_id?: string | null
          payer_name?: string
          submission_deadlines?: string | null
          workspace_id?: string
        }
        Relationships: []
      }
      gp_resources: {
        Row: {
          category: string
          content: string | null
          id: string
          resource_type: string
          title: string
          updated_at: string
          url: string | null
          workspace_id: string
        }
        Insert: {
          category?: string
          content?: string | null
          id?: string
          resource_type?: string
          title: string
          updated_at?: string
          url?: string | null
          workspace_id?: string
        }
        Update: {
          category?: string
          content?: string | null
          id?: string
          resource_type?: string
          title?: string
          updated_at?: string
          url?: string | null
          workspace_id?: string
        }
        Relationships: []
      }
      gp_staff_updates: {
        Row: {
          author_profile_id: string
          body: string
          created_at: string
          id: string
          visibility: string
          workspace_id: string
        }
        Insert: {
          author_profile_id: string
          body?: string
          created_at?: string
          id?: string
          visibility?: string
          workspace_id?: string
        }
        Update: {
          author_profile_id?: string
          body?: string
          created_at?: string
          id?: string
          visibility?: string
          workspace_id?: string
        }
        Relationships: []
      }
      gp_supervision_sessions: {
        Row: {
          day_of_week: number
          facilitator_profile_id: string
          id: string
          location_detail: string | null
          location_mode: string
          notes: string | null
          time: string
          workspace_id: string
        }
        Insert: {
          day_of_week?: number
          facilitator_profile_id: string
          id?: string
          location_detail?: string | null
          location_mode?: string
          notes?: string | null
          time?: string
          workspace_id?: string
        }
        Update: {
          day_of_week?: number
          facilitator_profile_id?: string
          id?: string
          location_detail?: string | null
          location_mode?: string
          notes?: string | null
          time?: string
          workspace_id?: string
        }
        Relationships: []
      }
      gp_treatment_plan_cycles: {
        Row: {
          approved_at: string | null
          approved_by_profile_id: string | null
          assigned_to_profile_id: string | null
          client_id: string | null
          cycle_key: string
          due_date: string
          id: string
          state: string
          submitted_at: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by_profile_id?: string | null
          assigned_to_profile_id?: string | null
          client_id?: string | null
          cycle_key: string
          due_date: string
          id?: string
          state?: string
          submitted_at?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Update: {
          approved_at?: string | null
          approved_by_profile_id?: string | null
          assigned_to_profile_id?: string | null
          client_id?: string | null
          cycle_key?: string
          due_date?: string
          id?: string
          state?: string
          submitted_at?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gp_treatment_plan_cycles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "gp_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      gp_vendors: {
        Row: {
          documents_due_date: string | null
          id: string
          invoice_submission_window: string | null
          main_contact_email: string | null
          main_contact_name: string | null
          main_contact_phone: string | null
          notes: string | null
          notes_submission_timeframe: string | null
          vendor_name: string
          workspace_id: string
        }
        Insert: {
          documents_due_date?: string | null
          id?: string
          invoice_submission_window?: string | null
          main_contact_email?: string | null
          main_contact_name?: string | null
          main_contact_phone?: string | null
          notes?: string | null
          notes_submission_timeframe?: string | null
          vendor_name: string
          workspace_id?: string
        }
        Update: {
          documents_due_date?: string | null
          id?: string
          invoice_submission_window?: string | null
          main_contact_email?: string | null
          main_contact_name?: string | null
          main_contact_phone?: string | null
          notes?: string | null
          notes_submission_timeframe?: string | null
          vendor_name?: string
          workspace_id?: string
        }
        Relationships: []
      }
      gp_worker_profiles: {
        Row: {
          address: string | null
          caqh_number: string | null
          city: string | null
          county: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          license_type: string | null
          npi_number: string | null
          populations_served: string[] | null
          provider_ethnicity: string[] | null
          review_note: string | null
          reviewed_at: string | null
          reviewed_by_profile_id: string | null
          state: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          worker_profile_id: string
          workspace_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          caqh_number?: string | null
          city?: string | null
          county?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          license_type?: string | null
          npi_number?: string | null
          populations_served?: string[] | null
          provider_ethnicity?: string[] | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by_profile_id?: string | null
          state?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          worker_profile_id: string
          workspace_id?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          caqh_number?: string | null
          city?: string | null
          county?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          license_type?: string | null
          npi_number?: string | null
          populations_served?: string[] | null
          provider_ethnicity?: string[] | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by_profile_id?: string | null
          state?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          worker_profile_id?: string
          workspace_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      operating_profiles: {
        Row: {
          created_at: string
          domain_labels: Json
          domain_priority: string[]
          domains: Json
          has_interns: boolean
          has_staff: boolean
          id: string
          notification_style: string
          notifications_pref: string
          onboarding_complete: boolean
          owner_profile_id: string
          practice_mode: string
          updated_at: string
          uses_referrals: boolean
        }
        Insert: {
          created_at?: string
          domain_labels?: Json
          domain_priority?: string[]
          domains?: Json
          has_interns?: boolean
          has_staff?: boolean
          id?: string
          notification_style?: string
          notifications_pref?: string
          onboarding_complete?: boolean
          owner_profile_id: string
          practice_mode?: string
          updated_at?: string
          uses_referrals?: boolean
        }
        Update: {
          created_at?: string
          domain_labels?: Json
          domain_priority?: string[]
          domains?: Json
          has_interns?: boolean
          has_staff?: boolean
          id?: string
          notification_style?: string
          notifications_pref?: string
          onboarding_complete?: boolean
          owner_profile_id?: string
          practice_mode?: string
          updated_at?: string
          uses_referrals?: boolean
        }
        Relationships: []
      }
      questionnaire_draft_answers: {
        Row: {
          answer_json: Json
          autofill_confidence: Json | null
          autofill_source: string | null
          created_at: string
          id: string
          locked_fields: string[] | null
          questionnaire_version: number
          updated_at: string
          upload_filename: string | null
          uploaded_file_url: string | null
          worker_profile_id: string
          workspace_id: string
        }
        Insert: {
          answer_json?: Json
          autofill_confidence?: Json | null
          autofill_source?: string | null
          created_at?: string
          id?: string
          locked_fields?: string[] | null
          questionnaire_version?: number
          updated_at?: string
          upload_filename?: string | null
          uploaded_file_url?: string | null
          worker_profile_id: string
          workspace_id?: string
        }
        Update: {
          answer_json?: Json
          autofill_confidence?: Json | null
          autofill_source?: string | null
          created_at?: string
          id?: string
          locked_fields?: string[] | null
          questionnaire_version?: number
          updated_at?: string
          upload_filename?: string | null
          uploaded_file_url?: string | null
          worker_profile_id?: string
          workspace_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
