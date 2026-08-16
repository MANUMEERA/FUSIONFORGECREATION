import { PermissionDefinition, RoleDefinition } from '../types';

/**
 * Authoritative Master Permissions Catalogue.
 * All modules, operational actions, and security operations in the application.
 */
export const SYSTEM_PERMISSIONS: PermissionDefinition[] = [
  // Core Operational Modules
  {
    code: 'module.dashboard',
    name: 'Dashboard Access',
    category: 'Core',
    description: 'View executive metrics, key performance indicators, revenue trajectory, and operational quick metrics.'
  },
  {
    code: 'module.enquiries',
    name: 'Lead Enquiries',
    category: 'Core',
    description: 'View, track, update status, and convert incoming client lead enquiries.'
  },
  {
    code: 'module.clients',
    name: 'Client Accounts',
    category: 'Core',
    description: 'Access client directories, GSTIN records, billing profiles, and client engagement histories.'
  },
  {
    code: 'module.projects',
    name: 'Projects & Engagements',
    category: 'Core',
    description: 'Manage development projects, sprint stages, staging URLs, deliverables, and milestone progress.'
  },

  // Financials & Accounting
  {
    code: 'module.quotations',
    name: 'Quotations & Estimates',
    category: 'Financials',
    description: 'Create, review, approve, and send commercial project scopes with GST calculations.'
  },
  {
    code: 'module.invoices',
    name: 'Tax Invoices',
    category: 'Financials',
    description: 'Issue, view, manage, and download GST tax invoices and line-item schedules.'
  },
  {
    code: 'module.payments',
    name: 'Payment Receipts',
    category: 'Financials',
    description: 'Record received payments, track TDS/bank charges, and generate payment acknowledgment receipts.'
  },
  {
    code: 'module.purchases',
    name: 'Purchases & Vendors',
    category: 'Financials',
    description: 'Track vendor purchase orders, billings, and supplier trade relations.'
  },
  {
    code: 'module.expenses',
    name: 'Business Expenses',
    category: 'Financials',
    description: 'Record operating expenses, categorize tax deductions, and track input tax credit (ITC).'
  },
  {
    code: 'module.accounting',
    name: 'Accounting & Ledgers',
    category: 'Financials',
    description: 'Access dual-entry accounting ledgers, cash flow statements, and balance reports.'
  },
  {
    code: 'module.gst_reports',
    name: 'GST Reports & Filings',
    category: 'Financials',
    description: 'View GSTR-1, GSTR-3B summaries, HSN/SAC breakdowns, and tax liability reports.'
  },

  // Content & CMS
  {
    code: 'module.services',
    name: 'Services Catalogue',
    category: 'Content',
    description: 'Manage agency service offerings, pricing presets, SAC codes, and marketing descriptions.'
  },
  {
    code: 'module.technologies',
    name: 'Technology Stack',
    category: 'Content',
    description: 'Manage technology badges, categories, and framework showcases.'
  },
  {
    code: 'module.testimonials',
    name: 'Client Testimonials',
    category: 'Content',
    description: 'Publish, edit, and curate client reviews and portfolio ratings.'
  },
  {
    code: 'module.faqs',
    name: 'FAQ Knowledgebase',
    category: 'Content',
    description: 'Manage public FAQs, categorized answers, and helpdesk guidance.'
  },
  {
    code: 'module.chatbot',
    name: 'AI Chatbot Studio',
    category: 'Content',
    description: 'Configure conversational AI training queries, greetings, and knowledge responses.'
  },

  // System & Operations
  {
    code: 'module.settings',
    name: 'Agency Settings',
    category: 'System',
    description: 'Manage master seller profile, legal trade details, GSTIN, bank details, and invoice prefixes.'
  },
  {
    code: 'module.notifications',
    name: 'System Notifications',
    category: 'System',
    description: 'View real-time notifications, audio buzzer triggers, and system dispatch alerts.'
  },
  {
    code: 'module.visitor_monitoring',
    name: 'Visitor Monitoring',
    category: 'System',
    description: 'Inspect live website visitor traffic, page paths, analytics sessions, and IP logs.'
  },
  {
    code: 'module.documents',
    name: 'Document Management',
    category: 'System',
    description: 'Manage legal contracts, NDAs, scope blueprints, and client-shared files.'
  },
  {
    code: 'module.database',
    name: 'Supabase Architecture',
    category: 'System',
    description: 'Inspect live PostgreSQL table statuses, RLS policies, and database connection telemetry.'
  },

  // Security & Administrative Control
  {
    code: 'module.users',
    name: 'Users & Roles (RBAC)',
    category: 'Security',
    description: 'Manage user profiles, define roles, configure permissions matrix, and toggle account activation.'
  },
  {
    code: 'action.delete',
    name: 'Delete Records Permission',
    category: 'Security',
    description: 'Delete clients, invoices, quotations, projects, user profiles, or system records (Super Admin only).'
  },
  {
    code: 'action.export_print',
    name: 'Export & Print Permission',
    category: 'Security',
    description: 'Export PDF invoices, print receipts, download CSV reports, and extract client data.'
  },
  {
    code: 'action.email',
    name: 'Email Dispatch Permission',
    category: 'Security',
    description: 'Dispatch invoices, quotations, and official notices to clients via email.'
  }
];

