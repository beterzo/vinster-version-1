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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      enthousiasme_responses: {
        Row: {
          created_at: string
          eerste_werk_leukste_taken: string | null
          eerste_werk_onderwerpen: string | null
          eerste_werk_werkomstandigheden: string | null
          fluitend_thuiskomen_dag: string | null
          id: string
          kindertijd_activiteiten: string | null
          kindertijd_interesses_nieuw: string | null
          kindertijd_plekken: string | null
          leuk_project_en_rol: string | null
          plezierige_werkperiode_beschrijving: string | null
          round_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          eerste_werk_leukste_taken?: string | null
          eerste_werk_onderwerpen?: string | null
          eerste_werk_werkomstandigheden?: string | null
          fluitend_thuiskomen_dag?: string | null
          id?: string
          kindertijd_activiteiten?: string | null
          kindertijd_interesses_nieuw?: string | null
          kindertijd_plekken?: string | null
          leuk_project_en_rol?: string | null
          plezierige_werkperiode_beschrijving?: string | null
          round_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          eerste_werk_leukste_taken?: string | null
          eerste_werk_onderwerpen?: string | null
          eerste_werk_werkomstandigheden?: string | null
          fluitend_thuiskomen_dag?: string | null
          id?: string
          kindertijd_activiteiten?: string | null
          kindertijd_interesses_nieuw?: string | null
          kindertijd_plekken?: string | null
          leuk_project_en_rol?: string | null
          plezierige_werkperiode_beschrijving?: string | null
          round_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enthousiasme_responses_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "user_rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enthousiasme_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      extra_informatie_responses: {
        Row: {
          beroepsopleiding: string | null
          created_at: string
          fysieke_beperkingen: string | null
          id: string
          opleidingsniveau: string | null
          round_id: string | null
          sector_voorkeur: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          beroepsopleiding?: string | null
          created_at?: string
          fysieke_beperkingen?: string | null
          id?: string
          opleidingsniveau?: string | null
          round_id?: string | null
          sector_voorkeur?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          beroepsopleiding?: string | null
          created_at?: string
          fysieke_beperkingen?: string | null
          id?: string
          opleidingsniveau?: string | null
          round_id?: string | null
          sector_voorkeur?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "extra_informatie_responses_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "user_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_resets: {
        Row: {
          created_at: string
          id: string
          reset_completed: boolean
          updated_at: string
          user_id: string
          webhook_processed: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          reset_completed?: boolean
          updated_at?: string
          user_id: string
          webhook_processed?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          reset_completed?: boolean
          updated_at?: string
          user_id?: string
          webhook_processed?: boolean
        }
        Relationships: []
      }
      prioriteiten_responses: {
        Row: {
          created_at: string
          extra_activiteiten_tekst: string | null
          extra_interesses_tekst: string | null
          extra_werkomstandigheden_tekst: string | null
          id: string
          round_id: string | null
          selected_activiteiten_keywords: string[] | null
          selected_interesses_keywords: string[] | null
          selected_werkomstandigheden_keywords: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          extra_activiteiten_tekst?: string | null
          extra_interesses_tekst?: string | null
          extra_werkomstandigheden_tekst?: string | null
          id?: string
          round_id?: string | null
          selected_activiteiten_keywords?: string[] | null
          selected_interesses_keywords?: string[] | null
          selected_werkomstandigheden_keywords?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          extra_activiteiten_tekst?: string | null
          extra_interesses_tekst?: string | null
          extra_werkomstandigheden_tekst?: string | null
          id?: string
          round_id?: string | null
          selected_activiteiten_keywords?: string[] | null
          selected_interesses_keywords?: string[] | null
          selected_werkomstandigheden_keywords?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prioriteiten_responses_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "user_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ai_interesses: string | null
          ai_lievelings_activiteiten: string | null
          ai_werkomstandigheden: string | null
          created_at: string
          first_name: string
          has_paid: boolean
          id: string
          language: string | null
          last_name: string
          updated_at: string
        }
        Insert: {
          ai_interesses?: string | null
          ai_lievelings_activiteiten?: string | null
          ai_werkomstandigheden?: string | null
          created_at?: string
          first_name: string
          has_paid?: boolean
          id: string
          language?: string | null
          last_name: string
          updated_at?: string
        }
        Update: {
          ai_interesses?: string | null
          ai_lievelings_activiteiten?: string | null
          ai_werkomstandigheden?: string | null
          created_at?: string
          first_name?: string
          has_paid?: boolean
          id?: string
          language?: string | null
          last_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          created_at: string
          generated_at: string | null
          id: string
          pdf_file_path: string | null
          pdf_generated_at: string | null
          report_content: Json | null
          report_data: Json | null
          report_status: string
          round_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          generated_at?: string | null
          id?: string
          pdf_file_path?: string | null
          pdf_generated_at?: string | null
          report_content?: Json | null
          report_data?: Json | null
          report_status?: string
          round_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          generated_at?: string | null
          id?: string
          pdf_file_path?: string | null
          pdf_generated_at?: string | null
          report_content?: Json | null
          report_data?: Json | null
          report_status?: string
          round_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "user_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rounds: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          round_number: number
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          round_number?: number
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          round_number?: number
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_zoekprofielen: {
        Row: {
          created_at: string
          id: string
          pdf_generated_at: string | null
          pdf_status: string
          pdf_url: string | null
          updated_at: string
          user_id: string
          zoekprofiel_content: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          pdf_generated_at?: string | null
          pdf_status?: string
          pdf_url?: string | null
          updated_at?: string
          user_id: string
          zoekprofiel_content?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          pdf_generated_at?: string | null
          pdf_status?: string
          pdf_url?: string | null
          updated_at?: string
          user_id?: string
          zoekprofiel_content?: Json | null
        }
        Relationships: []
      }
      wensberoepen_responses: {
        Row: {
          created_at: string
          id: string
          round_id: string | null
          updated_at: string
          user_id: string
          wensberoep_1_belangrijke_aspecten: string | null
          wensberoep_1_fluitend_thuiskomen_dag: string | null
          wensberoep_1_kennis_focus: string | null
          wensberoep_1_leukste_onderdelen: string | null
          wensberoep_1_samenwerking_contacten: string | null
          wensberoep_1_titel: string | null
          wensberoep_1_werk_doel: string | null
          wensberoep_1_werklocatie_omgeving: string | null
          wensberoep_1_werkweek_activiteiten: string | null
          wensberoep_2_belangrijke_aspecten: string | null
          wensberoep_2_fluitend_thuiskomen_dag: string | null
          wensberoep_2_kennis_focus: string | null
          wensberoep_2_leukste_onderdelen: string | null
          wensberoep_2_samenwerking_contacten: string | null
          wensberoep_2_titel: string | null
          wensberoep_2_werk_doel: string | null
          wensberoep_2_werklocatie_omgeving: string | null
          wensberoep_2_werkweek_activiteiten: string | null
          wensberoep_3_belangrijke_aspecten: string | null
          wensberoep_3_fluitend_thuiskomen_dag: string | null
          wensberoep_3_kennis_focus: string | null
          wensberoep_3_leukste_onderdelen: string | null
          wensberoep_3_samenwerking_contacten: string | null
          wensberoep_3_titel: string | null
          wensberoep_3_werk_doel: string | null
          wensberoep_3_werklocatie_omgeving: string | null
          wensberoep_3_werkweek_activiteiten: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          round_id?: string | null
          updated_at?: string
          user_id: string
          wensberoep_1_belangrijke_aspecten?: string | null
          wensberoep_1_fluitend_thuiskomen_dag?: string | null
          wensberoep_1_kennis_focus?: string | null
          wensberoep_1_leukste_onderdelen?: string | null
          wensberoep_1_samenwerking_contacten?: string | null
          wensberoep_1_titel?: string | null
          wensberoep_1_werk_doel?: string | null
          wensberoep_1_werklocatie_omgeving?: string | null
          wensberoep_1_werkweek_activiteiten?: string | null
          wensberoep_2_belangrijke_aspecten?: string | null
          wensberoep_2_fluitend_thuiskomen_dag?: string | null
          wensberoep_2_kennis_focus?: string | null
          wensberoep_2_leukste_onderdelen?: string | null
          wensberoep_2_samenwerking_contacten?: string | null
          wensberoep_2_titel?: string | null
          wensberoep_2_werk_doel?: string | null
          wensberoep_2_werklocatie_omgeving?: string | null
          wensberoep_2_werkweek_activiteiten?: string | null
          wensberoep_3_belangrijke_aspecten?: string | null
          wensberoep_3_fluitend_thuiskomen_dag?: string | null
          wensberoep_3_kennis_focus?: string | null
          wensberoep_3_leukste_onderdelen?: string | null
          wensberoep_3_samenwerking_contacten?: string | null
          wensberoep_3_titel?: string | null
          wensberoep_3_werk_doel?: string | null
          wensberoep_3_werklocatie_omgeving?: string | null
          wensberoep_3_werkweek_activiteiten?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          round_id?: string | null
          updated_at?: string
          user_id?: string
          wensberoep_1_belangrijke_aspecten?: string | null
          wensberoep_1_fluitend_thuiskomen_dag?: string | null
          wensberoep_1_kennis_focus?: string | null
          wensberoep_1_leukste_onderdelen?: string | null
          wensberoep_1_samenwerking_contacten?: string | null
          wensberoep_1_titel?: string | null
          wensberoep_1_werk_doel?: string | null
          wensberoep_1_werklocatie_omgeving?: string | null
          wensberoep_1_werkweek_activiteiten?: string | null
          wensberoep_2_belangrijke_aspecten?: string | null
          wensberoep_2_fluitend_thuiskomen_dag?: string | null
          wensberoep_2_kennis_focus?: string | null
          wensberoep_2_leukste_onderdelen?: string | null
          wensberoep_2_samenwerking_contacten?: string | null
          wensberoep_2_titel?: string | null
          wensberoep_2_werk_doel?: string | null
          wensberoep_2_werklocatie_omgeving?: string | null
          wensberoep_2_werkweek_activiteiten?: string | null
          wensberoep_3_belangrijke_aspecten?: string | null
          wensberoep_3_fluitend_thuiskomen_dag?: string | null
          wensberoep_3_kennis_focus?: string | null
          wensberoep_3_leukste_onderdelen?: string | null
          wensberoep_3_samenwerking_contacten?: string | null
          wensberoep_3_titel?: string | null
          wensberoep_3_werk_doel?: string | null
          wensberoep_3_werklocatie_omgeving?: string | null
          wensberoep_3_werkweek_activiteiten?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wensberoepen_responses_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "user_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      zoekprofiel_antwoorden: {
        Row: {
          arbeidsvoorwaarden: string | null
          created_at: string
          functie_als: string | null
          gewenste_regio: string | null
          id: string
          kerntaken: string | null
          organisatie_bij: string | null
          round_id: string | null
          sector: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          arbeidsvoorwaarden?: string | null
          created_at?: string
          functie_als?: string | null
          gewenste_regio?: string | null
          id?: string
          kerntaken?: string | null
          organisatie_bij?: string | null
          round_id?: string | null
          sector?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          arbeidsvoorwaarden?: string | null
          created_at?: string
          functie_als?: string | null
          gewenste_regio?: string | null
          id?: string
          kerntaken?: string | null
          organisatie_bij?: string | null
          round_id?: string | null
          sector?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "zoekprofiel_antwoorden_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "user_rounds"
            referencedColumns: ["id"]
          },
        ]
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
