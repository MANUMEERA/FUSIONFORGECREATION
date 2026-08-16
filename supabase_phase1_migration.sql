-- =====================================================================
-- FUSION FORGE CREATIONS — PHASE 1 MIGRATION
-- SUPABASE DATABASE FOUNDATION & ENTERPRISE EXTENSIONS
-- PRESERVES EXISTING TABLES WITHOUT DROPPING DATA
-- =====================================================================

-- 1. EXTENSIONS & SEQUENCES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SEQUENCE IF NOT EXISTS public.quotation_number_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.receipt_number_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.credit_note_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.debit_note_seq START WITH 1 INCREMENT BY 1;

-- 2. ROLES, PERMISSIONS & RBAC FOUNDATION
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    permission_code TEXT NOT NULL REFERENCES public.permissions(code) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (role, permission_code)
);

-- Extend profiles table if needed (safely add missing columns)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS designation TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- 3. EXTEND SELLER PROFILE (Agency Settings, MSME, LUT, Stamps, Signatures, Series)
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS trade_name TEXT;
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS legal_name TEXT;
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS pan TEXT;
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS msme_number TEXT DEFAULT 'UDYAM-DN-01-0012345';
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS lut_number TEXT;
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS lut_expiry_date DATE;
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS sac_code TEXT DEFAULT '998314';
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS stamp_url TEXT;
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS invoice_prefix TEXT DEFAULT 'FFC-INV-';
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS quotation_prefix TEXT DEFAULT 'FFC-QT-';
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS receipt_prefix TEXT DEFAULT 'FFC-REC-';
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS default_payment_terms TEXT DEFAULT 'Payment due within 15 days of issue date.';
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS default_quotation_terms TEXT DEFAULT '1. Quotation valid for 30 days.\n2. 50% advance upon project initiation.\n3. GST 18% extra as applicable under SAC 998314.';
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS default_notes TEXT DEFAULT 'Thank you for partnering with Fusion Forge Creation.';
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS social_channels JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS upi_id TEXT DEFAULT 'fusionforge@hdfcbank';
ALTER TABLE public.seller_profile ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

-- 4. SERVICE PRESETS / CATALOG RATES
CREATE TABLE IF NOT EXISTS public.service_price_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    sac_code TEXT NOT NULL DEFAULT '998314',
    default_rate NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    unit TEXT NOT NULL DEFAULT 'Project',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. EXTEND CLIENTS (Billing & Shipping Addresses, MSME, Place of Supply)
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS gstin TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS pan TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS billing_address_line1 TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS billing_address_line2 TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS billing_city TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS billing_state TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS billing_state_code TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS billing_pincode TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS shipping_address_line1 TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS shipping_address_line2 TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS shipping_city TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS shipping_state TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS shipping_state_code TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS shipping_pincode TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS is_shipping_same_as_billing BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS deleted_by UUID;

-- 6. EXTEND LEAD INQUIRIES & LEAD STATUS HISTORY
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website_form';
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium';
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS estimated_value NUMERIC(12,2);
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS service_category TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS converted_client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS public.lead_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. QUOTATIONS & QUOTATION ITEMS & STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number TEXT UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT 'Project Proposal & Scope',
    status TEXT NOT NULL CHECK (status IN ('Draft', 'Sent', 'Under Review', 'Accepted', 'Rejected', 'Converted', 'Expired')) DEFAULT 'Draft',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    discount_type TEXT NOT NULL DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage')),
    discount_value NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    gst_applicable BOOLEAN NOT NULL DEFAULT TRUE,
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00,
    gst_type TEXT NOT NULL DEFAULT 'igst' CHECK (gst_type IN ('cgst_sgst', 'cgst_utgst', 'igst', 'none')),
    cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    utgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    converted_invoice_id UUID,
    converted_at TIMESTAMPTZ,
    notes TEXT,
    terms TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    sac_code TEXT NOT NULL DEFAULT '998314',
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.quotation_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. EXTEND INVOICES (Quotation link, Currency, Shipping/Billing Addresses snapshot)
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'INR';
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS lut_number TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS is_export_without_payment BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS billing_address TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS is_shipping_same_as_billing BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS qr_code_data TEXT;

-- 9. EXTEND PAYMENTS (Receipt number, TDS deduction, Mode, Bank charges)
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS receipt_number TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS tds_deducted NUMERIC(12,2) NOT NULL DEFAULT 0.00;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS bank_charges NUMERIC(12,2) NOT NULL DEFAULT 0.00;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT TRUE;

