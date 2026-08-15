import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  Terminal, 
  Lock, 
  GitFork, 
  Layers, 
  ArrowRight, 
  FileText, 
  Users, 
  Receipt, 
  CreditCard, 
  Shield, 
  Globe2, 
  Building2, 
  Code2, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPABASE_SQL_SCHEMA } from '../../mockData';

interface TableColumnInfo {
  name: string;
  type: string;
  isNullable: boolean;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  defaultValue?: string;
  description?: string;
}

interface TableNode {
  name: string;
  category: 'auth' | 'crm' | 'sales' | 'content' | 'seller' | 'geography' | 'audit';
  description: string;
  primaryKey: string;
  foreignKeys?: { column: string; references: string; onDelete?: string }[];
  columnsCount: number;
  columns?: TableColumnInfo[];
  badge?: string;
  sampleCount?: number;
}

export const SupabaseArchitecture: React.FC = () => {
  const { 
    clients, 
    quotations, 
    invoices, 
    payments, 
    services, 
    technologies, 
    managedProjects, 
    testimonials, 
    faqs, 
    users, 
    auditLogs,
    enquiries
  } = useApp();

  const [activeTab, setActiveTab] = useState<'relationships' | 'schema' | 'audit_logs' | 'ddl'>('relationships');
  const [selectedTable, setSelectedTable] = useState<string>('clients');
  const [copied, setCopied] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState('ALL');

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tablesCatalog: Record<string, TableNode> = {
    profiles: {
      name: 'profiles',
      category: 'auth',
      description: 'System user profiles with role-based access control (super_admin, admin, editor, accountant, staff, client).',
      primaryKey: 'id (UUID)',
      columnsCount: 8,
      sampleCount: users.length
    },
    audit_logs: {
      name: 'audit_logs',
      category: 'audit',
      description: 'Immutable record of critical CRUD mutations, payment logs, and calculation triggers.',
      primaryKey: 'id (UUID)',
      foreignKeys: [{ column: 'user_id', references: 'profiles(id)', onDelete: 'SET NULL' }],
      columnsCount: 8,
      sampleCount: auditLogs.length
    },
    clients: {
      name: 'clients',
      category: 'crm',
      description: 'Customer master records with billing details, state code, GSTIN, PAN, and ledger totals.',
      primaryKey: 'id (UUID)',
      foreignKeys: [{ column: 'state_code', references: 'state_ut_master(code)', onDelete: 'RESTRICT' }],
      columnsCount: 15,
      sampleCount: clients.length
    },
    enquiries: {
      name: 'enquiries',
      category: 'crm',
      description: 'Inbound public website enquiries capturing client requirements and lead status.',
      primaryKey: 'id (UUID)',
      foreignKeys: [{ column: 'assigned_to', references: 'profiles(id)', onDelete: 'SET NULL' }],
      columnsCount: 11,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique enquiry identifier' },
        { name: 'name', type: 'TEXT', isNullable: false, description: 'Prospect contact name' },
        { name: 'company_name', type: 'TEXT', isNullable: true, description: 'Client company / organization' },
        { name: 'email', type: 'TEXT', isNullable: false, description: 'Client email address' },
        { name: 'phone', type: 'TEXT', isNullable: false, description: 'Direct contact phone / WhatsApp' },
        { name: 'service', type: 'TEXT', isNullable: false, description: 'Requested service type' },
        { name: 'message', type: 'TEXT', isNullable: false, description: 'Detailed project requirements' },
        { name: 'status', type: 'TEXT', isNullable: false, defaultValue: "'New'", description: 'New, Contacted, In Progress, Converted, Closed' },
        { name: 'assigned_to', type: 'UUID', isNullable: true, isForeign: true, references: 'profiles(id)', description: 'Assigned agency account manager' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Submission timestamp' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Status update timestamp' }
      ],
      sampleCount: enquiries.length
    },
    quotations: {
      name: 'quotations',
      category: 'sales',
      description: 'Commercial quotes with scope, discount structure, and authoritative GST breakdown.',
      primaryKey: 'id (UUID)',
      foreignKeys: [
        { column: 'client_id', references: 'clients(id)', onDelete: 'CASCADE' },
        { column: 'created_by', references: 'profiles(id)', onDelete: 'SET NULL' }
      ],
      columnsCount: 17,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique quotation identifier' },
        { name: 'quotation_number', type: 'TEXT', isNullable: false, description: 'Unique quote identifier (e.g. QTE-2026-001)' },
        { name: 'client_id', type: 'UUID', isNullable: false, isForeign: true, references: 'clients(id)', description: 'Client reference (CASCADE)' },
        { name: 'status', type: 'TEXT', isNullable: false, defaultValue: "'draft'", description: 'draft, sent, approved, rejected, converted' },
        { name: 'issue_date', type: 'DATE', isNullable: false, defaultValue: 'CURRENT_DATE', description: 'Date of proposal generation' },
        { name: 'valid_until', type: 'DATE', isNullable: false, defaultValue: "CURRENT_DATE + INTERVAL '30 days'", description: 'Proposal validity expiry' },
        { name: 'discount', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Discount deduction' },
        { name: 'tax_rate', type: 'NUMERIC(5,2)', isNullable: false, defaultValue: '18.00', description: 'Applicable GST percentage' },
        { name: 'gst_applicable', type: 'BOOLEAN', isNullable: false, defaultValue: 'true', description: 'Whether GST applies' },
        { name: 'subtotal', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Gross quote sum' },
        { name: 'taxable_amount', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Base taxable sum' },
        { name: 'tax_amount', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Total tax levied' },
        { name: 'grand_total', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Payable grand total' },
        { name: 'notes', type: 'TEXT', isNullable: true, description: 'Commercial terms & scope notes' },
        { name: 'created_by', type: 'UUID', isNullable: true, isForeign: true, references: 'profiles(id)', description: 'Authoring user profile' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Creation timestamp' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Update timestamp' }
      ],
      sampleCount: quotations.length
    },
    quotation_items: {
      name: 'quotation_items',
      category: 'sales',
      description: 'Line item breakdown for quotations with automatic total_price calculation.',
      primaryKey: 'id (UUID)',
      foreignKeys: [{ column: 'quotation_id', references: 'quotations(id)', onDelete: 'CASCADE' }],
      columnsCount: 7,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique quote item identifier' },
        { name: 'quotation_id', type: 'UUID', isNullable: false, isForeign: true, references: 'quotations(id)', description: 'Parent quotation (CASCADE)' },
        { name: 'description', type: 'TEXT', isNullable: false, description: 'Scope item / module description' },
        { name: 'quantity', type: 'NUMERIC(10,2)', isNullable: false, defaultValue: '1', description: 'Units / sprint counts' },
        { name: 'unit_price', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Unit cost' },
        { name: 'total_price', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: 'GENERATED ALWAYS AS (quantity * unit_price) STORED', description: 'Computed total (quantity × unit_price)' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Creation timestamp' }
      ],
      sampleCount: quotations.reduce((acc, q) => acc + q.items.length, 0)
    },
    invoices: {
      name: 'invoices',
      category: 'sales',
      description: 'Authoritative GST Tax Invoices enforced by database triggers and immutable calculation RPC.',
      primaryKey: 'id (UUID)',
      foreignKeys: [
        { column: 'client_id', references: 'clients(id)', onDelete: 'RESTRICT' },
        { column: 'quote_id', references: 'quotations(id)', onDelete: 'SET NULL' },
        { column: 'seller_state_code', references: 'state_ut_master(code)', onDelete: 'RESTRICT' },
        { column: 'buyer_state_code', references: 'state_ut_master(code)', onDelete: 'RESTRICT' },
        { column: 'place_of_supply', references: 'state_ut_master(code)', onDelete: 'RESTRICT' },
        { column: 'deleted_by', references: 'profiles(id)', onDelete: 'SET NULL' }
      ],
      columnsCount: 30,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique identifier for the invoice' },
        { name: 'invoice_number', type: 'TEXT', isNullable: false, description: 'Sequential authoritative invoice number (e.g. INV-2026-001)' },
        { name: 'client_id', type: 'UUID', isNullable: false, isForeign: true, references: 'clients(id)', description: 'Customer reference' },
        { name: 'status', type: 'TEXT', isNullable: false, defaultValue: "'draft'", description: 'draft, issued, partially_paid, paid, overdue' },
        { name: 'issue_date', type: 'DATE', isNullable: false, defaultValue: 'CURRENT_DATE', description: 'Tax invoice generation date' },
        { name: 'due_date', type: 'DATE', isNullable: false, defaultValue: "CURRENT_DATE + INTERVAL '15 days'", description: 'Payment maturity deadline' },
        
        { name: 'subtotal', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Gross sum of all line item amounts' },
        { name: 'discount', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Total discount deducted from subtotal' },
        { name: 'taxable_amount', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Authoritative tax base (subtotal - discount)' },
        
        { name: 'gst_applicable', type: 'BOOLEAN', isNullable: false, defaultValue: 'true', description: 'Whether GST applies to this supply' },
        { name: 'tax_rate', type: 'NUMERIC(5,2)', isNullable: false, defaultValue: '18.00', description: 'Applicable GST percentage (typically 18%)' },
        
        { name: 'seller_gstin', type: 'VARCHAR(15)', isNullable: false, defaultValue: "'21AAACF9876B1Z5'", description: 'Agency Odisha GSTIN' },
        { name: 'seller_state_code', type: 'VARCHAR(2)', isNullable: false, isForeign: true, references: 'state_ut_master(code)', defaultValue: "'21'", description: 'Odisha State Code (21)' },
        
        { name: 'buyer_gstin', type: 'VARCHAR(15)', isNullable: true, description: 'Client GSTIN if registered B2B' },
        { name: 'buyer_state_code', type: 'VARCHAR(2)', isNullable: false, isForeign: true, references: 'state_ut_master(code)', description: 'Buyer State Code' },
        { name: 'place_of_supply', type: 'VARCHAR(2)', isNullable: false, isForeign: true, references: 'state_ut_master(code)', description: 'Place of Supply state code determining tax jurisdiction' },
        
        { name: 'cgst_amount', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Central GST (9% intra-state)' },
        { name: 'sgst_amount', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'State GST (9% intra-state in state/UT with legislature)' },
        { name: 'utgst_amount', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Union Territory GST (9% in UT without legislature)' },
        { name: 'igst_amount', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Integrated GST (18% inter-state)' },
        { name: 'tax_amount', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Sum of all levied taxes' },
        
        { name: 'grand_total', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Final invoice payable amount (taxable_amount + tax_amount)' },
        { name: 'paid_amount', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Sum of confirmed receipts linked to this invoice' },
        
        { name: 'notes', type: 'TEXT', isNullable: true, description: 'Public memo / special billing terms' },
        
        { name: 'is_deleted', type: 'BOOLEAN', isNullable: false, defaultValue: 'false', description: 'Soft delete flag' },
        { name: 'deleted_at', type: 'TIMESTAMPTZ', isNullable: true, description: 'Timestamp when soft-deleted' },
        { name: 'deleted_by', type: 'UUID', isNullable: true, isForeign: true, references: 'profiles(id)', description: 'User profile that executed soft delete' },
        
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Row creation timestamp' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Auto-updated on row mutation' }
      ],
      sampleCount: invoices.length
    },
    invoice_items: {
      name: 'invoice_items',
      category: 'sales',
      description: 'Line item records for invoices with automatic total_price calculation (quantity * unit_price).',
      primaryKey: 'id (UUID)',
      foreignKeys: [{ column: 'invoice_id', references: 'invoices(id)', onDelete: 'CASCADE' }],
      columnsCount: 8,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique line item identifier' },
        { name: 'invoice_id', type: 'UUID', isNullable: false, isForeign: true, references: 'invoices(id)', description: 'Parent invoice reference (CASCADE)' },
        { name: 'description', type: 'TEXT', isNullable: false, description: 'Line item description of service/deliverable' },
        { name: 'quantity', type: 'NUMERIC(10,2)', isNullable: false, defaultValue: '1', description: 'Units / Hours / Sprints delivered' },
        { name: 'unit_price', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: '0.00', description: 'Unit cost per quantity' },
        { name: 'total_price', type: 'NUMERIC(12,2)', isNullable: false, defaultValue: 'GENERATED ALWAYS AS (quantity * unit_price) STORED', description: 'Auto-calculated price (quantity × unit_price)' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Record creation timestamp' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Record modification timestamp' }
      ],
      sampleCount: invoices.reduce((acc, inv) => acc + inv.items.length, 0)
    },
    payments: {
      name: 'payments',
      category: 'sales',
      description: 'Recorded financial settlements (Cash, Bank Transfer, UPI, Cheque, Other) linked to invoices with balance reconciliation.',
      primaryKey: 'id (UUID)',
      foreignKeys: [
        { column: 'invoice_id', references: 'invoices(id)', onDelete: 'RESTRICT' },
        { column: 'created_by', references: 'profiles(id)', onDelete: 'SET NULL' }
      ],
      columnsCount: 10,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique payment settlement identifier' },
        { name: 'invoice_id', type: 'UUID', isNullable: false, isForeign: true, references: 'invoices(id)', description: 'Associated invoice reference (RESTRICT on delete)' },
        { name: 'payment_date', type: 'DATE', isNullable: false, defaultValue: 'CURRENT_DATE', description: 'Settlement transaction date' },
        { name: 'amount', type: 'NUMERIC(12,2)', isNullable: false, description: 'Amount received in INR' },
        { name: 'payment_method', type: 'TEXT', isNullable: false, description: 'Method: Cash, Bank Transfer, UPI, Cheque, Other' },
        { name: 'reference_number', type: 'TEXT', isNullable: false, description: 'Bank UTR, UPI Ref ID, Cheque No, or Cash Voucher No' },
        { name: 'notes', type: 'TEXT', isNullable: true, description: 'Payment remarks / settlement notes' },
        { name: 'created_by', type: 'UUID', isNullable: true, isForeign: true, references: 'profiles(id)', description: 'User profile who entered this payment' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Payment record entry timestamp' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Payment record update timestamp' }
      ],
      sampleCount: payments.length
    },
    services: {
      name: 'services',
      category: 'content',
      description: 'Agency offerings catalog with slugs, descriptions, icons, and display ordering.',
      primaryKey: 'id (UUID)',
      columnsCount: 10,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique service identifier' },
        { name: 'title', type: 'TEXT', isNullable: false, description: 'Service headline (e.g. Web Applications)' },
        { name: 'slug', type: 'TEXT', isNullable: false, description: 'URL-friendly slug (e.g. web-development)' },
        { name: 'short_description', type: 'TEXT', isNullable: false, description: 'Brief summary for cards and search' },
        { name: 'description', type: 'TEXT', isNullable: false, description: 'Comprehensive service overview' },
        { name: 'icon', type: 'TEXT', isNullable: true, defaultValue: "'Code'", description: 'Lucide icon identifier' },
        { name: 'image_url', type: 'TEXT', isNullable: true, description: 'Service showcase banner URL' },
        { name: 'is_active', type: 'BOOLEAN', isNullable: false, defaultValue: 'true', description: 'Visibility toggle' },
        { name: 'sort_order', type: 'INTEGER', isNullable: false, defaultValue: '1', description: 'Display priority rank' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Creation timestamp' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Modification timestamp' }
      ],
      sampleCount: services.length
    },
    technologies: {
      name: 'technologies',
      category: 'content',
      description: 'Tech stack matrix across Frontend, Backend, Databases, and DevOps.',
      primaryKey: 'id (UUID)',
      columnsCount: 8,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique technology identifier' },
        { name: 'name', type: 'TEXT', isNullable: false, description: 'Tech name (e.g. React, PostgreSQL, Docker)' },
        { name: 'category', type: 'TEXT', isNullable: false, description: 'Frontend & UI, Backend & APIs, Databases & Storage, Cloud, DevOps & Tools' },
        { name: 'logo_url', type: 'TEXT', isNullable: true, description: 'Icon / logo URL' },
        { name: 'is_active', type: 'BOOLEAN', isNullable: false, defaultValue: 'true', description: 'Active display flag' },
        { name: 'sort_order', type: 'INTEGER', isNullable: false, defaultValue: '1', description: 'Ordering position' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Creation timestamp' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Update timestamp' }
      ],
      sampleCount: technologies.length
    },
    projects: {
      name: 'projects',
      category: 'content',
      description: 'Client portfolio and internally managed project sprint delivery trackers.',
      primaryKey: 'id (UUID)',
      columnsCount: 13,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique project identifier' },
        { name: 'title', type: 'TEXT', isNullable: false, description: 'Project title' },
        { name: 'slug', type: 'TEXT', isNullable: false, description: 'URL slug' },
        { name: 'description', type: 'TEXT', isNullable: false, description: 'Detailed case study / scope' },
        { name: 'client_name', type: 'TEXT', isNullable: false, description: 'Client organization name' },
        { name: 'image_url', type: 'TEXT', isNullable: true, description: 'Project cover banner image' },
        { name: 'project_url', type: 'TEXT', isNullable: true, description: 'Live web application or repo URL' },
        { name: 'technologies', type: 'JSONB', isNullable: false, defaultValue: "'[]'::jsonb", description: 'Array of technologies utilized' },
        { name: 'is_featured', type: 'BOOLEAN', isNullable: false, defaultValue: 'false', description: 'Featured on home page hero' },
        { name: 'is_active', type: 'BOOLEAN', isNullable: false, defaultValue: 'true', description: 'Published status' },
        { name: 'sort_order', type: 'INTEGER', isNullable: false, defaultValue: '1', description: 'Display priority rank' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Creation timestamp' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Update timestamp' }
      ],
      sampleCount: managedProjects.length
    },
    testimonials: {
      name: 'testimonials',
      category: 'content',
      description: 'Client reviews, ratings, company credentials, and approved public quotes.',
      primaryKey: 'id (UUID)',
      columnsCount: 10,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique testimonial identifier' },
        { name: 'client_name', type: 'TEXT', isNullable: false, description: 'Client contact / reviewer' },
        { name: 'company_name', type: 'TEXT', isNullable: false, description: 'Client company or brand' },
        { name: 'content', type: 'TEXT', isNullable: false, description: 'Review quote text' },
        { name: 'rating', type: 'INTEGER', isNullable: false, defaultValue: '5', description: 'Star rating (1 to 5)' },
        { name: 'image_url', type: 'TEXT', isNullable: true, description: 'Client avatar / company logo' },
        { name: 'is_featured', type: 'BOOLEAN', isNullable: false, defaultValue: 'false', description: 'Highlight on landing page' },
        { name: 'is_active', type: 'BOOLEAN', isNullable: false, defaultValue: 'true', description: 'Approved and published' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Review date' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Last edited date' }
      ],
      sampleCount: testimonials.length
    },
    faqs: {
      name: 'faqs',
      category: 'content',
      description: 'Frequently Asked Questions structured with question, answer, and sort order.',
      primaryKey: 'id (UUID)',
      columnsCount: 7,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique FAQ identifier' },
        { name: 'question', type: 'TEXT', isNullable: false, description: 'Question title' },
        { name: 'answer', type: 'TEXT', isNullable: false, description: 'Markdown or plain text response' },
        { name: 'is_active', type: 'BOOLEAN', isNullable: false, defaultValue: 'true', description: 'Published status' },
        { name: 'sort_order', type: 'INTEGER', isNullable: false, defaultValue: '1', description: 'Ordering position' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Creation timestamp' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Update timestamp' }
      ],
      sampleCount: faqs.length
    },
    website_settings: {
      name: 'website_settings',
      category: 'content',
      description: 'Agency configuration, contact phone/email, office address, and social URLs.',
      primaryKey: 'id (UUID)',
      columnsCount: 12,
      sampleCount: 1
    },
    seller_profile: {
      name: 'seller_profile',
      category: 'seller',
      description: 'Authoritative company identity, GSTIN, jurisdiction, bank account, and signature master.',
      primaryKey: 'id (UUID)',
      foreignKeys: [{ column: 'state_code', references: 'state_ut_master(code)', onDelete: 'RESTRICT' }],
      columnsCount: 18,
      columns: [
        { name: 'id', type: 'UUID', isNullable: false, isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique seller record identifier' },
        { name: 'company_name', type: 'TEXT', isNullable: false, defaultValue: "'Fusion Forge Creation'", description: 'Registered business brand name' },
        { name: 'tagline', type: 'TEXT', isNullable: true, defaultValue: "'Where Ideas Fuse With Technology'", description: 'Brand slogan / mission statement' },
        { name: 'email', type: 'TEXT', isNullable: false, defaultValue: "'contact@fusionforgecreation.com'", description: 'Corporate communication email' },
        { name: 'phone', type: 'TEXT', isNullable: false, defaultValue: "'+91 [Enter Business Phone]'", description: 'Official telephone / WhatsApp number' },
        { name: 'address', type: 'TEXT', isNullable: false, defaultValue: "'[Enter Business Address, Bhubaneswar, Odisha]'", description: 'Full business address' },
        { name: 'gstin', type: 'VARCHAR(15)', isNullable: false, defaultValue: "'21XXXXXXXXXX1ZX'", description: '15-digit Goods & Services Tax Number' },
        { name: 'state_code', type: 'VARCHAR(2)', isNullable: false, isForeign: true, references: 'state_ut_master(code)', defaultValue: "'21'", description: 'GST State code (e.g. 21 for Odisha)' },
        { name: 'jurisdiction', type: 'TEXT', isNullable: false, defaultValue: "'Bhubaneswar, Odisha'", description: 'Legal tax and arbitration jurisdiction' },
        { name: 'logo_url', type: 'TEXT', isNullable: true, defaultValue: "'/logo.png'", description: 'High-res brand logo asset' },
        { name: 'signature_url', type: 'TEXT', isNullable: true, defaultValue: "'/signatures/authorized_signatory.png'", description: 'Authorized signatory digital image' },
        { name: 'bank_name', type: 'TEXT', isNullable: false, defaultValue: "'[Enter Bank Name - e.g. HDFC Bank Ltd.]'", description: 'Settlement bank institution' },
        { name: 'account_name', type: 'TEXT', isNullable: false, defaultValue: "'Fusion Forge Creation'", description: 'Beneficiary account holder title' },
        { name: 'account_number', type: 'TEXT', isNullable: false, defaultValue: "'[Enter Account Number]'", description: 'Bank account number' },
        { name: 'ifsc_code', type: 'TEXT', isNullable: false, defaultValue: "'[Enter IFSC Code - e.g. HDFC000XXXX]'", description: '11-character Indian Financial System Code' },
        { name: 'branch_name', type: 'TEXT', isNullable: false, defaultValue: "'[Enter Branch Name - e.g. Patia Branch]'", description: 'Bank branch name / location' },
        { name: 'terms_conditions', type: 'TEXT', isNullable: false, description: 'Default commercial & quotation terms' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Record initialization date' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'NOW()', description: 'Last updated timestamp' }
      ],
      sampleCount: 1
    },
    state_ut_master: {
      name: 'state_ut_master',
      category: 'geography',
      description: '39 Indian States & Union Territories with UT legislature flags, selectable flags, and legacy codes.',
      primaryKey: 'code (VARCHAR(2))',
      columnsCount: 8,
      sampleCount: 39
    }
  };

  const getCategoryColor = (cat: TableNode['category']) => {
    switch (cat) {
      case 'auth': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'audit': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'crm': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'sales': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'content': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'seller': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'geography': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.user_email.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.table_name.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.record_id.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesAction = auditActionFilter === 'ALL' || log.action === auditActionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Database Architecture & Table Relationships</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete PostgreSQL Entity-Relationship model, Foreign Key constraints, Row Level Security, and Authoritative GST Triggers.
          </p>
        </div>

        {/* Action tabs */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('relationships')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'relationships' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>ER Relationships</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'schema' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Table Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'audit_logs' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('ddl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'ddl' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Supabase DDL</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RELATIONSHIPS VISUALIZER */}
      {activeTab === 'relationships' && (
        <div className="space-y-6">
          {/* Quick Summary Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {[
              { label: 'Auth & Roles', count: '1 Table', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
              { label: 'Audit Logs', count: '1 Table', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10' },
              { label: 'CRM Master', count: '1 Table', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
              { label: 'Sales Flow', count: '5 Tables', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
              { label: 'Content Hub', count: '6 Tables', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' },
              { label: 'Seller Master', count: '1 Table', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' },
              { label: 'Geography', count: '39 States', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10' }
            ].map((p, i) => (
              <div key={i} className={`p-2.5 rounded-xl border ${p.color} text-center`}>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">{p.label}</div>
                <div className="text-xs font-extrabold mt-0.5">{p.count}</div>
              </div>
            ))}
          </div>

          {/* Core Visual ER Diagrams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cluster 1: Auth & Audit Hierarchy */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>1. Authentication & Immutable Audit</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">1-to-Many (1:N)</span>
              </div>

              <div className="bg-[#070b14] p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-300">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span className="font-bold">profiles</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">Primary Key: id (UUID)</span>
                </div>

                <div className="flex items-center pl-6 text-slate-500 text-xs">
                  <span className="mr-2">│</span>
                  <span className="text-[11px] text-slate-400 font-sans italic">triggers audit event on user actions</span>
                </div>

                <div className="flex items-center pl-6 text-slate-500 text-xs">
                  <span className="mr-2">└────</span>
                  <div className="flex-1 flex items-center justify-between p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-rose-400" />
                      <span className="font-bold">audit_logs</span>
                    </div>
                    <span className="text-[10px] text-rose-400/80 font-mono">FK: user_id ➔ profiles.id</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                <strong className="text-slate-200">Enforcement:</strong> Every profile action (`CREATE`, `UPDATE`, `DELETE`, `PAYMENT_RECORD`, `CALCULATE_GST`) records immutable JSON payload with user identity, timestamp, and client IP.
              </div>
            </div>

            {/* Cluster 2: Geography & Seller Tax Master */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <Globe2 className="w-4 h-4" />
                  <span>2. Geography & Seller Tax Profile</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Authoritative Master</span>
              </div>

              <div className="bg-[#070b14] p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/30 text-indigo-300">
                  <div className="flex items-center space-x-2">
                    <Globe2 className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold">state_ut_master</span>
                  </div>
                  <span className="text-[10px] text-indigo-400/80">PK: code (VARCHAR 2)</span>
                </div>

                <div className="flex items-center pl-6 text-slate-500 text-xs">
                  <span className="mr-2">│</span>
                  <span className="text-[11px] text-slate-400 font-sans italic">referenced by clients, quotations, invoices & seller</span>
                </div>

                <div className="flex items-center pl-6 text-slate-500 text-xs">
                  <span className="mr-2">└────</span>
                  <div className="flex-1 flex items-center justify-between p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-cyan-300">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold">seller_profile</span>
                    </div>
                    <span className="text-[10px] text-cyan-400/80 font-mono">FK: state_code ➔ state_ut_master</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                <strong className="text-slate-200">GST Jurisdiction:</strong> `state_ut_master` determines whether intra-state transactions levy CGST + SGST (States/UTs with Legislature) or CGST + UTGST (UTs without Legislature).
              </div>
            </div>

            {/* Cluster 3: Full Commercial CRM & Sales Flow (Clients -> Quotations -> Invoices -> Payments) */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CreditCard className="w-4 h-4" />
                  <span>3. CRM & Commercial Accounting Cascade</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Strict Relational Constraints</span>
              </div>

              <div className="bg-[#070b14] p-5 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 space-y-3">
                {/* Root: Clients */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/30 border border-blue-500/40 text-blue-300 shadow-md">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-sm">clients</span>
                  </div>
                  <span className="text-[11px] text-blue-400 font-mono">Primary Key: id (UUID) • FK: state_code ➔ state_ut_master</span>
                </div>

                <div className="pl-6 text-slate-600 text-sm">│</div>

                {/* Branch 1: Quotations -> Quotation Items */}
                <div className="pl-6 space-y-2">
                  <div className="flex items-center text-slate-500">
                    <span className="mr-3 font-mono">├────</span>
                    <div className="flex-1 flex items-center justify-between p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold">quotations</span>
                      </div>
                      <span className="text-[10px] text-emerald-400/80 font-mono">FK: client_id ➔ clients.id (ON DELETE CASCADE)</span>
                    </div>
                  </div>

                  <div className="flex items-center pl-10 text-slate-600">
                    <span className="mr-3 font-mono">└────</span>
                    <div className="flex-1 flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      <span className="font-bold text-[11px]">quotation_items</span>
                      <span className="text-[10px] text-slate-400 font-mono">FK: quotation_id ➔ quotations.id (ON DELETE CASCADE)</span>
                    </div>
                  </div>
                </div>

                <div className="pl-6 text-slate-600 text-sm">│</div>

                {/* Branch 2: Invoices -> Invoice Items & Payments */}
                <div className="pl-6 space-y-2">
                  <div className="flex items-center text-slate-500">
                    <span className="mr-3 font-mono">└────</span>
                    <div className="flex-1 flex items-center justify-between p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
                      <div className="flex items-center space-x-2">
                        <Receipt className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold">invoices</span>
                      </div>
                      <span className="text-[10px] text-emerald-400/80 font-mono">FK: client_id ➔ clients.id (ON DELETE RESTRICT) • FK: quote_id ➔ quotations.id</span>
                    </div>
                  </div>

                  <div className="pl-10 space-y-2">
                    <div className="flex items-center text-slate-600">
                      <span className="mr-3 font-mono">├────</span>
                      <div className="flex-1 flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        <span className="font-bold text-[11px]">invoice_items</span>
                        <span className="text-[10px] text-slate-400 font-mono">FK: invoice_id ➔ invoices.id (ON DELETE CASCADE)</span>
                      </div>
                    </div>

                    <div className="flex items-center text-slate-600">
                      <span className="mr-3 font-mono">└────</span>
                      <div className="flex-1 flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-cyan-300">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="font-bold text-[11px]">payments</span>
                        </div>
                        <span className="text-[10px] text-cyan-400/80 font-mono">FK: invoice_id ➔ invoices.id (ON DELETE RESTRICT)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cluster 4: Content Master Tables */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>4. Content Master Layer (Independent & Client-Linked)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">6 Specialized Master Tables</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: 'services', desc: 'Agency capabilities, SAC 998314, deliverables, base pricing', count: services.length, icon: Layers },
                  { name: 'technologies', desc: 'Proficiency matrix, frontend, backend, databases, cloud', count: technologies.length, icon: Code2 },
                  { name: 'projects', desc: 'Portfolio showcase & managed sprints (FK: client_id)', count: managedProjects.length, icon: Sparkles },
                  { name: 'testimonials', desc: 'Verified client reviews, ratings, corporate quotes', count: testimonials.length, icon: Users },
                  { name: 'faqs', desc: 'Published customer questions, answers, category order', count: faqs.length, icon: HelpCircle },
                  { name: 'website_settings', desc: 'Global branding, phone, email, addresses, socials', count: 1, icon: Globe2 }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-[#070b14] border border-slate-800/80 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-purple-400" />
                          <span className="font-mono text-xs font-bold text-purple-300">{item.name}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono">
                          {item.count} items
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TABLE INSPECTOR */}
      {activeTab === 'schema' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table List Sidebar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
              Select PostgreSQL Table
            </div>
            {Object.entries(tablesCatalog).map(([tableName, table]) => {
              const active = selectedTable === tableName;
              return (
                <button
                  key={tableName}
                  onClick={() => setSelectedTable(tableName)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    active 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">{tableName}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${active ? 'bg-white/20 border-white/30 text-white' : getCategoryColor(table.category)}`}>
                    {table.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table Details */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
            {tablesCatalog[selectedTable] && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold font-mono text-white">public.{selectedTable}</h2>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getCategoryColor(tablesCatalog[selectedTable].category)}`}>
                        {tablesCatalog[selectedTable].category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{tablesCatalog[selectedTable].description}</p>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-400">
                    <div>Primary Key: <span className="text-cyan-400 font-bold">{tablesCatalog[selectedTable].primaryKey}</span></div>
                    <div>Live Records: <span className="text-emerald-400 font-bold">{tablesCatalog[selectedTable].sampleCount ?? 0}</span></div>
                  </div>
                </div>

                {/* Explicit Columns Definition Breakdown */}
                {tablesCatalog[selectedTable].columns && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-300">Table Schema ({tablesCatalog[selectedTable].columns?.length} Columns):</div>
                      <span className="text-[10px] text-slate-400 font-mono">PostgreSQL Exact Data Types</span>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-[#070b14] overflow-hidden">
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase border-b border-slate-800 sticky top-0">
                            <tr>
                              <th className="p-2.5">Column Name</th>
                              <th className="p-2.5">Data Type</th>
                              <th className="p-2.5">Nullable</th>
                              <th className="p-2.5">Constraint / Reference</th>
                              <th className="p-2.5">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {tablesCatalog[selectedTable].columns?.map((col, cIdx) => (
                              <tr key={cIdx} className="hover:bg-slate-800/30">
                                <td className="p-2.5 text-white font-bold flex items-center gap-1.5">
                                  {col.isPrimary && <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">PK</span>}
                                  {col.isForeign && <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">FK</span>}
                                  <span>{col.name}</span>
                                </td>
                                <td className="p-2.5 text-cyan-400">{col.type}</td>
                                <td className="p-2.5">
                                  <span className={col.isNullable ? 'text-slate-400' : 'text-emerald-400 font-semibold'}>
                                    {col.isNullable ? 'YES' : 'NOT NULL'}
                                  </span>
                                </td>
                                <td className="p-2.5 text-slate-400 text-[11px]">
                                  {col.references ? (
                                    <span className="text-blue-300">➔ {col.references}</span>
                                  ) : col.defaultValue ? (
                                    <span className="text-slate-500">DEFAULT {col.defaultValue}</span>
                                  ) : (
                                    '—'
                                  )}
                                </td>
                                <td className="p-2.5 text-slate-300 font-sans text-[11px]">{col.description || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Foreign Keys List */}
                {tablesCatalog[selectedTable].foreignKeys && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300">Foreign Key Constraints:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tablesCatalog[selectedTable].foreignKeys?.map((fk, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[#070b14] border border-slate-800 text-xs font-mono">
                          <div className="text-slate-400 text-[10px]">COLUMN: <span className="text-blue-400 font-bold">{fk.column}</span></div>
                          <div className="text-slate-300 text-[11px] mt-0.5">REFERENCES: <span className="text-emerald-400">{fk.references}</span></div>
                          {fk.onDelete && (
                            <div className="text-rose-400 text-[10px] mt-0.5">ON DELETE: {fk.onDelete}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* RLS Policy Explanation */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
                    <Lock className="w-4 h-4" />
                    <span>Row Level Security (RLS) Rules Applied</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedTable === 'profiles' && 'Super Admins have full access. Users can view and update their own profile. Public users cannot access profiles.'}
                    {selectedTable === 'clients' && 'Super Admin, Admin, and Accountants manage clients. Staff can view assigned clients. Clients can only view their own linked record. Public access is strictly forbidden.'}
                    {selectedTable === 'enquiries' && 'Public users can INSERT new project enquiries. Super Admin, Admin, Staff, and Project Managers can SELECT and manage them.'}
                    {selectedTable === 'quotations' || selectedTable === 'quotation_items' ? 'Super Admin, Admin, Project Managers, and Accountants manage quotations. Clients can view dispatched quotes. Public access is blocked.' : ''}
                    {selectedTable === 'invoices' || selectedTable === 'invoice_items' ? 'Super Admin, Admin, Accountants, and Staff can view, download PDF, and print. ONLY super_admin can MODIFY (UPDATE) or SOFT DELETE (UPDATE is_deleted / DELETE). Super Admin and Accountants can create invoices. Public access is strictly forbidden.' : ''}
                    {selectedTable === 'payments' && 'Super Admin, Admin, and Accountants manage payment transactions. Clients can view their own payment receipts. Public access blocked.'}
                    {selectedTable === 'audit_logs' && 'Immutable append-only for database triggers and system mutations. Read access restricted exclusively to Super Admin and Admin.'}
                    {selectedTable === 'state_ut_master' && 'Public readable for GST state codes, Union Territory classifications, and place of supply resolution.'}
                    {selectedTable === 'seller_profile' && 'Public readable for business contact, GSTIN, and seller identity. Master record management restricted strictly to Super Admin.'}
                    {['services', 'technologies', 'projects', 'testimonials', 'faqs', 'website_settings'].includes(selectedTable) && 'Public read access for active/featured items. Super Admin, Admin, and Editors manage content.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL LOGS */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit trail by user, table, action, or record ID..."
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={auditActionFilter}
                onChange={e => setAuditActionFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Actions</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="SOFT_DELETE">SOFT_DELETE</option>
                <option value="RESTORE">RESTORE</option>
                <option value="PAYMENT_RECORD">PAYMENT_RECORD</option>
                <option value="CALCULATE_GST">CALCULATE_GST</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="rounded-2xl border border-slate-800 bg-[#070b14] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Table</th>
                  <th className="p-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 text-slate-400 whitespace-nowrap text-[11px]">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        <div className="text-white font-bold">{log.user_email}</div>
                        <div className="text-[10px] text-amber-400 uppercase">{log.user_role}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.action === 'CREATE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          log.action === 'DELETE' || log.action === 'SOFT_DELETE' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          log.action === 'PAYMENT_RECORD' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 text-cyan-400 font-bold text-[11px]">
                        public.{log.table_name}
                      </td>
                      <td className="p-3.5 text-slate-300 font-sans text-xs max-w-md">
                        {log.details}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-sans text-xs">
                      No audit events matched your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SUPABASE DDL & TRIGGERS */}
      {activeTab === 'ddl' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Full Supabase PostgreSQL DDL Script</h3>
                <p className="text-xs text-slate-400">Includes all 16 core tables, foreign keys, cascade triggers, RLS policies & authoritative GST engine.</p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all shrink-0 shadow-lg shadow-blue-600/30"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'SQL Copied to Clipboard!' : 'Copy Supabase SQL'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070b14] overflow-hidden">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>supabase_complete_schema.sql</span>
              </div>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