/**
 * Standard System Roles with default pre-configured permissions.
 */
export const INITIAL_SYSTEM_ROLES: RoleDefinition[] = [
  {
    id: 'role_super_admin',
    name: 'Super Admin',
    code: 'super_admin',
    description: 'Root system master with unrestricted authority over all modules, permissions, role editing, and destructive deletions.',
    isSystem: true,
    permissions: SYSTEM_PERMISSIONS.map(p => p.code),
    userCount: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'role_admin',
    name: 'Administrator',
    code: 'admin',
    description: 'Senior management with operational write authority across projects, clients, finances, content, and agency settings.',
    isSystem: true,
    permissions: [
      'module.dashboard',
      'module.enquiries',
      'module.clients',
      'module.projects',
      'module.quotations',
      'module.invoices',
      'module.payments',
      'module.purchases',
      'module.expenses',
      'module.accounting',
      'module.gst_reports',
      'module.services',
      'module.technologies',
      'module.testimonials',
      'module.faqs',
      'module.chatbot',
      'module.settings',
      'module.notifications',
      'module.visitor_monitoring',
      'module.documents',
      'module.database',
      'action.export_print',
      'action.email'
    ],
    userCount: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'role_accountant',
    name: 'Accountant',
    code: 'accountant',
    description: 'Financial auditor with specialized access to tax invoices, payment receipts, expenses, GST ledgers, and export facilities.',
    isSystem: true,
    permissions: [
      'module.dashboard',
      'module.clients',
      'module.quotations',
      'module.invoices',
      'module.payments',
      'module.purchases',
      'module.expenses',
      'module.accounting',
      'module.gst_reports',
      'module.notifications',
      'module.database',
      'action.export_print'
    ],
    userCount: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'role_editor',
    name: 'Editor',
    code: 'editor',
    description: 'Content and project coordinator managing portfolio deliverables, services catalog, technologies, testimonials, and FAQs.',
    isSystem: true,
    permissions: [
      'module.dashboard',
      'module.enquiries',
      'module.projects',
      'module.services',
      'module.technologies',
      'module.testimonials',
      'module.faqs',
      'module.chatbot',
      'module.notifications',
      'module.database'
    ],
    userCount: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'role_project_manager',
    name: 'Project Manager',
    code: 'project_manager',
    description: 'Sprint delivery lead overseeing client communications, lead status progressions, milestones, and project scopes.',
    isSystem: true,
    permissions: [
      'module.dashboard',
      'module.enquiries',
      'module.clients',
      'module.quotations',
      'module.invoices',
      'module.projects',
      'module.technologies',
      'module.chatbot',
      'module.notifications',
      'module.database',
      'action.export_print',
      'action.email'
    ],
    userCount: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'role_staff',
    name: 'Staff',
    code: 'staff',
    description: 'Operational team member with read-focused access to active sprint tasks, support tickets, and knowledge bases.',
    isSystem: true,
    permissions: [
      'module.dashboard',
      'module.enquiries',
      'module.projects',
      'module.faqs',
      'module.chatbot',
      'module.notifications',
      'module.database'
    ],
    userCount: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

/**
 * Evaluates whether a given role has a specific permission code.
 * Super Admin ALWAYS evaluates to true for all permission codes.
 */
export function hasPermission(
  userRole: string,
  permissionCode: string,
  customRoles: RoleDefinition[] = INITIAL_SYSTEM_ROLES
): boolean {
  if (userRole === 'super_admin') {
    return true;
  }
  
  // Clients never have admin portal access
  if (userRole === 'client') {
    return false;
  }

  // Find matching role definition
  const roleDef = customRoles.find(r => r.code === userRole);
  if (!roleDef) {
    return false;
  }

  // Deletion is strictly Super Admin only
  if (permissionCode === 'action.delete') {
    return userRole === 'super_admin';
  }

  // Users & Roles management is strictly Super Admin only or explicitly granted
  if (permissionCode === 'module.users') {
    return userRole === 'super_admin' || roleDef.permissions.includes('module.users');
  }

  return roleDef.permissions.includes(permissionCode);
}

/**
 * Checks if the user is authorized to delete records.
 */
export function canDeleteRecord(userRole: string): boolean {
  return userRole === 'super_admin';
}

/**
 * Checks if the user is authorized to manage roles & permissions.
 */
export function canManageRolesAndPermissions(userRole: string): boolean {
  return userRole === 'super_admin';
}
