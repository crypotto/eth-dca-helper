
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dca_purchases: {
        Row: {
          id: string
          created_at: string
          user_id: string
          date: string
          amount_usd: number
          price: number
          amount: number
          crypto_type: 'ETH' | 'BTC'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          date: string
          amount_usd: number
          price: number
          amount: number
          crypto_type: 'ETH' | 'BTC'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          date?: string
          amount_usd?: number
          price?: number
          amount?: number
          crypto_type?: 'ETH' | 'BTC'
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          current_eth_price: number
          current_btc_price: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_eth_price: number
          current_btc_price: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_eth_price?: number
          current_btc_price?: number
          updated_at?: string
        }
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
  }
}