-- 10. CREDIT NOTES & DEBIT NOTES (GST Accounting)
CREATE TABLE IF NOT EXISTS public.credit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_number TEXT UNIQUE NOT NULL,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reason TEXT NOT NULL,
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    utgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.debit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_number TEXT UNIQUE NOT NULL,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reason TEXT NOT NULL,
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    utgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. PROJECT ENGAGEMENTS & STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.managed_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('Planning', 'In Progress', 'In Review', 'Completed', 'On Hold', 'Cancelled')) DEFAULT 'Planning',
    progress_percentage INT NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    start_date DATE,
    target_delivery_date DATE,
    actual_delivery_date DATE,
    budget NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    spent NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    project_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    repository_url TEXT,
    staging_url TEXT,
    production_url TEXT,
    scope_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.managed_projects(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    progress_percentage INT,
    notes TEXT,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. PURCHASES, EXPENSES & SALARY ENTRIES (Accounting Foundation)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT NOT NULL CHECK (category IN ('Hosting & Cloud', 'Software Licenses', 'Hardware & Office', 'Salaries & Contractors', 'Marketing & Ads', 'Legal & Professional', 'Taxes & Compliance', 'Miscellaneous')),
    vendor_name TEXT NOT NULL,
    vendor_gstin TEXT,
    description TEXT NOT NULL,
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    gst_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'Bank Transfer',
    payment_status TEXT NOT NULL DEFAULT 'Paid' CHECK (payment_status IN ('Paid', 'Pending', 'Cancelled')),
    receipt_url TEXT,
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.salary_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    base_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    allowances NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    deductions NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    net_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    payment_date DATE,
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Processed', 'Paid')),
    transaction_ref TEXT,
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. NOTIFICATIONS & EMAIL LOGS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('lead', 'invoice', 'payment', 'quotation', 'system', 'security')),
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    template_type TEXT NOT NULL,
    related_entity_type TEXT, -- 'quotation', 'invoice', 'payment', 'lead'
    related_entity_id UUID,
    status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed', 'delivered')),
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. CHATBOT QA & SETTINGS
CREATE TABLE IF NOT EXISTS public.chatbot_qa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    category TEXT DEFAULT 'Services',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chatbot_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_name TEXT NOT NULL DEFAULT 'Fusion Assistant',
    greeting_message TEXT NOT NULL DEFAULT 'Hello! How can Fusion Forge Creation engineer your vision today?',
    fallback_message TEXT NOT NULL DEFAULT 'I would love to connect you with our solutions architect. Please leave your email or call +91 90040 77126.',
    ai_mode_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. AUDIT LOGS, VISITOR MONITORING & COMPLIANCE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    user_role TEXT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.visitor_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip_hash TEXT,
    country TEXT,
    city TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.compliance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_type TEXT NOT NULL CHECK (policy_type IN ('privacy_policy', 'terms_of_engagement', 'gst_compliance', 'data_retention')),
    version TEXT NOT NULL,
    acknowledged_by_ip TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. INDEXES FOR PERFORMANCE & FAST QUERIES
