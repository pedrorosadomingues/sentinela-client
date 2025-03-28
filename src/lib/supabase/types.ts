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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      coin_receipt: {
        Row: {
          amount: number
          created_at: string
          expiration_date: string
          id: number
          is_active: boolean
          total: number
          transaction_id: number | null
          type_id: number
          updated_at: string
          user_email: string
          v_coins: number
        }
        Insert: {
          amount: number
          created_at?: string
          expiration_date: string
          id?: number
          is_active: boolean
          total: number
          transaction_id?: number | null
          type_id: number
          updated_at: string
          user_email: string
          v_coins: number
        }
        Update: {
          amount?: number
          created_at?: string
          expiration_date?: string
          id?: number
          is_active?: boolean
          total?: number
          transaction_id?: number | null
          type_id?: number
          updated_at?: string
          user_email?: string
          v_coins?: number
        }
        Relationships: []
      }
      coin_receipt_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      download_image: {
        Row: {
          created_at: string
          generation_id: number
          id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          generation_id: number
          id?: number
          user_id: number
        }
        Update: {
          created_at?: string
          generation_id?: number
          id?: number
          user_id?: number
        }
        Relationships: []
      }
      generation: {
        Row: {
          deleted_at: string | null
          ended_at: string | null
          error_message: string | null
          fn: string
          garment_image_path: string
          generation_id: string
          id: number
          model_image_path: string
          params_fashn: Json
          paste_id: number | null
          path: string | null
          project_id: number | null
          started_at: string
          status: string
          user_id: number
        }
        Insert: {
          deleted_at?: string | null
          ended_at?: string | null
          error_message?: string | null
          fn: string
          garment_image_path: string
          generation_id: string
          id?: number
          model_image_path: string
          params_fashn: Json
          paste_id?: number | null
          path?: string | null
          project_id?: number | null
          started_at: string
          status: string
          user_id: number
        }
        Update: {
          deleted_at?: string | null
          ended_at?: string | null
          error_message?: string | null
          fn?: string
          garment_image_path?: string
          generation_id?: string
          id?: number
          model_image_path?: string
          params_fashn?: Json
          paste_id?: number | null
          path?: string | null
          project_id?: number | null
          started_at?: string
          status?: string
          user_id?: number
        }
        Relationships: []
      }
      image_function: {
        Row: {
          cost: number
          id: number
          is_beta: boolean
          is_hidden: boolean
          is_vip: boolean
          name: string
          order: number | null
          title: string
        }
        Insert: {
          cost?: number
          id?: number
          is_beta?: boolean
          is_hidden?: boolean
          is_vip?: boolean
          name: string
          order?: number | null
          title: string
        }
        Update: {
          cost?: number
          id?: number
          is_beta?: boolean
          is_hidden?: boolean
          is_vip?: boolean
          name?: string
          order?: number | null
          title?: string
        }
        Relationships: []
      }
      image_function_translations: {
        Row: {
          description: string
          fn_id: number
          id: number
          locale: string
          name: string
        }
        Insert: {
          description: string
          fn_id: number
          id?: number
          locale: string
          name: string
        }
        Update: {
          description?: string
          fn_id?: number
          id?: number
          locale?: string
          name?: string
        }
        Relationships: []
      }
      models_default: {
        Row: {
          gender: string
          id: number
          image_path: string
          label: string
          unlocked_by: number | null
        }
        Insert: {
          gender: string
          id?: number
          image_path: string
          label: string
          unlocked_by?: number | null
        }
        Update: {
          gender?: string
          id?: number
          image_path?: string
          label?: string
          unlocked_by?: number | null
        }
        Relationships: []
      }
      models_suggestions: {
        Row: {
          id: number
          locale: string
          text: string
        }
        Insert: {
          id?: number
          locale: string
          text: string
        }
        Update: {
          id?: number
          locale?: string
          text?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: number
          token: string
          user_id: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: number
          token: string
          user_id: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: number
          token?: string
          user_id?: number
        }
        Relationships: []
      }
      paste: {
        Row: {
          created_at: string
          id: number
          name: string
          parent_id: number | null
          project_id: number
          updated_at: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          parent_id?: number | null
          project_id: number
          updated_at: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          parent_id?: number | null
          project_id?: number
          updated_at?: string
          user_id?: number
        }
        Relationships: []
      }
      plan: {
        Row: {
          available_resources: Json
          coins: number
          id: number
          key: string
          name: string
          period: string | null
          price_br: number
          storage_limit: number
          stripe_price_id: string | null
        }
        Insert: {
          available_resources: Json
          coins: number
          id?: number
          key: string
          name: string
          period?: string | null
          price_br: number
          storage_limit: number
          stripe_price_id?: string | null
        }
        Update: {
          available_resources?: Json
          coins?: number
          id?: number
          key?: string
          name?: string
          period?: string | null
          price_br?: number
          storage_limit?: number
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      project: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
          user_id?: number
        }
        Relationships: []
      }
      subscription: {
        Row: {
          created_at: string
          expires_at: string
          id: number
          plan_id: number
          stripe_customer_id: string | null
          stripe_id: string | null
          stripe_status: string | null
          updated_at: string
          user_id: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: number
          plan_id: number
          stripe_customer_id?: string | null
          stripe_id?: string | null
          stripe_status?: string | null
          updated_at: string
          user_id: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: number
          plan_id?: number
          stripe_customer_id?: string | null
          stripe_id?: string | null
          stripe_status?: string | null
          updated_at?: string
          user_id?: number
        }
        Relationships: []
      }
      tour: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      transaction: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: number
          invoice_stripe_id: string
          product_id: number
          user_email: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id?: number
          invoice_stripe_id: string
          product_id: number
          user_email: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: number
          invoice_stripe_id?: string
          product_id?: number
          user_email?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          created_at: string
          downloads_limit: number
          downloads_used: number
          email: string
          id: number
          is_verified: boolean
          name: string
          password: string
          plan_id: number | null
          stripe_customer_id: string | null
          updated_at: string
          verification_code: number | null
          verification_expires: string | null
        }
        Insert: {
          created_at?: string
          downloads_limit?: number
          downloads_used?: number
          email: string
          id?: number
          is_verified?: boolean
          name: string
          password: string
          plan_id?: number | null
          stripe_customer_id?: string | null
          updated_at: string
          verification_code?: number | null
          verification_expires?: string | null
        }
        Update: {
          created_at?: string
          downloads_limit?: number
          downloads_used?: number
          email?: string
          id?: number
          is_verified?: boolean
          name?: string
          password?: string
          plan_id?: number | null
          stripe_customer_id?: string | null
          updated_at?: string
          verification_code?: number | null
          verification_expires?: string | null
        }
        Relationships: []
      }
      user_tour: {
        Row: {
          id: number
          joined_at: string
          tour_id: number
          user_id: number
        }
        Insert: {
          id?: number
          joined_at?: string
          tour_id: number
          user_id: number
        }
        Update: {
          id?: number
          joined_at?: string
          tour_id?: number
          user_id?: number
        }
        Relationships: []
      }
      watermarked_generation: {
        Row: {
          created_at: string
          deleted_at: string | null
          generation_id: number
          id: number
          path: string
          user_id: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          generation_id: number
          id?: number
          path: string
          user_id: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          generation_id?: number
          id?: number
          path?: string
          user_id?: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
