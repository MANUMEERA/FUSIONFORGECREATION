// =====================================================================
// FUSION FORGE CREATION
// FINAL CONSOLIDATED INSFORGE DATABASE (SCHEMA V2)
// PRODUCTION APPLICATION SOURCE OF TRUTH
// =====================================================================
//
// APPLICATION:
// Fusion Forge Creation
//
// STACK:
// InsForge PostgreSQL + InsForge Auth
// =====================================================================

export const INSFORGE_PRODUCTION_SCHEMA_V2 = `-- =====================================================================
-- FUSION FORGE CREATION
-- FINAL CONSOLIDATED INSFORGE DATABASE (SCHEMA V2)
-- PRODUCTION APPLICATION SOURCE OF TRUTH
-- =====================================================================
--
-- DO NOT:
-- 1. Rename tables
-- 2. Remove columns
-- 3. Create duplicate tables
-- 4. Create duplicate triggers
-- 5. Create recursive invoice triggers
-- 6. Change GST calculation rules
-- 7. Replace InsForge Auth with custom authentication
-- 8. Use localStorage as database/authentication
--
-- APPLICATION:
-- Fusion Forge Creation
--
-- STACK:
-- Supabase PostgreSQL + Supabase Auth
--
-- =====================================================================


-- =====================================================================
-- 1. REQUIRED EXTENSIONS
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =====================================================================
-- 2. INVOICE NUMBER SEQUENCE
-- Format: FFC-YYYY-0001
-- =====================================================================

CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq
START WITH 1
INCREMENT BY 1;


-- =====================================================================
-- 3. USER PROFILE / ROLE MASTER
-- Linked directly to Supabase auth.users
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL
        CHECK (role IN ('super_admin', 'admin', 'editor'))
        DEFAULT 'admin',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================================
-- 4. SERVICES
-- =====================================================================

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


-- =====================================================================
-- 5. PROJECTS / PORTFOLIO
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    client_name TEXT,
    service_id UUID
        REFERENCES public.services(id)
        ON DELETE SET NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    live_url TEXT,
    technologies TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================================
-- 6. TECHNOLOGIES
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================================
-- 7. TESTIMONIALS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_title TEXT,
    company TEXT NOT NULL,
    avatar_url TEXT,
    content TEXT NOT NULL,
    rating INT DEFAULT 5
        CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================================
-- 8. FAQS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================================
-- 9. PUBLIC ENQUIRIES
-- =====================================================================

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
    status TEXT NOT NULL
        CHECK (
            status IN (
                'New',
                'Contacted',
                'Discussion',
                'Proposal',
                'Won',
                'Lost'
            )
        )
        DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================================
-- 10. CLIENTS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    tax_number TEXT,
    notes TEXT,
    enquiry_id UUID
        REFERENCES public.enquiries(id)
        ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.clients
    ADD COLUMN IF NOT EXISTS contact_person TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS city TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS state TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS state_code TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS pincode TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS postal_code TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS place_of_supply TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS place_of_supply_code TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS gstin TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS pan TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS same_as_billing BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS shipping_name TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS shipping_company TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS shipping_phone TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS shipping_address TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS shipping_city TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS shipping_state TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS shipping_state_code TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS shipping_pincode TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS shipping_gstin TEXT DEFAULT NULL;


-- =====================================================================
-- 11. INVOICES
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    invoice_number TEXT UNIQUE NOT NULL,

    client_id UUID NOT NULL
        REFERENCES public.clients(id)
        ON DELETE CASCADE,

    status TEXT NOT NULL
        CHECK (
            status IN (
                'Draft',
                'Sent',
                'Partially Paid',
                'Paid',
                'Overdue',
                'Cancelled'
            )
        )
        DEFAULT 'Draft',

    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,

    due_date DATE NOT NULL,

    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,

    discount NUMERIC(12,2) NOT NULL DEFAULT 0.00,

    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00,

    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,

    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,

    paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,

    notes TEXT,

    terms TEXT
        DEFAULT 'Payment terms: Due within 15 days of issue date.',

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================================
-- 12. GST / TAX FIELDS ON INVOICES
-- =====================================================================

ALTER TABLE public.invoices
    ADD COLUMN IF NOT EXISTS taxable_amount
        NUMERIC(12,2) NOT NULL DEFAULT 0.00,

    ADD COLUMN IF NOT EXISTS gst_applicable
        BOOLEAN NOT NULL DEFAULT FALSE,

    ADD COLUMN IF NOT EXISTS seller_gstin
        TEXT DEFAULT NULL,

    ADD COLUMN IF NOT EXISTS seller_state_code
        TEXT DEFAULT '26',

    ADD COLUMN IF NOT EXISTS buyer_gstin
        TEXT DEFAULT NULL,

    ADD COLUMN IF NOT EXISTS buyer_state_code
        TEXT DEFAULT NULL,

    ADD COLUMN IF NOT EXISTS place_of_supply
        TEXT DEFAULT NULL,

    ADD COLUMN IF NOT EXISTS cgst_amount
        NUMERIC(12,2) NOT NULL DEFAULT 0.00,

    ADD COLUMN IF NOT EXISTS sgst_amount
        NUMERIC(12,2) NOT NULL DEFAULT 0.00,

    ADD COLUMN IF NOT EXISTS utgst_amount
        NUMERIC(12,2) NOT NULL DEFAULT 0.00,

    ADD COLUMN IF NOT EXISTS igst_amount
        NUMERIC(12,2) NOT NULL DEFAULT 0.00,

    ADD COLUMN IF NOT EXISTS is_deleted
        BOOLEAN NOT NULL DEFAULT FALSE,

    ADD COLUMN IF NOT EXISTS deleted_at
        TIMESTAMPTZ DEFAULT NULL,

    ADD COLUMN IF NOT EXISTS deleted_by
        UUID DEFAULT NULL;


-- =====================================================================
-- 13. INVOICE ITEMS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    invoice_id UUID NOT NULL
        REFERENCES public.invoices(id)
        ON DELETE CASCADE,

    description TEXT NOT NULL,

    quantity NUMERIC(10,2)
        NOT NULL DEFAULT 1,

    unit_price NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,

    total_price NUMERIC(12,2)
        NOT NULL DEFAULT 0.00
);


-- =====================================================================
-- 14. PAYMENTS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    invoice_id UUID NOT NULL
        REFERENCES public.invoices(id)
        ON DELETE CASCADE,

    amount NUMERIC(12,2)
        NOT NULL
        CHECK (amount > 0),

    payment_date DATE
        NOT NULL DEFAULT CURRENT_DATE,

    payment_method TEXT
        NOT NULL DEFAULT 'Bank Transfer',

    transaction_ref TEXT,

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================================
-- 15. WEBSITE SETTINGS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    setting_key TEXT UNIQUE NOT NULL,

    setting_value JSONB NOT NULL,

    is_public BOOLEAN NOT NULL DEFAULT FALSE,

    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================================
-- 16. INDIAN GST STATE / UNION TERRITORY MASTER
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.state_ut_master (
    code VARCHAR(2) PRIMARY KEY,

    name TEXT NOT NULL,

    type VARCHAR(5) NOT NULL
        CHECK (type IN ('STATE', 'UT')),

    is_selectable BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE public.state_ut_master
    ADD COLUMN IF NOT EXISTS is_selectable
    BOOLEAN NOT NULL DEFAULT TRUE;


INSERT INTO public.state_ut_master
    (code, name, type, is_selectable)
VALUES
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
    ('97', 'Other Territory', 'UT', TRUE)
ON CONFLICT (code)
DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    is_selectable = EXCLUDED.is_selectable;


-- Legacy GST codes must remain non-selectable
INSERT INTO public.state_ut_master
    (code, name, type, is_selectable)
VALUES
    ('25', 'Daman and Diu (Legacy)', 'UT', FALSE),
    ('28', 'Andhra Pradesh (Old)', 'STATE', FALSE)
ON CONFLICT (code)
DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    is_selectable = FALSE;


-- =====================================================================
-- 17. SELLER PROFILE MASTER
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.seller_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_name TEXT NOT NULL
        DEFAULT 'Fusion Forge Creation',

    tagline TEXT
        DEFAULT 'Where Ideas Fuse With Technology',

    email TEXT
        DEFAULT '',

    phone TEXT
        DEFAULT '',

    address TEXT
        DEFAULT 'Survey No. 274, Athal Village, Silvassa, Dadra & Nagar Haveli - 396230',

    gstin TEXT
        DEFAULT '',

    state_code VARCHAR(2)
        DEFAULT '26',

    jurisdiction TEXT
        DEFAULT 'Silvassa Jurisdiction',

    logo_url TEXT DEFAULT NULL,

    signature_url TEXT DEFAULT NULL,

    bank_name TEXT
        DEFAULT 'HDFC Bank Ltd',

    account_name TEXT
        DEFAULT 'Fusion Forge Creation',

    account_number TEXT
        DEFAULT '50200012345678',

    ifsc_code TEXT
        DEFAULT 'HDFC0001234',

    branch_name TEXT
        DEFAULT 'Silvassa Branch',

    terms_conditions TEXT
        DEFAULT 'Payment due within 15 days of issue date.',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


ALTER TABLE public.seller_profile
    ADD COLUMN IF NOT EXISTS tagline
        TEXT DEFAULT 'Where Ideas Fuse With Technology',

    ADD COLUMN IF NOT EXISTS jurisdiction
        TEXT DEFAULT 'Silvassa Jurisdiction',

    ADD COLUMN IF NOT EXISTS logo_url
        TEXT DEFAULT NULL,

    ADD COLUMN IF NOT EXISTS signature_url
        TEXT DEFAULT NULL,

    ADD COLUMN IF NOT EXISTS bank_name
        TEXT DEFAULT 'HDFC Bank Ltd',

    ADD COLUMN IF NOT EXISTS account_name
        TEXT DEFAULT 'Fusion Forge Creation',

    ADD COLUMN IF NOT EXISTS account_number
        TEXT DEFAULT '50200012345678',

    ADD COLUMN IF NOT EXISTS ifsc_code
        TEXT DEFAULT 'HDFC0001234',

    ADD COLUMN IF NOT EXISTS branch_name
        TEXT DEFAULT 'Silvassa Branch',

    ADD COLUMN IF NOT EXISTS msme_number
        TEXT DEFAULT 'UDYAM-DN-00-0012345',

    ADD COLUMN IF NOT EXISTS stamp_url
        TEXT DEFAULT NULL,

    ADD COLUMN IF NOT EXISTS default_quotation_validity_days
        INT DEFAULT 30,

    ADD COLUMN IF NOT EXISTS quotation_terms
        JSONB DEFAULT '["Quotation is valid for 30 calendar days from the issue date.", "Commercial development kicks off upon confirmation and receipt of 50% milestone advance.", "All statutory taxes (GST @ 18%, SAC 998314) are billed extra as itemized.", "Scope variations or add-ons beyond itemized deliverables are quoted separately.", "All intellectual property rights transfer to the client upon full project settlement."]'::jsonb,

    ADD COLUMN IF NOT EXISTS invoice_terms
        JSONB DEFAULT '["Payment is due within 15 calendar days from the invoice issue date.", "Goods & Services Tax (GST) charged under SAC Code 998314 (Information Technology Software Services).", "Please quote invoice number on all NEFT / RTGS / IMPS wire transfers.", "All disputes subject to exclusive arbitration in Silvassa, Dadra & Nagar Haveli jurisdiction."]'::jsonb,

    ADD COLUMN IF NOT EXISTS numbering_configs
        JSONB DEFAULT '{"invoice": {"prefix": "INV", "company_code": "FFC", "include_year": true, "year_format": "YYYY", "starting_sequence": 10001, "current_sequence": 10001, "separator": "/", "style": "standard"}, "quotation": {"prefix": "QTN", "company_code": "FFC", "include_year": true, "year_format": "YYYY", "starting_sequence": 10001, "current_sequence": 10001, "separator": "/", "style": "standard"}}'::jsonb,

    ADD COLUMN IF NOT EXISTS terms_conditions
        TEXT DEFAULT 'Payment due within 15 days of issue date.';


-- =====================================================================
-- 17B. SERVICE PRICE PRESETS (QUICK ADD)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.service_price_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    sac_code TEXT DEFAULT '998314',
    default_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    gst_applicable BOOLEAN NOT NULL DEFAULT TRUE,
    gst_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================================================
-- 18. SELLER PROFILE INITIAL RECORD
-- =====================================================================

INSERT INTO public.seller_profile
(
    company_name,
    tagline,
    email,
    phone,
    address,
    gstin,
    state_code,
    jurisdiction,
    bank_name,
    account_name,
    account_number,
    ifsc_code,
    terms_conditions
)
SELECT
    'Fusion Forge Creation',
    'Where Ideas Fuse With Technology',
    '',
    '',
    'Survey No. 274, Athal Village, Silvassa, Dadra & Nagar Haveli - 396230',
    '',
    '26',
    'Silvassa Jurisdiction',
    '',
    'Fusion Forge Creation',
    '',
    '',
    'Payment due within 15 days of issue date.'
WHERE NOT EXISTS (
    SELECT 1
    FROM public.seller_profile
);


-- =====================================================================
-- 19. USER ROLE FUNCTION
-- =====================================================================

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    u_role TEXT;
BEGIN
    IF user_id IS NULL THEN
        RETURN 'anon';
    END IF;

    SELECT role
    INTO u_role
    FROM public.profiles
    WHERE id = user_id;

    RETURN COALESCE(u_role, 'none');
END;
$$;


-- =====================================================================
-- 20. ROLE PROTECTION
-- Only Super Admin may change a user's role.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.enforce_role_management()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

    IF NEW.role IS DISTINCT FROM OLD.role THEN

        IF public.get_user_role(auth.uid()) <> 'super_admin' THEN
            RAISE EXCEPTION
                'Access Denied: Only Super Admin can change user roles!';
        END IF;

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS trg_protect_user_roles
ON public.profiles;

CREATE TRIGGER trg_protect_user_roles
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_role_management();


-- =====================================================================
-- 21. INVOICE NUMBER GENERATOR
-- =====================================================================

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    seq_val INT;
    yr TEXT;
    inv_num TEXT;
BEGIN

    yr := to_char(CURRENT_DATE, 'YYYY');

    seq_val := nextval(
        'public.invoice_number_seq'
    );

    inv_num :=
        'FFC-' ||
        yr ||
        '-' ||
        lpad(seq_val::text, 4, '0');

    RETURN inv_num;

END;
$$;


-- =====================================================================
-- 22. GSTIN STATE CODE EXTRACTION
-- =====================================================================

CREATE OR REPLACE FUNCTION public.extract_gst_state_code(
    p_gstin TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN

    IF p_gstin IS NULL
       OR LENGTH(TRIM(p_gstin)) < 2 THEN
        RETURN NULL;
    END IF;

    RETURN SUBSTRING(
        TRIM(p_gstin)
        FROM 1 FOR 2
    );

END;
$$;


-- =====================================================================
-- 23. CENTRAL INVOICE GST RECALCULATION ENGINE
--
-- SINGLE SOURCE OF TRUTH
--
-- INTRA-STATE:
-- CGST + SGST
--
-- INTRA-UT:
-- CGST + UTGST
--
-- INTER-STATE:
-- IGST
--
-- =====================================================================

CREATE OR REPLACE FUNCTION public.recalculate_invoice_totals(
    target_inv_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$

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

    -- ---------------------------------------------------------------
    -- 1. SUBTOTAL
    -- ---------------------------------------------------------------

    SELECT COALESCE(
        SUM(total_price),
        0.00
    )
    INTO v_subtotal
    FROM public.invoice_items
    WHERE invoice_id = target_inv_id;


    -- ---------------------------------------------------------------
    -- 2. INVOICE HEADER
    -- ---------------------------------------------------------------

    SELECT
        COALESCE(discount, 0.00),
        COALESCE(tax_rate, 0.00),
        COALESCE(gst_applicable, FALSE),
        seller_gstin,
        seller_state_code,
        buyer_gstin,
        buyer_state_code,
        place_of_supply,
        COALESCE(paid_amount, 0.00),
        status,
        due_date
    INTO
        v_discount,
        v_tax_rate,
        v_gst_app,
        v_seller_gstin,
        v_seller_state,
        v_buyer_gstin,
        v_buyer_state,
        v_place_of_supply,
        v_paid,
        v_status,
        v_due_date
    FROM public.invoices
    WHERE id = target_inv_id;


    -- ---------------------------------------------------------------
    -- 3. SELLER STATE
    -- ---------------------------------------------------------------

    IF v_seller_state IS NULL
       AND v_seller_gstin IS NOT NULL THEN

        v_seller_state :=
            public.extract_gst_state_code(
                v_seller_gstin
            );

    END IF;


    IF v_seller_state IS NULL
       OR TRIM(v_seller_state) = '' THEN

        v_seller_state := '26';

    END IF;


    -- ---------------------------------------------------------------
    -- 4. BUYER STATE
    -- ---------------------------------------------------------------

    IF v_buyer_state IS NULL
       AND v_buyer_gstin IS NOT NULL THEN

        v_buyer_state :=
            public.extract_gst_state_code(
                v_buyer_gstin
            );

    END IF;


    -- ---------------------------------------------------------------
    -- 5. TAXABLE VALUE
    -- ---------------------------------------------------------------

    v_taxable :=
        GREATEST(
            0.00,
            v_subtotal -
            COALESCE(v_discount, 0.00)
        );


    -- ---------------------------------------------------------------
    -- 6. GST CALCULATION
    -- ---------------------------------------------------------------

    IF v_gst_app = TRUE
       AND v_tax_rate > 0 THEN


        IF v_buyer_state IS NULL
           OR TRIM(v_buyer_state) = '' THEN

            RAISE EXCEPTION
                'Buyer State/UT or valid GSTIN is required when GST is enabled.';

        END IF;


        SELECT type
        INTO v_seller_type
        FROM public.state_ut_master
        WHERE code = v_seller_state
          AND is_selectable = TRUE;


        IF v_seller_type IS NULL THEN

            RAISE EXCEPTION
                'Invalid Seller State/UT Code: %',
                v_seller_state;

        END IF;


        SELECT name
        INTO v_buyer_state_name
        FROM public.state_ut_master
        WHERE code = v_buyer_state
          AND is_selectable = TRUE;


        IF v_buyer_state_name IS NULL THEN

            RAISE EXCEPTION
                'Invalid Buyer State/UT Code: %',
                v_buyer_state;

        END IF;


        IF v_place_of_supply IS NULL
           OR TRIM(v_place_of_supply) = '' THEN

            v_place_of_supply :=
                v_buyer_state_name ||
                ' (' ||
                v_buyer_state ||
                ')';

        END IF;


        -- -----------------------------------------------------------
        -- INTRA-STATE / INTRA-UT
        -- -----------------------------------------------------------

        IF v_seller_state = v_buyer_state THEN

            v_cgst :=
                ROUND(
                    v_taxable *
                    (
                        (v_tax_rate / 2.00)
                        / 100.00
                    ),
                    2
                );


            IF v_seller_type = 'UT' THEN

                v_utgst :=
                    ROUND(
                        v_taxable *
                        (
                            (v_tax_rate / 2.00)
                            / 100.00
                        ),
                        2
                    );

                v_sgst := 0.00;

            ELSE

                v_sgst :=
                    ROUND(
                        v_taxable *
                        (
                            (v_tax_rate / 2.00)
                            / 100.00
                        ),
                        2
                    );

                v_utgst := 0.00;

            END IF;

            v_igst := 0.00;


        -- -----------------------------------------------------------
        -- INTER-STATE
        -- -----------------------------------------------------------

        ELSE

            v_igst :=
                ROUND(
                    v_taxable *
                    (
                        v_tax_rate / 100.00
                    ),
                    2
                );

            v_cgst := 0.00;
            v_sgst := 0.00;
            v_utgst := 0.00;

        END IF;


    ELSE

        -- GST OFF

        v_cgst := 0.00;
        v_sgst := 0.00;
        v_utgst := 0.00;
        v_igst := 0.00;

    END IF;


    -- ---------------------------------------------------------------
    -- 7. TOTAL TAX
    -- ---------------------------------------------------------------

    v_total_tax :=
        v_cgst +
        v_sgst +
        v_utgst +
        v_igst;


    -- ---------------------------------------------------------------
    -- 8. GRAND TOTAL
    -- ---------------------------------------------------------------

    v_grand_total :=
        v_taxable +
        v_total_tax;


    -- ---------------------------------------------------------------
    -- 9. PAYMENT STATUS
    -- ---------------------------------------------------------------

    IF v_status NOT IN ('Cancelled', 'Draft') THEN

        IF v_paid >= v_grand_total
           AND v_grand_total > 0 THEN

            v_status := 'Paid';

        ELSIF v_paid > 0 THEN

            v_status := 'Partially Paid';

        ELSIF v_due_date IS NOT NULL
              AND v_due_date < CURRENT_DATE THEN

            v_status := 'Overdue';

        ELSE

            v_status := 'Sent';

        END IF;

    END IF;


    -- ---------------------------------------------------------------
    -- 10. SAVE CALCULATED VALUES
    --
    -- IMPORTANT:
    -- This update does not cause recursive invoice recalculation
    -- because the header trigger only watches the user-editable
    -- GST/header columns.
    -- ---------------------------------------------------------------

    UPDATE public.invoices
    SET
        subtotal = v_subtotal,
        taxable_amount = v_taxable,

        cgst_amount = v_cgst,
        sgst_amount = v_sgst,
        utgst_amount = v_utgst,
        igst_amount = v_igst,

        tax_amount = v_total_tax,

        grand_total = v_grand_total,

        seller_state_code = v_seller_state,
        buyer_state_code = v_buyer_state,

        place_of_supply = v_place_of_supply,

        status = v_status,

        updated_at = NOW()

    WHERE id = target_inv_id;

END;
$$;


-- =====================================================================
-- 24. ITEM TOTAL CALCULATION
-- =====================================================================

CREATE OR REPLACE FUNCTION public.calc_item_total()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    NEW.total_price :=
        ROUND(
            COALESCE(NEW.quantity, 0) *
            COALESCE(NEW.unit_price, 0.00),
            2
        );

    RETURN NEW;

END;
$$;


-- =====================================================================
-- 25. REMOVE OLD / DUPLICATE INVOICE ITEM TRIGGERS
-- =====================================================================

DROP TRIGGER IF EXISTS trg_invoice_items_calc
ON public.invoice_items;

DROP TRIGGER IF EXISTS trg_calc_invoice_items
ON public.invoice_items;

DROP TRIGGER IF EXISTS trg_calc_item_total
ON public.invoice_items;

DROP TRIGGER IF EXISTS trg_invoice_items_recalc
ON public.invoice_items;


-- =====================================================================
-- 26. FINAL ITEM LINE TOTAL TRIGGER
-- =====================================================================

CREATE TRIGGER trg_calc_item_total
BEFORE INSERT OR UPDATE
ON public.invoice_items
FOR EACH ROW
EXECUTE FUNCTION public.calc_item_total();


-- =====================================================================
-- 27. FINAL NON-RECURSIVE INVOICE ITEM RECALCULATION
-- =====================================================================

CREATE OR REPLACE FUNCTION public.trg_invoice_items_recalc()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$

DECLARE
    target_id UUID;

BEGIN

    IF TG_OP = 'DELETE' THEN

        target_id := OLD.invoice_id;

    ELSE

        target_id := NEW.invoice_id;

    END IF;


    PERFORM public.recalculate_invoice_totals(
        target_id
    );


    RETURN NULL;

END;
$$;


CREATE TRIGGER trg_calc_invoice_items
AFTER INSERT OR UPDATE OR DELETE
ON public.invoice_items
FOR EACH ROW
EXECUTE FUNCTION public.trg_invoice_items_recalc();


-- =====================================================================
-- 28. FINAL NON-RECURSIVE INVOICE HEADER RECALCULATION
-- =====================================================================

DROP TRIGGER IF EXISTS trg_invoice_header_calc
ON public.invoices;


CREATE OR REPLACE FUNCTION public.trg_invoice_header_recalc()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

    PERFORM public.recalculate_invoice_totals(
        NEW.id
    );

    RETURN NULL;

END;
$$;


CREATE TRIGGER trg_invoice_header_calc
AFTER UPDATE OF
    discount,
    tax_rate,
    gst_applicable,
    seller_gstin,
    seller_state_code,
    buyer_gstin,
    buyer_state_code,
    place_of_supply
ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.trg_invoice_header_recalc();


-- =====================================================================
-- 29. OVERDUE INVOICE FUNCTION
-- =====================================================================

CREATE OR REPLACE FUNCTION public.update_overdue_invoices()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

    UPDATE public.invoices
    SET
        status = 'Overdue',
        updated_at = NOW()
    WHERE due_date < CURRENT_DATE
      AND status IN (
          'Draft',
          'Sent',
          'Partially Paid'
      )
      AND paid_amount < grand_total;

END;
$$;


-- =====================================================================
-- 30. PAYMENT VALIDATION
-- Prevent payment greater than outstanding invoice balance
-- =====================================================================

CREATE OR REPLACE FUNCTION public.process_payment_validation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$

DECLARE

    v_grand_total NUMERIC(12,2);
    v_existing_paid NUMERIC(12,2);
    v_new_total_paid NUMERIC(12,2);
    v_outstanding NUMERIC(12,2);

BEGIN

    SELECT grand_total
    INTO v_grand_total
    FROM public.invoices
    WHERE id = NEW.invoice_id;


    IF v_grand_total IS NULL THEN

        RAISE EXCEPTION
            'Invoice not found!';

    END IF;


    SELECT COALESCE(
        SUM(amount),
        0.00
    )
    INTO v_existing_paid
    FROM public.payments
    WHERE invoice_id = NEW.invoice_id
      AND id <> COALESCE(
          NEW.id,
          '00000000-0000-0000-0000-000000000000'::UUID
      );


    v_outstanding :=
        v_grand_total -
        v_existing_paid;


    v_new_total_paid :=
        v_existing_paid +
        NEW.amount;


    IF NEW.amount >
       (v_outstanding + 0.001) THEN

        RAISE EXCEPTION
            'Payment Rejected: Payment amount (%) exceeds invoice outstanding balance (%)!',
            NEW.amount,
            v_outstanding;

    END IF;


    UPDATE public.invoices
    SET
        paid_amount = v_new_total_paid,

        status =
            CASE

                WHEN v_new_total_paid >= v_grand_total
                    THEN 'Paid'

                WHEN v_new_total_paid > 0
                    THEN 'Partially Paid'

                ELSE status

            END,

        updated_at = NOW()

    WHERE id = NEW.invoice_id;


    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS trg_validate_payment
ON public.payments;


CREATE TRIGGER trg_validate_payment
BEFORE INSERT OR UPDATE
ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.process_payment_validation();


-- =====================================================================
-- 31. AUTH USER -> PROFILE AUTOMATIC CREATION
-- =====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

    INSERT INTO public.profiles
    (
        id,
        email,
        full_name,
        role
    )
    VALUES
    (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'role',
            'admin'
        )
    )

    ON CONFLICT (id)
    DO NOTHING;


    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS trg_on_auth_user_created
ON auth.users;


CREATE TRIGGER trg_on_auth_user_created
AFTER INSERT
ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- =====================================================================
-- 32. ATOMIC INVOICE CREATION RPC
-- =====================================================================

CREATE OR REPLACE FUNCTION public.create_invoice_with_items(
    p_invoice_data JSONB,
    p_items_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$

DECLARE

    v_inv_id UUID;
    v_generated_num TEXT;
    v_item JSONB;

    v_result_row public.invoices%ROWTYPE;

BEGIN

    -- ---------------------------------------------------------------
    -- Invoice number
    -- ---------------------------------------------------------------

    v_generated_num :=
        p_invoice_data->>'invoice_number';


    IF v_generated_num IS NULL
       OR TRIM(v_generated_num) = '' THEN

        SELECT public.generate_invoice_number()
        INTO v_generated_num;

    END IF;


    -- ---------------------------------------------------------------
    -- Invoice header
    -- ---------------------------------------------------------------

    INSERT INTO public.invoices
    (
        invoice_number,
        client_id,
        status,
        issue_date,
        due_date,
        discount,
        tax_rate,
        gst_applicable,
        seller_gstin,
        seller_state_code,
        buyer_gstin,
        buyer_state_code,
        place_of_supply,
        notes
    )
    VALUES
    (
        v_generated_num,

        (p_invoice_data->>'client_id')::UUID,

        COALESCE(
            p_invoice_data->>'status',
            'Sent'
        ),

        (p_invoice_data->>'issue_date')::DATE,

        (p_invoice_data->>'due_date')::DATE,

        COALESCE(
            (p_invoice_data->>'discount')::NUMERIC,
            0.00
        ),

        COALESCE(
            (p_invoice_data->>'tax_rate')::NUMERIC,
            0.00
        ),

        COALESCE(
            (p_invoice_data->>'gst_applicable')::BOOLEAN,
            FALSE
        ),

        NULLIF(
            TRIM(
                p_invoice_data->>'seller_gstin'
            ),
            ''
        ),

        COALESCE(
            NULLIF(
                TRIM(
                    p_invoice_data->>'seller_state_code'
                ),
                ''
            ),
            '26'
        ),

        NULLIF(
            TRIM(
                p_invoice_data->>'buyer_gstin'
            ),
            ''
        ),

        NULLIF(
            TRIM(
                p_invoice_data->>'buyer_state_code'
            ),
            ''
        ),

        NULLIF(
            TRIM(
                p_invoice_data->>'place_of_supply'
            ),
            ''
        ),

        NULLIF(
            TRIM(
                p_invoice_data->>'notes'
            ),
            ''
        )
    )
    RETURNING id
    INTO v_inv_id;


    -- ---------------------------------------------------------------
    -- Invoice items
    -- ---------------------------------------------------------------

    FOR v_item IN
        SELECT *
        FROM jsonb_array_elements(
            p_items_data
        )
    LOOP

        INSERT INTO public.invoice_items
        (
            invoice_id,
            description,
            quantity,
            unit_price
        )
        VALUES
        (
            v_inv_id,

            v_item->>'description',

            (v_item->>'quantity')::NUMERIC,

            (v_item->>'unit_price')::NUMERIC
        );

    END LOOP;


    -- ---------------------------------------------------------------
    -- Final calculation
    -- ---------------------------------------------------------------

    PERFORM public.recalculate_invoice_totals(
        v_inv_id
    );


    SELECT *
    INTO v_result_row
    FROM public.invoices
    WHERE id = v_inv_id;


    RETURN to_jsonb(
        v_result_row
    );

END;
$$;


-- =====================================================================
-- 33. RLS ENABLEMENT
-- =====================================================================

ALTER TABLE public.profiles
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.services
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.projects
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.technologies
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.testimonials
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.faqs
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.enquiries
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.clients
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.invoices
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.invoice_items
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.payments
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.website_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.state_ut_master
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.seller_profile
ENABLE ROW LEVEL SECURITY;


-- =====================================================================
-- 34. PROFILES RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Users can view own profile"
ON public.profiles;

CREATE POLICY
"Users can view own profile"
ON public.profiles
FOR SELECT
USING
(
    auth.uid() = id
    OR
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin')
);


DROP POLICY IF EXISTS
"Super Admins can manage all profiles"
ON public.profiles;

CREATE POLICY
"Super Admins can manage all profiles"
ON public.profiles
FOR ALL
USING
(
    public.get_user_role(auth.uid())
        = 'super_admin'
);


-- =====================================================================
-- 35. SERVICES RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Public read services"
ON public.services;

CREATE POLICY
"Public read services"
ON public.services
FOR SELECT
USING
(
    is_active = TRUE
    OR
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin', 'editor')
);


DROP POLICY IF EXISTS
"Admin/Editor manage services"
ON public.services;

CREATE POLICY
"Admin/Editor manage services"
ON public.services
FOR ALL
USING
(
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin', 'editor')
);


-- =====================================================================
-- 36. PROJECTS RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Public read projects"
ON public.projects;

CREATE POLICY
"Public read projects"
ON public.projects
FOR SELECT
USING (TRUE);


DROP POLICY IF EXISTS
"Admin/Editor manage projects"
ON public.projects;

CREATE POLICY
"Admin/Editor manage projects"
ON public.projects
FOR ALL
USING
(
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin', 'editor')
);


-- =====================================================================
-- 37. TECHNOLOGIES RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Public read technologies"
ON public.technologies;

CREATE POLICY
"Public read technologies"
ON public.technologies
FOR SELECT
USING
(
    is_active = TRUE
    OR
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin', 'editor')
);


DROP POLICY IF EXISTS
"Admin/Editor manage technologies"
ON public.technologies;

CREATE POLICY
"Admin/Editor manage technologies"
ON public.technologies
FOR ALL
USING
(
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin', 'editor')
);


-- =====================================================================
-- 38. TESTIMONIALS RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Public read testimonials"
ON public.testimonials;

CREATE POLICY
"Public read testimonials"
ON public.testimonials
FOR SELECT
USING
(
    is_featured = TRUE
    OR
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin', 'editor')
);


DROP POLICY IF EXISTS
"Admin/Editor manage testimonials"
ON public.testimonials;

CREATE POLICY
"Admin/Editor manage testimonials"
ON public.testimonials
FOR ALL
USING
(
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin', 'editor')
);


-- =====================================================================
-- 39. FAQ RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Public read faqs"
ON public.faqs;

CREATE POLICY
"Public read faqs"
ON public.faqs
FOR SELECT
USING
(
    is_active = TRUE
    OR
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin', 'editor')
);


DROP POLICY IF EXISTS
"Admin/Editor manage faqs"
ON public.faqs;

CREATE POLICY
"Admin/Editor manage faqs"
ON public.faqs
FOR ALL
USING
(
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin', 'editor')
);


-- =====================================================================
-- 40. ENQUIRIES RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Public can submit enquiries"
ON public.enquiries;

CREATE POLICY
"Public can submit enquiries"
ON public.enquiries
FOR INSERT
WITH CHECK (TRUE);


DROP POLICY IF EXISTS
"Admins can view and manage enquiries"
ON public.enquiries;

CREATE POLICY
"Admins can view and manage enquiries"
ON public.enquiries
FOR ALL
USING
(
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin')
);


-- =====================================================================
-- 41. CLIENTS RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Admins can manage clients"
ON public.clients;

CREATE POLICY
"Admins can manage clients"
ON public.clients
FOR ALL
USING
(
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin')
);


-- =====================================================================
-- 42. INVOICE RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Invoices access policy"
ON public.invoices;

CREATE POLICY
"Invoices access policy"
ON public.invoices
FOR ALL
TO authenticated
USING
(
    is_deleted = FALSE
    OR
    public.get_user_role(auth.uid())
        = 'super_admin'
)
WITH CHECK
(
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin')
);


-- =====================================================================
-- 43. INVOICE ITEMS RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Admins can manage invoice items"
ON public.invoice_items;

CREATE POLICY
"Admins can manage invoice items"
ON public.invoice_items
FOR ALL
USING
(
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin')
);


-- =====================================================================
-- 44. PAYMENTS RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Admins can manage payments"
ON public.payments;

CREATE POLICY
"Admins can manage payments"
ON public.payments
FOR ALL
USING
(
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin')
);


-- =====================================================================
-- 45. WEBSITE SETTINGS RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Public can view ONLY public website settings"
ON public.website_settings;

CREATE POLICY
"Public can view ONLY public website settings"
ON public.website_settings
FOR SELECT
USING
(
    is_public = TRUE
    OR
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin')
);


DROP POLICY IF EXISTS
"Admins can manage all website settings"
ON public.website_settings;

CREATE POLICY
"Admins can manage all website settings"
ON public.website_settings
FOR ALL
USING
(
    public.get_user_role(auth.uid())
        IN ('super_admin', 'admin')
);


-- =====================================================================
-- 46. STATE / UT MASTER RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Public can read state ut master"
ON public.state_ut_master;

CREATE POLICY
"Public can read state ut master"
ON public.state_ut_master
FOR SELECT
TO anon, authenticated
USING (TRUE);


-- =====================================================================
-- 47. SELLER PROFILE RLS
-- =====================================================================

DROP POLICY IF EXISTS
"Allow public read access to seller_profile"
ON public.seller_profile;

DROP POLICY IF EXISTS
"Allow admin update access to seller_profile"
ON public.seller_profile;

DROP POLICY IF EXISTS
"Allow admin insert access to seller_profile"
ON public.seller_profile;


CREATE POLICY
"Allow public read access to seller_profile"
ON public.seller_profile
FOR SELECT
TO anon, authenticated, service_role
USING (TRUE);


CREATE POLICY
"Allow admin update access to seller_profile"
ON public.seller_profile
FOR UPDATE
TO authenticated, service_role
USING (TRUE)
WITH CHECK (TRUE);


CREATE POLICY
"Allow admin insert access to seller_profile"
ON public.seller_profile
FOR INSERT
TO authenticated, service_role
WITH CHECK (TRUE);


-- =====================================================================
-- 48. GRANTS
-- =====================================================================

GRANT USAGE
ON SCHEMA public
TO anon, authenticated, service_role;


GRANT SELECT
ON public.state_ut_master
TO anon, authenticated;


GRANT EXECUTE
ON FUNCTION public.create_invoice_with_items(JSONB, JSONB)
TO authenticated;


GRANT ALL
ON public.seller_profile
TO anon, authenticated, service_role;


-- =====================================================================
-- 49. WEBSITE DEFAULT CONTENT
-- =====================================================================

INSERT INTO public.services
(
    title,
    slug,
    description,
    icon,
    features,
    order_index
)
VALUES

(
    'Web Application Development',
    'web-application-development',
    'Custom high-performance web applications built with modern technologies.',
    'Code',
    ARRAY[
        'Custom Web Applications',
        'Business Portals',
        'Responsive Design',
        'Scalable Architecture'
    ],
    1
),

(
    'Mobile Application Development',
    'mobile-application-development',
    'Modern mobile applications for Android and iOS.',
    'Smartphone',
    ARRAY[
        'Android & iOS',
        'Flutter / React Native',
        'Push Notifications',
        'App Deployment'
    ],
    2
),

(
    'Backend Development',
    'backend-development',
    'Secure and scalable backend systems for modern applications.',
    'Server',
    ARRAY[
        'REST Architecture',
        'Authentication',
        'Database Integration',
        'Scalable Backend'
    ],
    3
),

(
    'API Development',
    'api-development',
    'Secure REST APIs and third-party integrations.',
    'Workflow',
    ARRAY[
        'REST APIs',
        'Authentication',
        'Third-Party Integration',
        'API Documentation'
    ],
    4
),

(
    'Database Solutions',
    'database-solutions',
    'Database design, optimization, migration and management.',
    'Database',
    ARRAY[
        'Database Design',
        'Query Optimization',
        'Data Migration',
        'Backup & Security'
    ],
    5
),

(
    'UI/UX Design',
    'ui-ux-design',
    'Modern, intuitive and user-focused interface design.',
    'Layout',
    ARRAY[
        'UI Design',
        'UX Research',
        'Wireframes',
        'Design Systems'
    ],
    6
),

(
    'Business Software Solutions',
    'business-software-solutions',
    'Customized business software designed around your workflow.',
    'Briefcase',
    ARRAY[
        'CRM & ERP',
        'Workflow Automation',
        'Role-Based Access',
        'Business Dashboards'
    ],
    7
),

(
    'Cloud/Deployment Services',
    'cloud-deployment-services',
    'Deployment and cloud infrastructure for modern applications.',
    'Cloud',
    ARRAY[
        'Cloud Deployment',
        'CI/CD',
        'Server Configuration',
        'Application Hosting'
    ],
    8
),

(
    'Maintenance & Support',
    'maintenance-support',
    'Ongoing technical support, updates, security and performance optimization.',
    'ShieldCheck',
    ARRAY[
        'Application Maintenance',
        'Security Updates',
        'Performance Optimization',
        'Technical Support'
    ],
    9
)

ON CONFLICT (slug)
DO NOTHING;


-- =====================================================================
-- 50. DEFAULT WEBSITE SETTINGS
-- =====================================================================

INSERT INTO public.website_settings
(
    setting_key,
    setting_value,
    is_public
)
VALUES
(
    'agency_info',

    '{
        "name": "Fusion Forge Creation",
        "tagline": "Where Ideas Fuse with Technology.",
        "email": "contact@fusionforgecreations.com",
        "phone": "+91 63588 55524",
        "address": "Yogi Milan, Near Ring Road, Amli, Silvassa, Dadra & Nagar Haveli - 396230",
        "tax_id": ""
    }'::JSONB,

    TRUE
),

(
    'tax_config',

    '{
        "gst_rate": 18.00,
        "currency": "INR",
        "currency_symbol": "₹"
    }'::JSONB,

    FALSE
)

ON CONFLICT (setting_key)
DO NOTHING;


-- =====================================================================
-- 51. FINAL VERIFICATION QUERIES
-- =====================================================================

SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;


SELECT
    routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;


SELECT
    trigger_name,
    event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;


-- =====================================================================
-- 52. PHASE 9: PROJECT STATUS HISTORY & COMPLETED WORKS ARCHIVE
-- =====================================================================

-- 52.1 Project Status History Table
CREATE TABLE IF NOT EXISTS public.project_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by TEXT NOT NULL DEFAULT 'admin@fusionforgecreation.com',
    notes TEXT,
    email_sent BOOLEAN NOT NULL DEFAULT FALSE,
    email_recipient TEXT,
    message_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 52.2 Completed Works (Internal Company Portfolio & History System)
CREATE TABLE IF NOT EXISTS public.completed_works (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    project_title TEXT NOT NULL,
    work_category TEXT NOT NULL,
    completion_date DATE NOT NULL DEFAULT CURRENT_DATE,
    technology_type TEXT[] NOT NULL DEFAULT '{}',
    public_url TEXT,
    web_app_url TEXT,
    software_url TEXT,
    mobile_app_info TEXT,
    short_description TEXT NOT NULL DEFAULT '',
    deliverables_summary TEXT[] DEFAULT '{}',
    source_project_id TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_by TEXT DEFAULT 'Super Admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies for Phase 9 tables
ALTER TABLE public.project_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access to project_status_history"
ON public.project_status_history FOR ALL
TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to completed_works"
ON public.completed_works FOR ALL
TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to completed_works"
ON public.completed_works FOR SELECT
TO anon USING (is_verified = true);

-- Seed Historical Completed Works
INSERT INTO public.completed_works (
    id, client_name, project_title, work_category, completion_date,
    technology_type, public_url, web_app_url, software_url, mobile_app_info,
    short_description, deliverables_summary, is_verified
) VALUES
(
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Apex Fintech Solutions Pvt. Ltd.',
    'Apex Financial Intelligence & Trading Analytics Platform',
    'Web Application & Real-time Trading',
    '2026-04-28',
    ARRAY['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'WebSockets'],
    'https://apexfintech.io',
    'https://app.apexfintech.io',
    'https://github.com/fusion-forge/apex-engine',
    'Progressive Web Application (PWA) with push alerts',
    'Enterprise high-frequency market analytics dashboard featuring sub-second WebSocket updates and automated P&L reporting.',
    ARRAY['Interactive financial dashboard', 'Real-time WebSocket streaming feed', 'Admin telemetry and client user desk'],
    TRUE
),
(
    'a1b2c3d4-0002-4000-8000-000000000002',
    'Quantum Logistics & Freight',
    'Quantum Fleet Telematics & Live GPS IoT Engine',
    'Enterprise Cloud & IoT Telematics',
    '2026-07-24',
    ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'MQTT', 'Docker'],
    'https://quantumfreight.in',
    'https://telematics.quantumfreight.in',
    'https://cloud.quantumfreight.in',
    'Driver Android GPS Telematics App (Private Distribution)',
    'Multi-tenant freight dispatch platform integrating real-time GPS telemetry from 500+ commercial fleet vehicles.',
    ARRAY['High-throughput MQTT GPS telemetry ingestion', 'Live map clustering & route playback', 'Driver mobile application APK'],
    TRUE
),
(
    'a1b2c3d4-0003-4000-8000-000000000003',
    'JP MODATEX LLP',
    'Modatex Textile ERP & Production Workflow Engine',
    'Enterprise ERP & Inventory Automation',
    '2026-06-18',
    ARRAY['React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Node.js'],
    'https://jpmodatex.com',
    'https://erp.jpmodatex.com',
    'https://internal.jpmodatex.com/portal',
    'Inventory Barcode Scanner Web App for floor supervisors',
    'End-to-end textile manufacturing ERP supporting loom scheduling, yarn batch tracking, and inventory dispatch.',
    ARRAY['Yarn and fabric inventory tracking system', 'Production batch scheduling calendar', 'Automated inter-state IGST billing engine'],
    TRUE
)
ON CONFLICT (id) DO NOTHING;


-- =====================================================================
-- PHASE 12: CENTRAL NOTIFICATION AND EMAIL DISPATCH LOG TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'system',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    entity_type TEXT,
    entity_id TEXT,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    target_role TEXT DEFAULT 'all',
    target_user_id TEXT,
    target_client_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    event_key TEXT
);

CREATE TABLE IF NOT EXISTS public.email_logs (
    id TEXT PRIMARY KEY,
    recipient TEXT NOT NULL,
    sender TEXT NOT NULL DEFAULT 'admin@fusionforgecreation.com',
    subject TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
    message_id TEXT,
    error_message TEXT,
    entity_type TEXT,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access to notifications"
ON public.notifications FOR ALL
TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read own notifications"
ON public.notifications FOR SELECT
TO anon USING (true);

CREATE POLICY "Allow authenticated full access to email_logs"
ON public.email_logs FOR ALL
TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read email_logs"
ON public.email_logs FOR SELECT
TO anon USING (true);


-- =====================================================================
-- END OF FUSION FORGE CREATION MASTER INSFORGE DATABASE (SCHEMA V2)
-- =====================================================================
`;

export const INSFORGE_SQL_SCHEMA = INSFORGE_PRODUCTION_SCHEMA_V2;

