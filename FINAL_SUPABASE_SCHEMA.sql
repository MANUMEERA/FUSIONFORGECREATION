-- =====================================================================
-- FUSION FORGE CREATION
-- FINAL CONSOLIDATED SUPABASE DATABASE
-- PRODUCTION APPLICATION SOURCE OF TRUTH
-- PROJECT ID: mzgumubheyycaposytkk
-- =====================================================================

-- 1. EXTENSIONS & SEQUENCES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq
START WITH 1
INCREMENT BY 1;

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor')) DEFAULT 'admin',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CMS TABLES
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    client_name TEXT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    live_url TEXT,
    technologies TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_title TEXT,
    company TEXT NOT NULL,
    avatar_url TEXT,
    content TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CRM: ENQUIRIES & CLIENTS
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    project_type TEXT NOT NULL,
    budget TEXT,
    timeline TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('New', 'Contacted', 'Discussion', 'Proposal', 'Won', 'Lost')) DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    tax_number TEXT,
    notes TEXT,
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
    state_code TEXT DEFAULT NULL,
    place_of_supply TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BILLING: INVOICES, ITEMS & PAYMENTS
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled')) DEFAULT 'Draft',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    gst_applicable BOOLEAN NOT NULL DEFAULT FALSE,
    seller_gstin TEXT DEFAULT NULL,
    seller_state_code TEXT DEFAULT '26',
    buyer_gstin TEXT DEFAULT NULL,
    buyer_state_code TEXT DEFAULT NULL,
    place_of_supply TEXT DEFAULT NULL,
    cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    utgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    deleted_by UUID DEFAULT NULL,
    notes TEXT,
    terms TEXT DEFAULT 'Payment terms: Due within 15 days of issue date.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(12,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT NOT NULL DEFAULT 'Bank Transfer',
    transaction_ref TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STATE / UT MASTER
