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
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          state: string | null
          username: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          state?: string | null
          username?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          state?: string | null
          username?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
