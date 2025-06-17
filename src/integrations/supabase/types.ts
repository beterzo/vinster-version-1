export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      enthousiasme_responses: {
        Row: {
          created_at: string
          eerste_werk_leukste_aspecten: string | null
          fluitend_thuiskomen_dag: string | null
          id: string
          kindertijd_favoriete_plekken: string | null
          kindertijd_interesses: string | null
          kindertijd_liefste_activiteiten: string | null
          leuk_project_en_rol: string | null
          plezierige_werkperiode_beschrijving: string | null
          samenwerking_prettige_aspecten: string | null
          school_interessantste_vakken: string | null
          school_naschoolse_activiteiten: string | null
          school_thuiskomst_activiteiten: string | null
          updated_at: string
          user_id: string
          werkomgeving_aantrekkelijke_elementen: string | null
        }
        Insert: {
          created_at?: string
          eerste_werk_leukste_aspecten?: string | null
          fluitend_thuiskomen_dag?: string | null
          id?: string
          kindertijd_favoriete_plekken?: string | null
          kindertijd_interesses?: string | null
          kindertijd_liefste_activiteiten?: string | null
          leuk_project_en_rol?: string | null
          plezierige_werkperiode_beschrijving?: string | null
          samenwerking_prettige_aspecten?: string | null
          school_interessantste_vakken?: string | null
          school_naschoolse_activiteiten?: string | null
          school_thuiskomst_activiteiten?: string | null
          updated_at?: string
          user_id: string
          werkomgeving_aantrekkelijke_elementen?: string | null
        }
        Update: {
          created_at?: string
          eerste_werk_leukste_aspecten?: string | null
          fluitend_thuiskomen_dag?: string | null
          id?: string
          kindertijd_favoriete_plekken?: string | null
          kindertijd_interesses?: string | null
          kindertijd_liefste_activiteiten?: string | null
          leuk_project_en_rol?: string | null
          plezierige_werkperiode_beschrijving?: string | null
          samenwerking_prettige_aspecten?: string | null
          school_interessantste_vakken?: string | null
          school_naschoolse_activiteiten?: string | null
          school_thuiskomst_activiteiten?: string | null
          updated_at?: string
          user_id?: string
          werkomgeving_aantrekkelijke_elementen?: string | null
        }
        Relationships: [
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
          sector_voorkeur?: string | null
          updated_at?: string
          user_id?: string
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
          selected_activiteiten_keywords?: string[] | null
          selected_interesses_keywords?: string[] | null
          selected_werkomstandigheden_keywords?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_interesses: string | null
          ai_lievelings_activiteiten: string | null
          ai_werkomstandigheden: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          updated_at: string
        }
        Insert: {
          ai_interesses?: string | null
          ai_lievelings_activiteiten?: string | null
          ai_werkomstandigheden?: string | null
          created_at?: string
          first_name: string
          id: string
          last_name: string
          updated_at?: string
        }
        Update: {
          ai_interesses?: string | null
          ai_lievelings_activiteiten?: string | null
          ai_werkomstandigheden?: string | null
          created_at?: string
          first_name?: string
          id?: string
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
          report_data: Json | null
          report_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          generated_at?: string | null
          id?: string
          pdf_file_path?: string | null
          pdf_generated_at?: string | null
          report_data?: Json | null
          report_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          generated_at?: string | null
          id?: string
          pdf_file_path?: string | null
          pdf_generated_at?: string | null
          report_data?: Json | null
          report_status?: string
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
        }
        Insert: {
          created_at?: string
          id?: string
          pdf_generated_at?: string | null
          pdf_status?: string
          pdf_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pdf_generated_at?: string | null
          pdf_status?: string
          pdf_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wensberoepen_responses: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
          wensberoep_1_belangrijke_aspecten: string | null
          wensberoep_1_binnen_buiten_verhouding: string | null
          wensberoep_1_fluitend_thuiskomen_dag: string | null
          wensberoep_1_kennis_focus: string | null
          wensberoep_1_leukste_onderdelen: string | null
          wensberoep_1_reistijd: string | null
          wensberoep_1_samenwerking_contacten: string | null
          wensberoep_1_titel: string | null
          wensberoep_1_werk_doel: string | null
          wensberoep_1_werklocatie_omgeving: string | null
          wensberoep_1_werksfeer: string | null
          wensberoep_1_werkuren: string | null
          wensberoep_1_werkweek_activiteiten: string | null
          wensberoep_2_belangrijke_aspecten: string | null
          wensberoep_2_binnen_buiten_verhouding: string | null
          wensberoep_2_fluitend_thuiskomen_dag: string | null
          wensberoep_2_kennis_focus: string | null
          wensberoep_2_leukste_onderdelen: string | null
          wensberoep_2_reistijd: string | null
          wensberoep_2_samenwerking_contacten: string | null
          wensberoep_2_titel: string | null
          wensberoep_2_werk_doel: string | null
          wensberoep_2_werklocatie_omgeving: string | null
          wensberoep_2_werksfeer: string | null
          wensberoep_2_werkuren: string | null
          wensberoep_2_werkweek_activiteiten: string | null
          wensberoep_3_belangrijke_aspecten: string | null
          wensberoep_3_binnen_buiten_verhouding: string | null
          wensberoep_3_fluitend_thuiskomen_dag: string | null
          wensberoep_3_kennis_focus: string | null
          wensberoep_3_leukste_onderdelen: string | null
          wensberoep_3_reistijd: string | null
          wensberoep_3_samenwerking_contacten: string | null
          wensberoep_3_titel: string | null
          wensberoep_3_werk_doel: string | null
          wensberoep_3_werklocatie_omgeving: string | null
          wensberoep_3_werksfeer: string | null
          wensberoep_3_werkuren: string | null
          wensberoep_3_werkweek_activiteiten: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          wensberoep_1_belangrijke_aspecten?: string | null
          wensberoep_1_binnen_buiten_verhouding?: string | null
          wensberoep_1_fluitend_thuiskomen_dag?: string | null
          wensberoep_1_kennis_focus?: string | null
          wensberoep_1_leukste_onderdelen?: string | null
          wensberoep_1_reistijd?: string | null
          wensberoep_1_samenwerking_contacten?: string | null
          wensberoep_1_titel?: string | null
          wensberoep_1_werk_doel?: string | null
          wensberoep_1_werklocatie_omgeving?: string | null
          wensberoep_1_werksfeer?: string | null
          wensberoep_1_werkuren?: string | null
          wensberoep_1_werkweek_activiteiten?: string | null
          wensberoep_2_belangrijke_aspecten?: string | null
          wensberoep_2_binnen_buiten_verhouding?: string | null
          wensberoep_2_fluitend_thuiskomen_dag?: string | null
          wensberoep_2_kennis_focus?: string | null
          wensberoep_2_leukste_onderdelen?: string | null
          wensberoep_2_reistijd?: string | null
          wensberoep_2_samenwerking_contacten?: string | null
          wensberoep_2_titel?: string | null
          wensberoep_2_werk_doel?: string | null
          wensberoep_2_werklocatie_omgeving?: string | null
          wensberoep_2_werksfeer?: string | null
          wensberoep_2_werkuren?: string | null
          wensberoep_2_werkweek_activiteiten?: string | null
          wensberoep_3_belangrijke_aspecten?: string | null
          wensberoep_3_binnen_buiten_verhouding?: string | null
          wensberoep_3_fluitend_thuiskomen_dag?: string | null
          wensberoep_3_kennis_focus?: string | null
          wensberoep_3_leukste_onderdelen?: string | null
          wensberoep_3_reistijd?: string | null
          wensberoep_3_samenwerking_contacten?: string | null
          wensberoep_3_titel?: string | null
          wensberoep_3_werk_doel?: string | null
          wensberoep_3_werklocatie_omgeving?: string | null
          wensberoep_3_werksfeer?: string | null
          wensberoep_3_werkuren?: string | null
          wensberoep_3_werkweek_activiteiten?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          wensberoep_1_belangrijke_aspecten?: string | null
          wensberoep_1_binnen_buiten_verhouding?: string | null
          wensberoep_1_fluitend_thuiskomen_dag?: string | null
          wensberoep_1_kennis_focus?: string | null
          wensberoep_1_leukste_onderdelen?: string | null
          wensberoep_1_reistijd?: string | null
          wensberoep_1_samenwerking_contacten?: string | null
          wensberoep_1_titel?: string | null
          wensberoep_1_werk_doel?: string | null
          wensberoep_1_werklocatie_omgeving?: string | null
          wensberoep_1_werksfeer?: string | null
          wensberoep_1_werkuren?: string | null
          wensberoep_1_werkweek_activiteiten?: string | null
          wensberoep_2_belangrijke_aspecten?: string | null
          wensberoep_2_binnen_buiten_verhouding?: string | null
          wensberoep_2_fluitend_thuiskomen_dag?: string | null
          wensberoep_2_kennis_focus?: string | null
          wensberoep_2_leukste_onderdelen?: string | null
          wensberoep_2_reistijd?: string | null
          wensberoep_2_samenwerking_contacten?: string | null
          wensberoep_2_titel?: string | null
          wensberoep_2_werk_doel?: string | null
          wensberoep_2_werklocatie_omgeving?: string | null
          wensberoep_2_werksfeer?: string | null
          wensberoep_2_werkuren?: string | null
          wensberoep_2_werkweek_activiteiten?: string | null
          wensberoep_3_belangrijke_aspecten?: string | null
          wensberoep_3_binnen_buiten_verhouding?: string | null
          wensberoep_3_fluitend_thuiskomen_dag?: string | null
          wensberoep_3_kennis_focus?: string | null
          wensberoep_3_leukste_onderdelen?: string | null
          wensberoep_3_reistijd?: string | null
          wensberoep_3_samenwerking_contacten?: string | null
          wensberoep_3_titel?: string | null
          wensberoep_3_werk_doel?: string | null
          wensberoep_3_werklocatie_omgeving?: string | null
          wensberoep_3_werksfeer?: string | null
          wensberoep_3_werkuren?: string | null
          wensberoep_3_werkweek_activiteiten?: string | null
        }
        Relationships: []
      }
      zoekprofiel_responses: {
        Row: {
          arbeidsvoorwaarden: string | null
          created_at: string
          functie_als: string | null
          gewenste_regio: string | null
          id: string
          kerntaken: string | null
          organisatie_bij: string | null
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
          sector?: string | null
          updated_at?: string
          user_id?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
