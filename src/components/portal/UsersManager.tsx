import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  X, 
  Mail, 
  Building2, 
  Key, 
  CheckCircle2, 
  UserCheck, 
  Shield, 
  Layers, 
  Lock, 
  Smartphone, 
  Check, 
  AlertTriangle, 
  History, 
  Info, 
  QrCode, 
  Copy, 
  RefreshCw, 
  Sparkles,
  UserPlus,
  UserCog,
  CheckSquare,
  Square,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole, RoleDefinition, PermissionDefinition } from '../../types';
import { useToast } from '../../context/ToastContext';
import { 
  generateTotpSecret, 
  getOtpauthUri, 
  generateQrCodeDataUrl, 
  generateRecoveryCodes, 
  formatSecretKey 
} from '../../utils/totp';

export const UsersManager: React.FC = () => {
  const { 
    users, 
    currentUser, 
    addUser, 
    updateUser, 
    deleteUser, 
    switchRole,
    roles,
    permissions,
    addRole,
    updateRole,
    deleteRole,
    auditLogs
  } = useApp();

  const { success, error: toastError, info } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'roles' | 'audit_log'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // User Profile Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userRole, setUserRole] = useState<string>('staff');
  const [company, setCompany] = useState('Fusion Forge Creation');
  const [isActive, setIsActive] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(true);

  // Quick Role Assignment Modal State
  const [assigningUser, setAssigningUser] = useState<UserProfile | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<string>('staff');

  // In-app Delete Confirmation Modals
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleDefinition | null>(null);

  // 2FA Management Modal State
  const [is2faModalOpen, setIs2faModalOpen] = useState(false);
  const [selected2faUser, setSelected2faUser] = useState<UserProfile | null>(null);
  const [twoFactorQr, setTwoFactorQr] = useState<string>('');
  const [twoFactorSecret, setTwoFactorSecret] = useState<string>('');
  const [twoFactorRecoveryCodes, setTwoFactorRecoveryCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedRecovery, setCopiedRecovery] = useState(false);

  // Role Editor Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const isSuperAdmin = currentUser.role === 'super_admin';

  // ─────────────────────────────────────────────────────────────
  // USER PROFILE HANDLERS
  // ─────────────────────────────────────────────────────────────
  const openCreateUserModal = () => {
    setEditingUserId(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setUserRole('staff');
    setCompany('Fusion Forge Creation');
    setIsActive(true);
    setMfaEnabled(true);
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user: UserProfile) => {
    setEditingUserId(user.id);
    setFullName(user.full_name || user.name || '');
    setEmail(user.email);
    setPhone(user.phone || '');
    setUserRole(user.role);
    setCompany(user.company || 'Fusion Forge Creation');
    setIsActive(user.is_active ?? true);
    setMfaEnabled(user.mfa_enabled ?? true);
    setIsUserModalOpen(true);
  };

  const openRoleAssignmentModal = (user: UserProfile) => {
    setAssigningUser(user);
    setSelectedNewRole(user.role);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      updateUser(editingUserId, {
        full_name: fullName,
        name: fullName,
        email,
        phone,
        role: userRole as any,
        company,
        is_active: isActive,
        mfa_enabled: mfaEnabled,
        updated_at: new Date().toISOString()
      });
      success('User Profile Updated', `Account for ${fullName} updated successfully.`);
    } else {
      const secret = generateTotpSecret(20);
      const recCodes = generateRecoveryCodes(8);

      addUser({
        full_name: fullName,
        name: fullName,
        email,
        phone,
        role: userRole as any,
        company,
        is_active: isActive,
        mfa_enabled: mfaEnabled,
        two_factor_secret: secret,
        two_factor_confirmed: true,
        two_factor_auth_type: 'google_authenticator',
        recovery_codes: recCodes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      success('User Profile Created', `New authenticated account created for ${fullName} with Google Authenticator 2FA.`);
    }
    setIsUserModalOpen(false);
  };

  const handleConfirmRoleAssignment = () => {
    if (!assigningUser) return;
    updateUser(assigningUser.id, {
      role: selectedNewRole as any,
      updated_at: new Date().toISOString()
    });
    const roleDef = roles.find(r => r.code === selectedNewRole);
    success('Role Assigned', `${assigningUser.full_name || assigningUser.name} has been assigned the role "${roleDef ? roleDef.name : selectedNewRole}".`);
    setAssigningUser(null);
  };

  const confirmDeleteUserAction = () => {
    if (!userToDelete) return;
    if (!isSuperAdmin) {
      toastError('Security Restriction', 'Only Super Admin can delete records.');
      setUserToDelete(null);
      return;
    }
    if (userToDelete.id === currentUser.id) {
      toastError('Action Blocked', 'You cannot delete your own active Super Admin session.');
      setUserToDelete(null);
      return;
    }
    deleteUser(userToDelete.id);
    success('User Deleted', `Account ${userToDelete.email} removed from system.`);
    setUserToDelete(null);
  };

  // ─────────────────────────────────────────────────────────────
  // 2FA / GOOGLE AUTHENTICATOR MODAL HANDLERS
  // ─────────────────────────────────────────────────────────────
  const open2faModal = async (user: UserProfile) => {
    setSelected2faUser(user);
    const secret = user.two_factor_secret || generateTotpSecret(20);
    const recCodes = user.recovery_codes && user.recovery_codes.length > 0 
      ? user.recovery_codes 
      : generateRecoveryCodes(8);

    setTwoFactorSecret(secret);
    setTwoFactorRecoveryCodes(recCodes);

    const uri = getOtpauthUri(secret, user.email, 'Fusion Forge Creation');
    const qrData = await generateQrCodeDataUrl(uri);
    setTwoFactorQr(qrData);

    setIs2faModalOpen(true);
  };

  const handleReset2faSecret = async () => {
    if (!selected2faUser) return;
    const newSecret = generateTotpSecret(20);
    const newRecCodes = generateRecoveryCodes(8);

    setTwoFactorSecret(newSecret);
    setTwoFactorRecoveryCodes(newRecCodes);

    const uri = getOtpauthUri(newSecret, selected2faUser.email, 'Fusion Forge Creation');
    const qrData = await generateQrCodeDataUrl(uri);
    setTwoFactorQr(qrData);

    updateUser(selected2faUser.id, {
      two_factor_secret: newSecret,
      two_factor_confirmed: true,
      two_factor_auth_type: 'google_authenticator',
      recovery_codes: newRecCodes
    });

    success('2FA Secret Reset', `New Google Authenticator secret generated for ${selected2faUser.full_name || selected2faUser.email}.`);
  };

  // ─────────────────────────────────────────────────────────────
  // ROLE & PERMISSIONS HANDLERS
  // ─────────────────────────────────────────────────────────────
  const openCreateRoleModal = () => {
    if (!isSuperAdmin) {
      toastError('Unauthorized', 'Role creation is restricted to Super Admin.');
      return;
    }
    setEditingRoleId(null);
    setRoleName('');
    setRoleCode('');
    setRoleDescription('');
    setSelectedPermissions([]);
    setIsRoleModalOpen(true);
  };

  const openEditRoleModal = (role: RoleDefinition) => {
    if (!isSuperAdmin) {
      toastError('Unauthorized', 'Role editing is restricted to Super Admin.');
      return;
    }
    setEditingRoleId(role.id);
    setRoleName(role.name);
    setRoleCode(role.code);
    setRoleDescription(role.description);
    setSelectedPermissions(role.permissions || []);
    setIsRoleModalOpen(true);
  };

  const handleTogglePermission = (code: string) => {
    setSelectedPermissions(prev => 
      prev.includes(code) ? prev.filter(p => p !== code) : [...prev, code]
    );
  };

  const handleSelectAllCategory = (category: string) => {
    const categoryPerms = category === 'All' 
      ? permissions.map(p => p.code)
      : permissions.filter(p => p.category === category).map(p => p.code);
    
    setSelectedPermissions(prev => Array.from(new Set([...prev, ...categoryPerms])));
  };

  const handleDeselectCategory = (category: string) => {
    const categoryPerms = new Set(
      category === 'All' 
        ? permissions.map(p => p.code)
        : permissions.filter(p => p.category === category).map(p => p.code)
    );
    
    setSelectedPermissions(prev => prev.filter(code => !categoryPerms.has(code)));
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;

    if (!roleName.trim()) {
      toastError('Validation Error', 'Role name is required.');
      return;
    }

    if (editingRoleId) {
      updateRole(editingRoleId, {
        name: roleName.trim(),
        description: roleDescription.trim(),
        permissions: selectedPermissions
      });
      success('Role Updated', `Permissions for "${roleName}" updated successfully.`);
    } else {
      if (!roleCode.trim()) {
        toastError('Validation Error', 'Role code is required.');
        return;
      }
      const created = addRole({
        name: roleName.trim(),
        code: roleCode.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        description: roleDescription.trim(),
        isSystem: false,
        permissions: selectedPermissions
      });
      if (created) {
        success('Role Created', `Custom RBAC role "${roleName}" created successfully.`);
      } else {
        toastError('Creation Failed', 'Role code may already exist or Super Admin authority required.');
      }
    }
    setIsRoleModalOpen(false);
  };

  const confirmDeleteRoleAction = () => {
    if (!roleToDelete) return;
    if (!isSuperAdmin) {
      toastError('Unauthorized', 'Role deletion is restricted to Super Admin.');
      setRoleToDelete(null);
      return;
    }
    if (roleToDelete.code === 'super_admin') {
      toastError('Action Blocked', 'Root Super Admin role cannot be deleted.');
      setRoleToDelete(null);
      return;
    }

    // Automatically reassign users with this role to 'staff'
    users.filter(u => u.role === roleToDelete.code).forEach(u => {
      updateUser(u.id, { role: 'staff' });
    });

    deleteRole(roleToDelete.id);
    success('Role Deleted', `Role "${roleToDelete.name}" deleted. Any assigned users were migrated to Staff.`);
    setRoleToDelete(null);
  };

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.full_name || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Permission Categories
  const categories = ['All', 'Core', 'Financials', 'Content', 'System', 'Security'];
  const filteredPermissions = activeCategoryFilter === 'All' 
    ? permissions 
    : permissions.filter(p => p.category === activeCategoryFilter);

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'super_admin':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-300';
      case 'accountant':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'editor':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'project_manager':
        return 'bg-indigo-50 text-indigo-700 border-indigo-300';
      case 'peon':
        return 'bg-orange-50 text-orange-700 border-orange-300';
      case 'staff':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'client':
        return 'bg-cyan-50 text-cyan-700 border-cyan-300';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & View Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1B2E] flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#8E2D9D]" />
            Users, Roles & Granular Permissions (RBAC)
          </h1>
          <p className="text-xs text-[#5F5A72] mt-1">
            Super Administrator Governance • Role Assignment & Permissions Matrix • Google Authenticator (2FA)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeSubTab === 'users' && (
            <button
              onClick={openCreateUserModal}
              className="px-4 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs flex items-center space-x-2 shadow-sm cursor-pointer transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User Profile</span>
            </button>
          )}

          {activeSubTab === 'roles' && isSuperAdmin && (
            <button
              onClick={openCreateRoleModal}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Define New Role</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#E8E0F0] pb-3">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'users'
              ? 'bg-[#8E2D9D] text-white shadow-sm'
              : 'bg-white text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-[#FAF8FF] border border-[#E8E0F0]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'roles'
              ? 'bg-[#8E2D9D] text-white shadow-sm'
              : 'bg-white text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-[#FAF8FF] border border-[#E8E0F0]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Roles & Permission Matrix ({roles.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit_log')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'audit_log'
              ? 'bg-[#8E2D9D] text-white shadow-sm'
              : 'bg-white text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-[#FAF8FF] border border-[#E8E0F0]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ACTIVE ROLE / SESSION BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#1E1B2E] flex items-center gap-2">
              <span>Active Session: {currentUser.full_name || currentUser.name}</span>
              {isSuperAdmin && (
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                  SUPER ADMIN ROOT
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#5F5A72]">
              Role: <span className="font-mono text-[#8E2D9D] uppercase font-bold">{currentUser.role.replace('_', ' ')}</span> • {currentUser.email} • <span className="text-emerald-600 font-semibold">Google 2FA Active</span>
            </div>
          </div>
        </div>

        {/* Authorized Role Switcher */}
        {isSuperAdmin ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[#5F5A72] mr-1 font-medium">Preview Role Scopes:</span>
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => switchRole(r.code as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                  currentUser.role === r.code 
                    ? 'bg-[#8E2D9D] text-white shadow-xs' 
                    : 'bg-[#FAF8FF] text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0]'
                }`}
              >
                {r.name}
              </button>
            ))}
            <button
              onClick={openCreateRoleModal}
              className="ml-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
              title="Add New Staff Role"
            >
              <Plus className="w-3 h-3" />
              <span>Add Role</span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-[#817B91] italic">
            Role switching is restricted to the Super Administrator.
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SUB-TAB 1: USERS DIRECTORY & ROLE ASSIGNMENT
          ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
              <input
                type="text"
                placeholder="Search users by name, email, phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D]"
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
            >
              <option value="all">All Roles ({users.length})</option>
              {roles.map(r => (
                <option key={r.id} value={r.code}>{r.name} ({users.filter(u => u.role === r.code).length})</option>
              ))}
            </select>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8FF] text-[#5F5A72] font-semibold border-b border-[#E8E0F0]">
                  <tr>
                    <th className="p-3.5">User Details</th>
                    <th className="p-3.5">Role Assignment</th>
                    <th className="p-3.5">Google Authenticator (2FA)</th>
                    <th className="p-3.5">Phone & Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0F0]">
                  {filteredUsers.map(user => {
                    const currentRoleDef = roles.find(r => r.code === user.role);
                    return (
                      <tr key={user.id} className="hover:bg-[#FAF8FF]/60 transition-colors">
                        <td className="p-3.5">
                          <div className="font-semibold text-[#1E1B2E] flex items-center gap-1.5">
                            <span>{user.full_name || user.name}</span>
                            {user.id === currentUser.id && (
                              <span className="text-[9px] font-bold bg-[#FAF5FF] text-[#8E2D9D] px-1.5 py-0.5 rounded border border-[#C084FC]/30">YOU</span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#5F5A72] font-mono flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-[#817B91]" />
                            {user.email}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getRoleBadge(user.role)}`}>
                              {user.role.replace('_', ' ')}
                            </span>
                            {isSuperAdmin && (
                              <button
                                type="button"
                                onClick={() => openRoleAssignmentModal(user)}
                                className="px-2 py-0.5 rounded-md bg-[#FAF5FF] hover:bg-[#8E2D9D] hover:text-white text-[#8E2D9D] border border-[#C084FC]/30 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                title="Change Role Assignment"
                              >
                                <UserCog className="w-3 h-3" />
                                <span>Assign Role</span>
                              </button>
                            )}
                          </div>
                          {currentRoleDef && (
                            <div className="text-[10px] text-[#817B91] mt-1 font-mono">
                              {currentRoleDef.permissions?.length || 0} permissions granted
                            </div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Google 2FA Active</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => open2faModal(user)}
                              className="px-2 py-0.5 rounded-md bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/30 text-[10px] font-bold hover:bg-[#8E2D9D] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                              title="View / Reset Google Authenticator QR Code"
                            >
                              <QrCode className="w-3 h-3" />
                              <span>Manage 2FA</span>
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-[#1E1B2E] font-mono text-[11px]">{user.phone || '—'}</div>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${user.is_active !== false ? 'text-emerald-700' : 'text-red-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.is_active !== false ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                            {user.is_active !== false ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openEditUserModal(user)}
                              className="p-1.5 rounded-lg bg-[#FAF8FF] hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#8E2D9D] border border-[#E8E0F0] transition-colors cursor-pointer"
                              title="Edit User Profile"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {isSuperAdmin && user.id !== currentUser.id && (
                              <button
                                onClick={() => setUserToDelete(user)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                                title="Delete User Account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-TAB 2: ROLES & PERMISSION MATRIX (Add / Modify / Delete)
          ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'roles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1E1B2E]">Roles & Permission Matrix</h2>
              <p className="text-xs text-[#5F5A72]">Define custom roles, modify permission scopes, and manage role assignments.</p>
            </div>
            {isSuperAdmin && (
              <button
                onClick={openCreateRoleModal}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Role</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(r => {
              const assignedUserCount = users.filter(u => u.role === r.code).length;
              return (
                <div 
                  key={r.id} 
                  className="p-5 rounded-2xl bg-white border border-[#E8E0F0] shadow-sm relative flex flex-col justify-between hover:border-[#C084FC]/50 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-[#1E1B2E] text-sm">{r.name}</h3>
                        <span className="font-mono text-[10px] text-[#8E2D9D] font-semibold">code: {r.code}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        r.isSystem ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {r.isSystem ? 'System Core' : 'Custom RBAC'}
                      </span>
                    </div>

                    <p className="text-xs text-[#5F5A72] line-clamp-2 mb-4 leading-relaxed">
                      {r.description || 'No description provided.'}
                    </p>

                    <div className="space-y-1 mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#5F5A72] flex items-center justify-between">
                        <span>Granted Permissions:</span>
                        <span className="font-mono text-[#8E2D9D] font-bold">{r.permissions?.length || 0} / {permissions.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar pr-1 bg-[#FAF8FF] p-2 rounded-xl border border-[#E8E0F0]">
                        {r.permissions && r.permissions.length > 0 ? (
                          r.permissions.map(perm => (
                            <span 
                              key={perm}
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white border border-[#E8E0F0] text-[#1E1B2E]"
                            >
                              {perm}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#817B91] italic">No specific permissions assigned</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-between">
                    <span className="text-[11px] text-[#817B91] font-medium">
                      <strong className="text-[#1E1B2E] font-bold">{assignedUserCount}</strong> active user(s)
                    </span>

                    {isSuperAdmin && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditRoleModal(r)}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF5FF] hover:bg-[#8E2D9D] hover:text-white text-[#8E2D9D] border border-[#C084FC]/30 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Modify Role & Permissions"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Modify</span>
                        </button>
                        {r.code !== 'super_admin' && (
                          <button
                            onClick={() => setRoleToDelete(r)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer transition-colors"
                            title="Delete Role"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Permissions Catalogue Reference */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E1B2E] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8E2D9D]" />
                <span>Authoritative Permissions Catalogue ({permissions.length} Actions)</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {permissions.map(p => (
                <div key={p.code} className="p-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#1E1B2E]">{p.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/30">
                      {p.category}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-[#8E2D9D] font-semibold mb-1">{p.code}</div>
                  <p className="text-[11px] text-[#5F5A72] leading-snug">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-TAB 3: SECURITY AUDIT TRAIL
          ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'audit_log' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-sm">
            <div className="text-xs font-bold text-[#1E1B2E] mb-1">Immutable Security Audit Logs</div>
            <p className="text-xs text-[#5F5A72]">
              Real-time audit records tracking all logins, Google Authenticator validations, role reassignments, privilege modifications, and record deletions.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8FF] text-[#5F5A72] font-semibold border-b border-[#E8E0F0]">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Actor</th>
                  <th className="p-3.5">Action Code</th>
                  <th className="p-3.5">Target Entity</th>
                  <th className="p-3.5">Audit Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0F0]">
                {auditLogs.slice(0, 30).map(log => (
                  <tr key={log.id} className="hover:bg-[#FAF8FF]/60 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-[#5F5A72]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[#1E1B2E]">{log.user_email}</div>
                      <div className="text-[10px] text-[#8E2D9D] uppercase font-mono font-bold">{log.user_role}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        log.action === 'UPDATE' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        log.action === 'DELETE' ? 'bg-red-50 text-red-700 border border-red-200' :
                        log.action === 'AUTH_LOGIN' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        log.action === 'ROLE_CHANGE' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-50 text-slate-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[#1E1B2E] text-[11px]">
                      {log.table_name}
                    </td>
                    <td className="p-3.5 text-[#5F5A72] text-[11px]">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: QUICK ROLE ASSIGNMENT
          ───────────────────────────────────────────────────────────── */}
      {assigningUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#E8E0F0] rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <button
              onClick={() => setAssigningUser(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 text-[#5F5A72] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/30">
                <UserCog className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Assign Role</h2>
                <p className="text-xs text-[#5F5A72]">
                  Select role permissions for <strong>{assigningUser.full_name || assigningUser.name}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-semibold text-[#1E1B2E]">Available Role Profiles:</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {roles.map(r => {
                  const isSelected = selectedNewRole === r.code;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedNewRole(r.code)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-[#FAF5FF] border-[#8E2D9D] shadow-xs' 
                          : 'bg-white border-[#E8E0F0] hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-[#1E1B2E] flex items-center gap-2">
                          <span>{r.name}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${getRoleBadge(r.code)}`}>
                            {r.code}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#5F5A72] mt-0.5">{r.description}</p>
                        <div className="text-[9px] font-mono text-[#8E2D9D] mt-1 font-semibold">
                          {r.permissions?.length || 0} granted permissions
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#8E2D9D] bg-[#8E2D9D] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setAssigningUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRoleAssignment}
                className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Apply Role Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: IN-APP CONFIRM USER DELETION
          ───────────────────────────────────────────────────────────── */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-red-200 rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Delete User Account</h2>
                <p className="text-xs text-red-600 font-semibold">Permanent deletion from system</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Are you sure you want to permanently erase the user profile for <strong className="text-[#1E1B2E]">{userToDelete.full_name || userToDelete.name}</strong> (<span className="font-mono">{userToDelete.email}</span>)?
              This user will no longer be able to log in or access internal resources.
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUserAction}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: IN-APP CONFIRM ROLE DELETION
          ───────────────────────────────────────────────────────────── */}
      {roleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-red-200 rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Delete Custom Role</h2>
                <p className="text-xs text-red-600 font-semibold">Role code: {roleToDelete.code}</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Are you sure you want to permanently delete custom role <strong className="text-[#1E1B2E]">{roleToDelete.name}</strong>?
              Any users currently assigned to this role will be automatically reassigned to the default <strong>Staff</strong> role.
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setRoleToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteRoleAction}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Role</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: GOOGLE AUTHENTICATOR (2FA) MANAGEMENT
          ───────────────────────────────────────────────────────────── */}
      {is2faModalOpen && selected2faUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#E8E0F0] rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIs2faModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 text-[#5F5A72] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#8E2D9D] to-[#6F42C1] text-white">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Google Authenticator (2FA)</h2>
                <p className="text-xs text-[#5F5A72]">
                  Manage TOTP keys for <strong>{selected2faUser.full_name || selected2faUser.name}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* QR Code Container */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E8E0F0] flex flex-col items-center justify-center text-center">
                {twoFactorQr ? (
                  <div className="p-2 bg-white rounded-xl border border-[#E8E0F0] shadow-sm mb-2">
                    <img src={twoFactorQr} alt="Google Authenticator QR Code" className="w-40 h-40 rounded-lg" />
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-slate-100 rounded-xl flex items-center justify-center text-[#817B91] mb-2">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                )}
                <span className="text-[11px] text-[#5F5A72]">
                  Scan in Google Authenticator or Microsoft Authenticator
                </span>
              </div>

              {/* Secret Key with Copy */}
              <div>
                <label className="block font-semibold text-[#1E1B2E] mb-1">
                  Secret Key (Manual Entry):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={formatSecretKey(twoFactorSecret)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-[#1E1B2E] text-center select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(twoFactorSecret);
                      setCopiedSecret(true);
                      setTimeout(() => setCopiedSecret(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#C084FC]/40 text-[#8E2D9D] hover:bg-[#8E2D9D] hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Emergency Backup Recovery Codes */}
              {twoFactorRecoveryCodes.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[#1E1B2E] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                      <Shield className="w-3.5 h-3.5 text-amber-700" />
                      One-Time Recovery Codes:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(twoFactorRecoveryCodes.join('\n'));
                        setCopiedRecovery(true);
                        setTimeout(() => setCopiedRecovery(false), 2000);
                      }}
                      className="text-[10px] font-bold text-amber-900 underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedRecovery ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedRecovery ? 'Copied All' : 'Copy All'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] text-amber-900 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                    {twoFactorRecoveryCodes.map((code, idx) => (
                      <span key={idx} className="font-semibold">{code}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset2faSecret}
                  className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Secret</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIs2faModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: USER PROFILE CREATE / EDIT
          ───────────────────────────────────────────────────────────── */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#E8E0F0] rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 text-[#5F5A72] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-[#1E1B2E] mb-1">
              {editingUserId ? 'Edit User Profile' : 'Create User Account'}
            </h2>
            <p className="text-xs text-[#5F5A72] mb-4">
              Configure profile identity, role designation, and Google Authenticator 2FA security.
            </p>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Debashis Panda"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. operations@fusionforgecreation.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Role Assignment</label>
                  <select
                    value={userRole}
                    onChange={e => setUserRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] font-semibold capitalize"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.code}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Organization / Department</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E8E0F0]">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded bg-white border-[#E8E0F0] text-[#8E2D9D]"
                  />
                  <label htmlFor="is_active" className="text-[#1E1B2E] font-medium cursor-pointer">
                    User account is active and permitted to login
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="mfa_enabled"
                    checked={mfaEnabled}
                    onChange={e => setMfaEnabled(e.target.checked)}
                    className="w-4 h-4 rounded bg-white border-[#E8E0F0] text-[#8E2D9D]"
                  />
                  <label htmlFor="mfa_enabled" className="text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Enforce Google Authenticator (2FA) for this account</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold shadow-xs cursor-pointer"
                >
                  {editingUserId ? 'Update Profile' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ROLE & PERMISSION MATRIX BUILDER (Add / Modify Scope)
          ───────────────────────────────────────────────────────────── */}
      {isRoleModalOpen && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white border border-[#E8E0F0] rounded-3xl shadow-2xl p-6 sm:p-8 relative text-[#1E1B2E] max-h-[92vh] flex flex-col">
            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-[#5F5A72] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#1E1B2E] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#8E2D9D]" />
                {editingRoleId ? `Modify Role: ${roleName}` : 'Define New Staff / RBAC Role'}
              </h2>
              <p className="text-xs text-[#5F5A72] mt-0.5">
                Set granular operational permissions across all system modules and actions for staff (e.g. Administrator, Accountant, Staff, Peon).
              </p>
            </div>

            {/* Quick Template Presets for fast role definition */}
            {!editingRoleId && (
              <div className="mb-3 p-3 rounded-2xl bg-[#FAF8FF] border border-[#E8E0F0] flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#8E2D9D] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Quick Presets:</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRoleName('Peon / Office Assistant');
                    setRoleCode('peon');
                    setRoleDescription('Office errands, visitor logging, dispatch and notification access');
                    setSelectedPermissions(['module.dashboard', 'module.visitor_monitoring', 'module.notifications']);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-[10px] font-bold cursor-pointer transition-colors"
                >
                  ⚡ Peon / Office Boy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRoleName('Accountant');
                    setRoleCode('accountant');
                    setRoleDescription('Invoices, Credit/Debit notes, Purchases, Expenses, GST reports');
                    setSelectedPermissions([
                      'module.dashboard', 'module.clients', 'module.quotations', 'module.invoices',
                      'module.payments', 'module.purchases', 'module.expenses', 'module.accounting',
                      'module.gst_reports', 'module.notifications', 'module.database', 'action.export_print'
                    ]);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold cursor-pointer transition-colors"
                >
                  ⚡ Accountant
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRoleName('Administrator');
                    setRoleCode('admin');
                    setRoleDescription('Operational write authority across projects, clients, finances, and agency settings');
                    setSelectedPermissions(permissions.filter(p => p.code !== 'action.delete').map(p => p.code));
                  }}
                  className="px-2 py-0.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold cursor-pointer transition-colors"
                >
                  ⚡ Administrator
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRoleName('Front Desk / Receptionist');
                    setRoleCode('receptionist');
                    setRoleDescription('Visitor check-ins, enquiries, clients contact, and front-desk notifications');
                    setSelectedPermissions([
                      'module.dashboard', 'module.enquiries', 'module.clients',
                      'module.visitor_monitoring', 'module.notifications'
                    ]);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold cursor-pointer transition-colors"
                >
                  ⚡ Receptionist / Front Desk
                </button>
              </div>
            )}

            <form onSubmit={handleSaveRole} className="flex-1 flex flex-col overflow-hidden space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1 text-xs">Role Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operations Lead"
                    value={roleName}
                    onChange={e => setRoleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] text-xs outline-none focus:border-[#8E2D9D]"
                  />
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1 text-xs">Unique Code</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingRoleId}
                    placeholder="e.g. operations_lead"
                    value={roleCode}
                    onChange={e => setRoleCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] font-mono text-xs outline-none focus:border-[#8E2D9D] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1 text-xs">Description</label>
                  <input
                    type="text"
                    required
                    placeholder="Operational scope summary"
                    value={roleDescription}
                    onChange={e => setRoleDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] text-xs outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              {/* Permissions Category Filter & Bulk Selection Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E8E0F0]">
                <div className="flex flex-wrap items-center gap-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        activeCategoryFilter === cat
                          ? 'bg-[#8E2D9D] text-white font-bold'
                          : 'bg-white text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleSelectAllCategory(activeCategoryFilter)}
                    className="text-[10px] font-bold text-[#8E2D9D] bg-[#FAF5FF] hover:bg-[#8E2D9D] hover:text-white px-2 py-1 rounded-md border border-[#C084FC]/30 transition-colors cursor-pointer"
                  >
                    Select All in {activeCategoryFilter}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeselectCategory(activeCategoryFilter)}
                    className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    Clear {activeCategoryFilter}
                  </button>
                  <div className="text-[11px] font-mono text-[#8E2D9D] font-bold ml-2">
                    {selectedPermissions.length} / {permissions.length}
                  </div>
                </div>
              </div>

              {/* Permissions Selection Checklist */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 rounded-2xl bg-[#FAF8FF] border border-[#E8E0F0] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredPermissions.map(perm => {
                  const isChecked = selectedPermissions.includes(perm.code);
                  return (
                    <div
                      key={perm.code}
                      onClick={() => handleTogglePermission(perm.code)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start space-x-3 ${
                        isChecked
                          ? 'bg-white border-[#8E2D9D] shadow-sm ring-1 ring-[#8E2D9D]/20'
                          : 'bg-white/60 border-[#E8E0F0] text-[#5F5A72] hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-[#8E2D9D] border-[#8E2D9D] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#1E1B2E]">{perm.name}</span>
                          <span className="px-1 py-0.2 rounded text-[8px] font-mono uppercase bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/30">
                            {perm.category}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-[#8E2D9D]">{perm.code}</div>
                        <p className="text-[10px] text-[#5F5A72] leading-snug">{perm.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-between">
                <span className="text-[11px] text-[#5F5A72]">
                  Super Admin role always retains full governance authority.
                </span>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsRoleModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    {editingRoleId ? 'Save Role Scope' : 'Create Role'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