CREATE TABLE IF NOT EXISTS public.state_ut_master (
    code VARCHAR(2) PRIMARY KEY,
    name TEXT NOT NULL,
    type VARCHAR(5) NOT NULL CHECK (type IN ('STATE', 'UT')),
    is_selectable BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO public.state_ut_master (code, name, type, is_selectable) VALUES
    ('01', 'Jammu and Kashmir', 'STATE', TRUE),
    ('02', 'Himachal Pradesh', 'STATE', TRUE),
    ('03', 'Punjab', 'STATE', TRUE),
    ('04', 'Chandigarh', 'UT', TRUE),
    ('05', 'Uttarakhand', 'STATE', TRUE),
    ('06', 'Haryana', 'STATE', TRUE),
    ('07', 'Delhi', 'UT', TRUE),
    ('08', 'Rajasthan', 'STATE', TRUE),
    ('09', 'Uttar Pradesh', 'STATE', TRUE),
    ('10', 'Bihar', 'STATE', TRUE),
    ('11', 'Sikkim', 'STATE', TRUE),
    ('12', 'Arunachal Pradesh', 'STATE', TRUE),
    ('13', 'Nagaland', 'STATE', TRUE),
    ('14', 'Manipur', 'STATE', TRUE),
    ('15', 'Mizoram', 'STATE', TRUE),
    ('16', 'Tripura', 'STATE', TRUE),
    ('17', 'Meghalaya', 'STATE', TRUE),
    ('18', 'Assam', 'STATE', TRUE),
    ('19', 'West Bengal', 'STATE', TRUE),
    ('20', 'Jharkhand', 'STATE', TRUE),
    ('21', 'Odisha', 'STATE', TRUE),
    ('22', 'Chhattisgarh', 'STATE', TRUE),
    ('23', 'Madhya Pradesh', 'STATE', TRUE),
    ('24', 'Gujarat', 'STATE', TRUE),
    ('26', 'Dadra and Nagar Haveli and Daman and Diu', 'UT', TRUE),
    ('27', 'Maharashtra', 'STATE', TRUE),
    ('29', 'Karnataka', 'STATE', TRUE),
    ('30', 'Goa', 'STATE', TRUE),
    ('31', 'Lakshadweep', 'UT', TRUE),
    ('32', 'Kerala', 'STATE', TRUE),
    ('33', 'Tamil Nadu', 'STATE', TRUE),
    ('34', 'Puducherry', 'UT', TRUE),
    ('35', 'Andaman and Nicobar Islands', 'UT', TRUE),
    ('36', 'Telangana', 'STATE', TRUE),
    ('37', 'Andhra Pradesh', 'STATE', TRUE),
    ('38', 'Ladakh', 'UT', TRUE),
    ('97', 'Other Territory', 'UT', TRUE),
    ('25', 'Daman and Diu (Legacy)', 'UT', FALSE),
    ('28', 'Andhra Pradesh (Old)', 'STATE', FALSE)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, is_selectable = EXCLUDED.is_selectable;

-- 7. SELLER PROFILE & WEBSITE SETTINGS
CREATE TABLE IF NOT EXISTS public.seller_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT 'Fusion Forge Creation',
    tagline TEXT DEFAULT 'Where Ideas Fuse With Technology',
    email TEXT DEFAULT 'contact@fusionforge.io',
    phone TEXT DEFAULT '+91 90040 77126',
    address TEXT DEFAULT 'Survey No. 274, Athal Village, Silvassa, Dadra & Nagar Haveli - 396230',
    gstin TEXT DEFAULT '26AALFF1234F1Z5',
    state_code VARCHAR(2) DEFAULT '26',
    jurisdiction TEXT DEFAULT 'Silvassa Jurisdiction',
    logo_url TEXT DEFAULT NULL,
    signature_url TEXT DEFAULT NULL,
    bank_name TEXT DEFAULT 'HDFC Bank Ltd',
    account_name TEXT DEFAULT 'Fusion Forge Creation',
    account_number TEXT DEFAULT '50200012345678',
    ifsc_code TEXT DEFAULT 'HDFC0001234',
    branch_name TEXT DEFAULT 'Silvassa Branch',
    terms_conditions TEXT DEFAULT 'Payment due within 15 days of issue date.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.seller_profile (company_name, tagline, email, phone, address, gstin, state_code, jurisdiction, bank_name, account_name, account_number, ifsc_code, terms_conditions)
SELECT 'Fusion Forge Creation', 'Where Ideas Fuse With Technology', 'contact@fusionforge.io', '+91 90040 77126', 'Survey No. 274, Athal Village, Silvassa, Dadra & Nagar Haveli - 396230', '26AALFF1234F1Z5', '26', 'Silvassa Jurisdiction', 'HDFC Bank Ltd', 'Fusion Forge Creation', '50200012345678', 'HDFC0001234', 'Payment due within 15 days of issue date.'
WHERE NOT EXISTS (SELECT 1 FROM public.seller_profile);

CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FUNCTIONS & PROCEDURES
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE u_role TEXT;
BEGIN
    IF user_id IS NULL THEN RETURN 'anon'; END IF;
    SELECT role INTO u_role FROM public.profiles WHERE id = user_id;
    RETURN COALESCE(u_role, 'none');
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE seq_val INT; yr TEXT;
BEGIN
    yr := to_char(CURRENT_DATE, 'YYYY');
    seq_val := nextval('public.invoice_number_seq');
    RETURN 'FFC-' || yr || '-' || lpad(seq_val::text, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.extract_gst_state_code(p_gstin TEXT)
RETURNS TEXT LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
    IF p_gstin IS NULL OR LENGTH(TRIM(p_gstin)) < 2 THEN RETURN NULL; END IF;
    RETURN SUBSTRING(TRIM(p_gstin) FROM 1 FOR 2);
END;
$$;

-- 9. GST CALCULATION ENGINE (SINGLE SOURCE OF TRUTH)
CREATE OR REPLACE FUNCTION public.recalculate_invoice_totals(target_inv_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_subtotal NUMERIC(12,2) := 0.00;
    v_discount NUMERIC(12,2) := 0.00;
    v_tax_rate NUMERIC(5,2) := 0.00;
    v_gst_app BOOLEAN := FALSE;
    v_seller_gstin TEXT;
    v_seller_state TEXT;
    v_buyer_gstin TEXT;
    v_buyer_state TEXT;
    v_seller_type TEXT;
    v_buyer_state_name TEXT;
    v_place_of_supply TEXT;
    v_taxable NUMERIC(12,2) := 0.00;
    v_cgst NUMERIC(12,2) := 0.00;
    v_sgst NUMERIC(12,2) := 0.00;
    v_utgst NUMERIC(12,2) := 0.00;
    v_igst NUMERIC(12,2) := 0.00;
    v_total_tax NUMERIC(12,2) := 0.00;
    v_grand_total NUMERIC(12,2) := 0.00;
    v_paid NUMERIC(12,2) := 0.00;
    v_status TEXT;
    v_due_date DATE;
BEGIN
    SELECT COALESCE(SUM(total_price), 0.00) INTO v_subtotal FROM public.invoice_items WHERE invoice_id = target_inv_id;
    SELECT COALESCE(discount, 0.00), COALESCE(tax_rate, 0.00), COALESCE(gst_applicable, FALSE), seller_gstin, seller_state_code, buyer_gstin, buyer_state_code, place_of_supply, COALESCE(paid_amount, 0.00), status, due_date
    INTO v_discount, v_tax_rate, v_gst_app, v_seller_gstin, v_seller_state, v_buyer_gstin, v_buyer_state, v_place_of_supply, v_paid, v_status, v_due_date
    FROM public.invoices WHERE id = target_inv_id;

    IF v_seller_state IS NULL AND v_seller_gstin IS NOT NULL THEN v_seller_state := public.extract_gst_state_code(v_seller_gstin); END IF;
    IF v_seller_state IS NULL OR TRIM(v_seller_state) = '' THEN v_seller_state := '26'; END IF;
    IF v_buyer_state IS NULL AND v_buyer_gstin IS NOT NULL THEN v_buyer_state := public.extract_gst_state_code(v_buyer_gstin); END IF;

    v_taxable := GREATEST(0.00, v_subtotal - COALESCE(v_discount, 0.00));

    IF v_gst_app = TRUE AND v_tax_rate > 0 THEN
        IF v_buyer_state IS NULL OR TRIM(v_buyer_state) = '' THEN RAISE EXCEPTION 'Buyer State/UT or valid GSTIN is required when GST is enabled.'; END IF;
        SELECT type INTO v_seller_type FROM public.state_ut_master WHERE code = v_seller_state AND is_selectable = TRUE;
        IF v_seller_type IS NULL THEN RAISE EXCEPTION 'Invalid Seller State/UT Code: %', v_seller_state; END IF;
        SELECT name INTO v_buyer_state_name FROM public.state_ut_master WHERE code = v_buyer_state AND is_selectable = TRUE;
        IF v_buyer_state_name IS NULL THEN RAISE EXCEPTION 'Invalid Buyer State/UT Code: %', v_buyer_state; END IF;
        IF v_place_of_supply IS NULL OR TRIM(v_place_of_supply) = '' THEN v_place_of_supply := v_buyer_state_name || ' (' || v_buyer_state || ')'; END IF;

        IF v_seller_state = v_buyer_state THEN
            v_cgst := ROUND(v_taxable * ((v_tax_rate / 2.00) / 100.00), 2);
            IF v_seller_type = 'UT' THEN
                v_utgst := ROUND(v_taxable * ((v_tax_rate / 2.00) / 100.00), 2);
                v_sgst := 0.00;
            ELSE
                v_sgst := ROUND(v_taxable * ((v_tax_rate / 2.00) / 100.00), 2);
                v_utgst := 0.00;
            END IF;
            v_igst := 0.00;
        ELSE
            v_igst := ROUND(v_taxable * (v_tax_rate / 100.00), 2);
            v_cgst := 0.00; v_sgst := 0.00; v_utgst := 0.00;
        END IF;
    ELSE
        v_cgst := 0.00; v_sgst := 0.00; v_utgst := 0.00; v_igst := 0.00;
    END IF;

    v_total_tax := v_cgst + v_sgst + v_utgst + v_igst;
    v_grand_total := v_taxable + v_total_tax;

    IF v_status NOT IN ('Cancelled', 'Draft') THEN
        IF v_paid >= v_grand_total AND v_grand_total > 0 THEN v_status := 'Paid';
        ELSIF v_paid > 0 THEN v_status := 'Partially Paid';
        ELSIF v_due_date IS NOT NULL AND v_due_date < CURRENT_DATE THEN v_status := 'Overdue';
        ELSE v_status := 'Sent';
        END IF;
    END IF;

    UPDATE public.invoices SET
        subtotal = v_subtotal, taxable_amount = v_taxable,
        cgst_amount = v_cgst, sgst_amount = v_sgst, utgst_amount = v_utgst, igst_amount = v_igst,
        tax_amount = v_total_tax, grand_total = v_grand_total,
        seller_state_code = v_seller_state, buyer_state_code = v_buyer_state,
        place_of_supply = v_place_of_supply, status = v_status, updated_at = NOW()
    WHERE id = target_inv_id;
END;
$$;

-- 10. TRIGGERS (NON-RECURSIVE)
CREATE OR REPLACE FUNCTION public.calc_item_total()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.total_price := ROUND(COALESCE(NEW.quantity, 0) * COALESCE(NEW.unit_price, 0.00), 2);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calc_item_total ON public.invoice_items;
CREATE TRIGGER trg_calc_item_total BEFORE INSERT OR UPDATE ON public.invoice_items FOR EACH ROW EXECUTE FUNCTION public.calc_item_total();

CREATE OR REPLACE FUNCTION public.trg_invoice_items_recalc()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN target_id := OLD.invoice_id; ELSE target_id := NEW.invoice_id; END IF;
    PERFORM public.recalculate_invoice_totals(target_id);
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_calc_invoice_items ON public.invoice_items;
CREATE TRIGGER trg_calc_invoice_items AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items FOR EACH ROW EXECUTE FUNCTION public.trg_invoice_items_recalc();

CREATE OR REPLACE FUNCTION public.trg_invoice_header_recalc()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    PERFORM public.recalculate_invoice_totals(NEW.id);
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoice_header_calc ON public.invoices;
CREATE TRIGGER trg_invoice_header_calc AFTER UPDATE OF discount, tax_rate, gst_applicable, seller_gstin, seller_state_code, buyer_gstin, buyer_state_code, place_of_supply ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.trg_invoice_header_recalc();

-- 11. PAYMENT VALIDATION
CREATE OR REPLACE FUNCTION public.process_payment_validation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_grand_total NUMERIC(12,2); v_existing_paid NUMERIC(12,2); v_new_total_paid NUMERIC(12,2); v_outstanding NUMERIC(12,2);
BEGIN
    SELECT grand_total INTO v_grand_total FROM public.invoices WHERE id = NEW.invoice_id;
    IF v_grand_total IS NULL THEN RAISE EXCEPTION 'Invoice not found!'; END IF;
    SELECT COALESCE(SUM(amount), 0.00) INTO v_existing_paid FROM public.payments WHERE invoice_id = NEW.invoice_id AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);
    v_outstanding := v_grand_total - v_existing_paid;
    v_new_total_paid := v_existing_paid + NEW.amount;
    IF NEW.amount > (v_outstanding + 0.001) THEN RAISE EXCEPTION 'Payment Rejected: Payment amount (%) exceeds invoice outstanding balance (%)!', NEW.amount, v_outstanding; END IF;
    UPDATE public.invoices SET paid_amount = v_new_total_paid, status = CASE WHEN v_new_total_paid >= v_grand_total THEN 'Paid' WHEN v_new_total_paid > 0 THEN 'Partially Paid' ELSE status END, updated_at = NOW() WHERE id = NEW.invoice_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_payment ON public.payments;
CREATE TRIGGER trg_validate_payment BEFORE INSERT OR UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.process_payment_validation();

-- 12. ATOMIC INVOICE CREATION RPC
CREATE OR REPLACE FUNCTION public.create_invoice_with_items(p_invoice_data JSONB, p_items_data JSONB)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_inv_id UUID; v_generated_num TEXT; v_item JSONB; v_result_row public.invoices%ROWTYPE;
BEGIN
    v_generated_num := p_invoice_data->>'invoice_number';
    IF v_generated_num IS NULL OR TRIM(v_generated_num) = '' THEN SELECT public.generate_invoice_number() INTO v_generated_num; END IF;

    INSERT INTO public.invoices (invoice_number, client_id, status, issue_date, due_date, discount, tax_rate, gst_applicable, seller_gstin, seller_state_code, buyer_gstin, buyer_state_code, place_of_supply, notes)
    VALUES (v_generated_num, (p_invoice_data->>'client_id')::UUID, COALESCE(p_invoice_data->>'status', 'Sent'), (p_invoice_data->>'issue_date')::DATE, (p_invoice_data->>'due_date')::DATE, COALESCE((p_invoice_data->>'discount')::NUMERIC, 0.00), COALESCE((p_invoice_data->>'tax_rate')::NUMERIC, 0.00), COALESCE((p_invoice_data->>'gst_applicable')::BOOLEAN, FALSE), NULLIF(TRIM(p_invoice_data->>'seller_gstin'), ''), COALESCE(NULLIF(TRIM(p_invoice_data->>'seller_state_code'), ''), '26'), NULLIF(TRIM(p_invoice_data->>'buyer_gstin'), ''), NULLIF(TRIM(p_invoice_data->>'buyer_state_code'), ''), NULLIF(TRIM(p_invoice_data->>'place_of_supply'), ''), NULLIF(TRIM(p_invoice_data->>'notes'), ''))
    RETURNING id INTO v_inv_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items_data) LOOP
        INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price)
        VALUES (v_inv_id, v_item->>'description', (v_item->>'quantity')::NUMERIC, (v_item->>'unit_price')::NUMERIC);
    END LOOP;

    PERFORM public.recalculate_invoice_totals(v_inv_id);
    SELECT * INTO v_result_row FROM public.invoices WHERE id = v_inv_id;
    RETURN to_jsonb(v_result_row);