CREATE INDEX IF NOT EXISTS idx_quotations_client_id ON public.quotations(client_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotation_items_qid ON public.quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_managed_projects_client ON public.managed_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 17. HELPER FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION public.generate_quotation_number()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE seq_val INT; yr TEXT; prefix TEXT;
BEGIN
    yr := to_char(CURRENT_DATE, 'YYYY');
    SELECT COALESCE(quotation_prefix, 'FFC-QT-') INTO prefix FROM public.seller_profile LIMIT 1;
    IF prefix IS NULL THEN prefix := 'FFC-QT-'; END IF;
    seq_val := nextval('public.quotation_number_seq');
    RETURN prefix || yr || '-' || lpad(seq_val::text, 4, '0');
END;
$$;

-- Quotation calculation trigger function
CREATE OR REPLACE FUNCTION public.recalculate_quotation_totals(target_qt_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_subtotal NUMERIC(12,2) := 0.00;
    v_disc_type TEXT;
    v_disc_val NUMERIC(12,2) := 0.00;
    v_disc_amt NUMERIC(12,2) := 0.00;
    v_tax_rate NUMERIC(5,2) := 18.00;
    v_gst_app BOOLEAN := TRUE;
    v_gst_type TEXT := 'igst';
    v_taxable NUMERIC(12,2) := 0.00;
    v_cgst NUMERIC(12,2) := 0.00;
    v_sgst NUMERIC(12,2) := 0.00;
    v_utgst NUMERIC(12,2) := 0.00;
    v_igst NUMERIC(12,2) := 0.00;
    v_total_tax NUMERIC(12,2) := 0.00;
    v_grand_total NUMERIC(12,2) := 0.00;
BEGIN
    SELECT COALESCE(SUM(total_price), 0.00) INTO v_subtotal FROM public.quotation_items WHERE quotation_id = target_qt_id;
    SELECT discount_type, COALESCE(discount_value, 0.00), COALESCE(tax_rate, 18.00), COALESCE(gst_applicable, TRUE), COALESCE(gst_type, 'igst')
    INTO v_disc_type, v_disc_val, v_tax_rate, v_gst_app, v_gst_type
    FROM public.quotations WHERE id = target_qt_id;

    IF v_disc_type = 'percentage' THEN
        v_disc_amt := ROUND(v_subtotal * (v_disc_val / 100.00), 2);
    ELSE
        v_disc_amt := LEAST(v_subtotal, v_disc_val);
    END IF;

    v_taxable := GREATEST(0.00, v_subtotal - v_disc_amt);

    IF v_gst_app = TRUE AND v_tax_rate > 0 THEN
        IF v_gst_type = 'cgst_sgst' THEN
            v_cgst := ROUND(v_taxable * ((v_tax_rate / 2.00) / 100.00), 2);
            v_sgst := ROUND(v_taxable * ((v_tax_rate / 2.00) / 100.00), 2);
        ELSIF v_gst_type = 'cgst_utgst' THEN
            v_cgst := ROUND(v_taxable * ((v_tax_rate / 2.00) / 100.00), 2);
            v_utgst := ROUND(v_taxable * ((v_tax_rate / 2.00) / 100.00), 2);
        ELSIF v_gst_type = 'igst' THEN
            v_igst := ROUND(v_taxable * (v_tax_rate / 100.00), 2);
        END IF;
    END IF;

    v_total_tax := v_cgst + v_sgst + v_utgst + v_igst;
    v_grand_total := v_taxable + v_total_tax;

    UPDATE public.quotations SET
        subtotal = v_subtotal,
        discount_amount = v_disc_amt,
        taxable_amount = v_taxable,
        cgst_amount = v_cgst,
        sgst_amount = v_sgst,
        utgst_amount = v_utgst,
        igst_amount = v_igst,
        tax_amount = v_total_tax,
        grand_total = v_grand_total,
        updated_at = NOW()
    WHERE id = target_qt_id;
END;
$$;

-- Item auto-recalc trigger for quotation items
CREATE OR REPLACE FUNCTION public.trg_quotation_items_recalc()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN target_id := OLD.quotation_id; ELSE target_id := NEW.quotation_id; END IF;
    PERFORM public.recalculate_quotation_totals(target_id);
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_calc_quotation_items ON public.quotation_items;
CREATE TRIGGER trg_calc_quotation_items AFTER INSERT OR UPDATE OR DELETE ON public.quotation_items FOR EACH ROW EXECUTE FUNCTION public.trg_quotation_items_recalc();

-- 18. ROW LEVEL SECURITY POLICIES (ENTERPRISE ISOLATION)
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_price_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managed_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_logs ENABLE ROW LEVEL SECURITY;

-- Permissions & Presets
CREATE POLICY "Super admin manage permissions" ON public.permissions FOR ALL USING (public.get_user_role(auth.uid()) = 'super_admin');
CREATE POLICY "Authenticated read permissions" ON public.permissions FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Super admin manage role_permissions" ON public.role_permissions FOR ALL USING (public.get_user_role(auth.uid()) = 'super_admin');
CREATE POLICY "Authenticated read role_permissions" ON public.role_permissions FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin manage service presets" ON public.service_price_presets FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));
CREATE POLICY "Public read service presets" ON public.service_price_presets FOR SELECT USING (is_active = TRUE);

-- Quotations
CREATE POLICY "Admins and Staff manage quotations" ON public.quotations FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'staff', 'project_manager'));
CREATE POLICY "Admins and Staff manage quotation items" ON public.quotation_items FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'staff', 'project_manager'));

-- Projects
CREATE POLICY "Admins and PMs manage projects" ON public.managed_projects FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'project_manager', 'staff'));
CREATE POLICY "Admins and PMs manage project history" ON public.project_status_history FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'project_manager', 'staff'));

-- Financials (Credit/Debit Notes, Expenses, Salaries)
CREATE POLICY "Accountants and Admins manage credit notes" ON public.credit_notes FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'accountant'));
CREATE POLICY "Accountants and Admins manage debit notes" ON public.debit_notes FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'accountant'));
CREATE POLICY "Accountants and Admins manage expenses" ON public.expenses FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'accountant'));
CREATE POLICY "Accountants and Super Admin manage salaries" ON public.salary_entries FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'accountant'));

-- Notifications
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT USING (recipient_user_id = auth.uid() OR recipient_user_id IS NULL);
CREATE POLICY "System and Admins manage notifications" ON public.notifications FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));

-- Chatbot
CREATE POLICY "Public read chatbot qa" ON public.chatbot_qa FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins manage chatbot qa" ON public.chatbot_qa FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'editor'));
CREATE POLICY "Public read chatbot settings" ON public.chatbot_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage chatbot settings" ON public.chatbot_settings FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));

-- Audit & Logs
CREATE POLICY "Super admin read audit logs" ON public.audit_logs FOR SELECT USING (public.get_user_role(auth.uid()) = 'super_admin');
CREATE POLICY "Authenticated insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public insert visitor logs" ON public.visitor_logs FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins read visitor logs" ON public.visitor_logs FOR SELECT USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));
CREATE POLICY "Public insert compliance logs" ON public.compliance_logs FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins read compliance logs" ON public.compliance_logs FOR SELECT USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));

-- 19. GRANTS
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT SELECT ON public.service_price_presets, public.chatbot_qa, public.chatbot_settings, public.state_ut_master TO anon;
GRANT INSERT ON public.visitor_logs, public.compliance_logs, public.enquiries TO anon;
