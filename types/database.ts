export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      feathery_form: {
        Row: {
          amount: string | null
          created_ts: string | null
          email: string | null
          form_id: string
          form_name: string | null
          id: string
          partner_id: string | null
          user_name: string | null
        }
        Insert: {
          amount?: string | null
          created_ts?: string | null
          email?: string | null
          form_id: string
          form_name?: string | null
          id?: string
          partner_id?: string | null
          user_name?: string | null
        }
        Update: {
          amount?: string | null
          created_ts?: string | null
          email?: string | null
          form_id?: string
          form_name?: string | null
          id?: string
          partner_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      game: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          partner_id: string | null
          template_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          partner_id?: string | null
          template_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          partner_id?: string | null
          template_id?: string | null
        }
        Relationships: []
      }
      partner: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      user: {
        Row: {
          id: string
          created_ts: string | null
          deleted: boolean | null
          deleted_ts: string | null
          modified_by: string | null
          updated_ts: string | null
          version: number | null
          dob: string | null
          email: string | null
          name: string | null
          phone: string | null
          address_id: string | null
          billing_email: string | null
          tnc_accepted_ts: string | null
        }
        Insert: {
          id: string
          created_ts?: string | null
          deleted?: boolean | null
          deleted_ts?: string | null
          modified_by?: string | null
          updated_ts?: string | null
          version?: number | null
          dob?: string | null
          email?: string | null
          name?: string | null
          phone?: string | null
          address_id?: string | null
          billing_email?: string | null
          tnc_accepted_ts?: string | null
        }
        Update: {
          id?: string
          created_ts?: string | null
          deleted?: boolean | null
          deleted_ts?: string | null
          modified_by?: string | null
          updated_ts?: string | null
          version?: number | null
          dob?: string | null
          email?: string | null
          name?: string | null
          phone?: string | null
          address_id?: string | null
          billing_email?: string | null
          tnc_accepted_ts?: string | null
        }
        Relationships: []
      }
      address: {
        Row: {
          id: string
          street: string | null
          city: string | null
          state: string | null
          zip: string | null
          country: string | null
          created_ts: string | null
          updated_ts: string | null
          postal_code: string | null
        }
        Insert: {
          id?: string
          street?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string | null
          created_ts?: string | null
          updated_ts?: string | null
          postal_code?: string | null
        }
        Update: {
          id?: string
          street?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string | null
          created_ts?: string | null
          updated_ts?: string | null
          postal_code?: string | null
        }
        Relationships: []
      }
      team: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      team_event: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          team_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          team_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          team_id?: string | null
        }
        Relationships: []
      }
      user_order: {
        Row: {
          amount: number | null
          created_ts: string | null
          game_id: string | null
          id: string
          payment_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_ts?: string | null
          game_id?: string | null
          id?: string
          payment_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_ts?: string | null
          game_id?: string | null
          id?: string
          payment_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_tables: {
        Args: Record<PropertyKey, never>
        Returns: { table_name: string }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type User = Database["public"]["Tables"]["user"]["Row"]
export type Address = Database["public"]["Tables"]["address"]["Row"]

export interface UserWithAddress extends User {
  address?: Address | null
}