END;
$$;

-- 13. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.state_ut_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profile ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));
DROP POLICY IF EXISTS "Super Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Super Admins can manage all profiles" ON public.profiles FOR ALL USING (public.get_user_role(auth.uid()) = 'super_admin');

-- Content Policies (Services, Projects, Tech, Testimonials, FAQs)
DROP POLICY IF EXISTS "Public read services" ON public.services;
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (is_active = TRUE OR public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'editor'));
DROP POLICY IF EXISTS "Admin/Editor manage services" ON public.services;
CREATE POLICY "Admin/Editor manage services" ON public.services FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'editor'));

DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Admin/Editor manage projects" ON public.projects;
CREATE POLICY "Admin/Editor manage projects" ON public.projects FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'editor'));

DROP POLICY IF EXISTS "Public read technologies" ON public.technologies;
CREATE POLICY "Public read technologies" ON public.technologies FOR SELECT USING (is_active = TRUE OR public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'editor'));
DROP POLICY IF EXISTS "Admin/Editor manage technologies" ON public.technologies;
CREATE POLICY "Admin/Editor manage technologies" ON public.technologies FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'editor'));

DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (is_featured = TRUE OR public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'editor'));
DROP POLICY IF EXISTS "Admin/Editor manage testimonials" ON public.testimonials;
CREATE POLICY "Admin/Editor manage testimonials" ON public.testimonials FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'editor'));

