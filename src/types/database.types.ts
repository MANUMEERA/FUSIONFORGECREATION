export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * FUSION FORGE CREATION
 * AUTHORITATIVE SUPABASE DATABASE SCHEMA TYPES
 * Production Source of Truth
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          role: 'super_admin' | 'admin' | 'editor';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          role?: 'super_admin' | 'admin' | 'editor';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string;
          role?: 'super_admin' | 'admin' | 'editor';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          icon: string;
          features: string[] | null;
          order_index: number | null;
          is_active: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          icon: string;
          features?: string[] | null;
          order_index?: number | null;
          is_active?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          icon?: string;
          features?: string[] | null;
          order_index?: number | null;
          is_active?: boolean | null;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          client_name: string | null;
          service_id: string | null;
          description: string;
          image_url: string | null;
          live_url: string | null;
          technologies: string[] | null;
          featured: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          client_name?: string | null;
          service_id?: string | null;
          description: string;
          image_url?: string | null;
          live_url?: string | null;
          technologies?: string[] | null;
          featured?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          client_name?: string | null;
          service_id?: string | null;
          description?: string;
          image_url?: string | null;
          live_url?: string | null;
          technologies?: string[] | null;
          featured?: boolean | null;
          created_at?: string;
        };
      };
      technologies: {
        Row: {
          id: string;
          name: string;
          category: string;
          logo_url: string | null;
          is_active: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          logo_url?: string | null;
          is_active?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          logo_url?: string | null;
          is_active?: boolean | null;
          created_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          client_title: string | null;
          company: string;
          avatar_url: string | null;
          content: string;
          rating: number;
          is_featured: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_title?: string | null;
          company: string;
          avatar_url?: string | null;
          content: string;
          rating?: number;
          is_featured?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          client_title?: string | null;
          company?: string;
          avatar_url?: string | null;
          content?: string;
          rating?: number;
          is_featured?: boolean | null;
          created_at?: string;
        };
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string | null;
          order_index: number | null;
          is_active: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category?: string | null;
          order_index?: number | null;
          is_active?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          category?: string | null;
          order_index?: number | null;
          is_active?: boolean | null;
          created_at?: string;
        };
      };
      enquiries: {
        Row: {
          id: string;
          name: string;
          company: string | null;
          email: string;
          phone: string | null;
          project_type: string;
          budget: string | null;
          timeline: string | null;
          message: string;
          status: 'New' | 'Contacted' | 'Discussion' | 'Proposal' | 'Won' | 'Lost';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          company?: string | null;
          email: string;
          phone?: string | null;
          project_type: string;
          budget?: string | null;
          timeline?: string | null;
          message: string;
          status?: 'New' | 'Contacted' | 'Discussion' | 'Proposal' | 'Won' | 'Lost';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          company?: string | null;
          email?: string;
          phone?: string | null;
          project_type?: string;
          budget?: string | null;
          timeline?: string | null;
          message?: string;
          status?: 'New' | 'Contacted' | 'Discussion' | 'Proposal' | 'Won' | 'Lost';
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          company: string | null;
          email: string;
          phone: string | null;
          address: string | null;
          tax_number: string | null;
          notes: string | null;
          enquiry_id: string | null;
          state_code: string | null;
          place_of_supply: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          company?: string | null;
          email: string;
          phone?: string | null;
          address?: string | null;
          tax_number?: string | null;
          notes?: string | null;
          enquiry_id?: string | null;
          state_code?: string | null;
          place_of_supply?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          company?: string | null;
          email?: string;
          phone?: string | null;
          address?: string | null;
          tax_number?: string | null;
          notes?: string | null;
          enquiry_id?: string | null;
          state_code?: string | null;
          place_of_supply?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          client_id: string;
          status: 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';
          issue_date: string;
          due_date: string;
          subtotal: number;
          discount: number;
          tax_rate: number;
          tax_amount: number;
          grand_total: number;
          paid_amount: number;
          notes: string | null;
          terms: string | null;
          taxable_amount: number;
          gst_applicable: boolean;
          seller_gstin: string | null;
          seller_state_code: string | null;
          buyer_gstin: string | null;
          buyer_state_code: string | null;
          place_of_supply: string | null;
          cgst_amount: number;
          sgst_amount: number;
          utgst_amount: number;
          igst_amount: number;
          is_deleted: boolean;
          deleted_at: string | null;
          deleted_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_number: string;
          client_id: string;
          status?: 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';
          issue_date?: string;
          due_date: string;
          subtotal?: number;
          discount?: number;
          tax_rate?: number;
          tax_amount?: number;
          grand_total?: number;
          paid_amount?: number;
          notes?: string | null;
          terms?: string | null;
          taxable_amount?: number;
          gst_applicable?: boolean;
          seller_gstin?: string | null;
          seller_state_code?: string | null;
          buyer_gstin?: string | null;
          buyer_state_code?: string | null;
          place_of_supply?: string | null;
          cgst_amount?: number;
          sgst_amount?: number;
          utgst_amount?: number;
          igst_amount?: number;
          is_deleted?: boolean;
          deleted_at?: string | null;
          deleted_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invoice_number?: string;
          client_id?: string;
          status?: 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';
          issue_date?: string;
          due_date?: string;
          subtotal?: number;
          discount?: number;
          tax_rate?: number;
          tax_amount?: number;
          grand_total?: number;
          paid_amount?: number;
          notes?: string | null;
          terms?: string | null;
          taxable_amount?: number;
          gst_applicable?: boolean;
          seller_gstin?: string | null;
          seller_state_code?: string | null;
          buyer_gstin?: string | null;
          buyer_state_code?: string | null;
          place_of_supply?: string | null;
          cgst_amount?: number;
          sgst_amount?: number;
          utgst_amount?: number;
          igst_amount?: number;
          is_deleted?: boolean;
          deleted_at?: string | null;
          deleted_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          description: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          description?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
      };
      payments: {
        Row: {
          id: string;
          invoice_id: string;
          amount: number;
          payment_date: string;
          payment_method: string;
          transaction_ref: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          amount: number;
          payment_date?: string;
          payment_method?: string;
          transaction_ref?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          amount?: number;
          payment_date?: string;
          payment_method?: string;
          transaction_ref?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      website_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: Json;
          is_public: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value: Json;
          is_public?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: Json;
          is_public?: boolean;
          updated_at?: string;
        };
      };
      state_ut_master: {
        Row: {
          code: string;
          name: string;
          type: 'STATE' | 'UT';
          is_selectable: boolean;
        };
        Insert: {
          code: string;
          name: string;
          type: 'STATE' | 'UT';
          is_selectable?: boolean;
        };
        Update: {
          code?: string;
          name?: string;
          type?: 'STATE' | 'UT';
          is_selectable?: boolean;
        };
      };
      seller_profile: {
        Row: {
          id: string;
          company_name: string;
          tagline: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          gstin: string | null;
          state_code: string | null;
          jurisdiction: string | null;
          logo_url: string | null;
          signature_url: string | null;
          bank_name: string | null;
          account_name: string | null;
          account_number: string | null;
          ifsc_code: string | null;
          branch_name: string | null;
          terms_conditions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          tagline?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          gstin?: string | null;
          state_code?: string | null;
          jurisdiction?: string | null;
          logo_url?: string | null;
          signature_url?: string | null;
          bank_name?: string | null;
          account_name?: string | null;
          account_number?: string | null;
          ifsc_code?: string | null;
          branch_name?: string | null;
          terms_conditions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          tagline?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          gstin?: string | null;
          state_code?: string | null;
          jurisdiction?: string | null;
          logo_url?: string | null;
          signature_url?: string | null;
          bank_name?: string | null;
          account_name?: string | null;
          account_number?: string | null;
          ifsc_code?: string | null;
          branch_name?: string | null;
          terms_conditions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      get_user_role: {
        Args: { user_id: string };
        Returns: string;
      };
      generate_invoice_number: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      extract_gst_state_code: {
        Args: { p_gstin: string };
        Returns: string;
      };
      recalculate_invoice_totals: {
        Args: { target_inv_id: string };
        Returns: void;
      };
      update_overdue_invoices: {
        Args: Record<PropertyKey, never>;
        Returns: void;
      };
      create_invoice_with_items: {
        Args: {
          p_invoice_data: Json;
          p_items_data: Json;
        };
        Returns: Json;
      };
    };
  };
}