DROP POLICY IF EXISTS "Public read faqs" ON public.faqs;
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (is_active = TRUE OR public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'editor'));
DROP POLICY IF EXISTS "Admin/Editor manage faqs" ON public.faqs;
CREATE POLICY "Admin/Editor manage faqs" ON public.faqs FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'editor'));

-- Enquiries & Clients
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;
CREATE POLICY "Public can submit enquiries" ON public.enquiries FOR INSERT WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Admins can view and manage enquiries" ON public.enquiries;
CREATE POLICY "Admins can view and manage enquiries" ON public.enquiries FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "Admins can manage clients" ON public.clients;
CREATE POLICY "Admins can manage clients" ON public.clients FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));

-- Invoices, Items & Payments
DROP POLICY IF EXISTS "Invoices access policy" ON public.invoices;
CREATE POLICY "Invoices access policy" ON public.invoices FOR ALL TO authenticated USING (is_deleted = FALSE OR public.get_user_role(auth.uid()) = 'super_admin') WITH CHECK (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "Admins can manage invoice items" ON public.invoice_items;
CREATE POLICY "Admins can manage invoice items" ON public.invoice_items FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));

-- Settings & Masters
DROP POLICY IF EXISTS "Public can view ONLY public website settings" ON public.website_settings;
CREATE POLICY "Public can view ONLY public website settings" ON public.website_settings FOR SELECT USING (is_public = TRUE OR public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));
DROP POLICY IF EXISTS "Admins can manage all website settings" ON public.website_settings;
CREATE POLICY "Admins can manage all website settings" ON public.website_settings FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "Public can read state ut master" ON public.state_ut_master;
CREATE POLICY "Public can read state ut master" ON public.state_ut_master FOR SELECT TO anon, authenticated USING (TRUE);

DROP POLICY IF EXISTS "Allow public read access to seller_profile" ON public.seller_profile;
CREATE POLICY "Allow public read access to seller_profile" ON public.seller_profile FOR SELECT TO anon, authenticated, service_role USING (TRUE);
DROP POLICY IF EXISTS "Allow admin update access to seller_profile" ON public.seller_profile;
CREATE POLICY "Allow admin update access to seller_profile" ON public.seller_profile FOR UPDATE TO authenticated, service_role USING (TRUE) WITH CHECK (TRUE);

-- 14. PERMISSIONS & GRANTS
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.state_ut_master TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_invoice_with_items(JSONB, JSONB) TO authenticated;
GRANT ALL ON public.seller_profile TO anon, authenticated, service_role;
