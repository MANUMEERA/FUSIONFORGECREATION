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
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole, RoleDefinition, PermissionDefinition } from '../../types';
import { useToast } from '../../context/ToastContext';

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

  // Role Editor Modal State (Super Admin Only)
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
      addUser({
        full_name: fullName,
        name: fullName,
        email,
        phone,
        role: userRole as any,
        company,
        is_active: isActive,
        mfa_enabled: mfaEnabled,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      success('User Profile Created', `New authenticated account created for ${fullName}.`);
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (user: UserProfile) => {
    if (!isSuperAdmin) {
      toastError('Security Restriction', 'Only Super Admin can delete records.');
      return;
    }
    if (user.id === currentUser.id) {
      toastError('Action Blocked', 'You cannot delete your own active Super Admin session.');
      return;
    }
    if (confirm(`Are you sure you want to permanently delete user account "${user.full_name || user.name}"?`)) {
      deleteUser(user.id);
      success('User Deleted', `Account ${user.email} removed from system.`);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // ROLE & PERMISSIONS HANDLERS (Super Admin Only)
  // ─────────────────────────────────────────────────────────────
  const openCreateRoleModal = () => {
    if (!isSuperAdmin) {
      toastError('Permission Denied', 'Only Super Admin can define and create roles.');
      return;
    }
    setEditingRoleId(null);
    setRoleName('');
    setRoleCode('');
    setRoleDescription('');
    setSelectedPermissions(['module.dashboard']);
    setIsRoleModalOpen(true);
  };

  const openEditRoleModal = (roleItem: RoleDefinition) => {
    if (!isSuperAdmin) {
      toastError('Permission Denied', 'Only Super Admin can modify roles and permissions.');
      return;
    }
    setEditingRoleId(roleItem.id);
    setRoleName(roleItem.name);
    setRoleCode(roleItem.code);
    setRoleDescription(roleItem.description);
    setSelectedPermissions(roleItem.permissions || []);
    setIsRoleModalOpen(true);
  };

  const handleTogglePermission = (permCode: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permCode) 
        ? prev.filter(c => c !== permCode) 
        : [...prev, permCode]
    );
  };

  const handleSelectAllCategory = (category: string) => {
    const categoryPerms = permissions.filter(p => p.category === category).map(p => p.code);
    const allSelected = categoryPerms.every(code => selectedPermissions.includes(code));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(code => !categoryPerms.includes(code)));
    } else {
      setSelectedPermissions(prev => Array.from(new Set([...prev, ...categoryPerms])));
    }
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;

    if (editingRoleId) {
      const ok = updateRole(editingRoleId, {
        name: roleName,
        description: roleDescription,
        permissions: selectedPermissions
      });
      if (ok) {
        success('Role Updated', `Permissions updated for role: ${roleName}`);
        setIsRoleModalOpen(false);
      }
    } else {
      const newRole = addRole({
        name: roleName,
        code: roleCode,
        description: roleDescription,
        isSystem: false,
        permissions: selectedPermissions
      });
      if (newRole) {
        success('Role Created', `Created custom RBAC role: ${roleName}`);
        setIsRoleModalOpen(false);
      } else {
        toastError('Failed to Create Role', 'Role code may already exist or is invalid.');
      }
    }
  };

  const handleDeleteRole = (roleItem: RoleDefinition) => {
    if (!isSuperAdmin) {
      toastError('Access Denied', 'Only Super Admin can delete custom roles.');
      return;
    }
    if (roleItem.isSystem) {
      toastError('Protected Role', 'Built-in system roles cannot be deleted.');
      return;
    }
    if (confirm(`Permanently delete custom role "${roleItem.name}"?`)) {
      deleteRole(roleItem.id);
      success('Role Deleted', `Role ${roleItem.name} removed from system.`);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const displayName = u.full_name || u.name || '';
    const matchesSearch = 
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(searchTerm.toLowerCase()));
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
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'admin':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'editor':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'accountant':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'staff':
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
      case 'project_manager':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'client':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & View Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            Users, Roles & Granular Permissions (RBAC)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Super Administrator Governance • Role Permission Matrix • 2FA/MFA Enforcements
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeSubTab === 'users' && (
            <button
              onClick={openCreateUserModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add User Profile</span>
            </button>
          )}

          {activeSubTab === 'roles' && isSuperAdmin && (
            <button
              onClick={openCreateRoleModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Define New Role</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-blue-500/20 pb-3">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'users'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'roles'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Roles & Permission Matrix ({roles.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit_log')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'audit_log'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ACTIVE ROLE / SESSION BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/70 to-[#0b1638] border border-blue-500/20 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Active Session: {currentUser.full_name || currentUser.name}</span>
              {isSuperAdmin && (
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-700/50">
                  Super Admin Root
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400">
              Role: <span className="font-mono text-cyan-400 uppercase font-semibold">{currentUser.role.replace('_', ' ')}</span> • {currentUser.email} • 2FA Active
            </div>
          </div>
        </div>

        {/* Authorized Role Switcher */}
        {isSuperAdmin ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Preview Role Scopes:</span>
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => switchRole(r.code as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                  currentUser.role === r.code 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">
            Role switching is restricted to the Super Administrator.
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SUB-TAB 1: USERS DIRECTORY
          ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name, email, phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Roles</option>
              {roles.map(r => (
                <option key={r.id} value={r.code}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl border border-blue-500/20 bg-slate-900/40 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">User Details</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Security / 2FA</th>
                    <th className="p-3.5">Phone & Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{user.full_name || user.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          {user.email}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getRoleBadge(user.role)}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>MFA Enabled</span>
                        </div>
                        <span className="text-[10px] text-slate-500">TOTP Authenticator</span>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-300 font-mono text-[11px]">{user.phone || '—'}</div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${user.is_active !== false ? 'text-emerald-400' : 'text-red-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active !== false ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                          {user.is_active !== false ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditUserModal(user)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {isSuperAdmin && user.id !== currentUser.id && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete User (Super Admin Only)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-TAB 2: ROLES & PERMISSION MATRIX
          ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(r => (
              <div 
                key={r.id} 
                className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1938] to-[#070f24] border border-blue-500/20 shadow-lg relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white text-sm">{r.name}</h3>
                      <span className="font-mono text-[10px] text-cyan-400">code: {r.code}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      r.isSystem ? 'bg-blue-950 text-blue-300 border border-blue-700/40' : 'bg-purple-950 text-purple-300 border border-purple-700/40'
                    }`}>
                      {r.isSystem ? 'System Core' : 'Custom RBAC'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {r.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Granted Permissions ({r.permissions.length} total):
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                      {r.permissions.map(perm => (
                        <span 
                          key={perm}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {users.filter(u => u.role === r.code).length} active user(s)
                  </span>

                  {isSuperAdmin && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditRoleModal(r)}
                        className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-cyan-300 border border-blue-700/40 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Scope</span>
                      </button>
                      {!r.isSystem && (
                        <button
                          onClick={() => handleDeleteRole(r)}
                          className="p-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 cursor-pointer"
                          title="Delete Custom Role"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Permissions Catalogue Reference */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#09122c] to-[#040817] border border-blue-500/20 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Authoritative Permissions Catalogue ({permissions.length} Actions)</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {permissions.map(p => (
                <div key={p.code} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-950 text-cyan-300 border border-blue-800">
                      {p.category}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-cyan-400 mb-1">{p.code}</div>
                  <p className="text-[11px] text-slate-400 leading-snug">{p.description}</p>
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
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-blue-500/20">
            <div className="text-xs font-bold text-white mb-1">Immutable Security Audit Logs</div>
            <p className="text-xs text-slate-400">
              Real-time audit records tracking all logins, role reassignments, privilege modifications, and record deletions.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-slate-900/40 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Actor</th>
                  <th className="p-3.5">Action Code</th>
                  <th className="p-3.5">Target Entity</th>
                  <th className="p-3.5">Audit Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.slice(0, 30).map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{log.user_email}</div>
                      <div className="text-[10px] text-cyan-400 uppercase font-mono">{log.user_role}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.action === 'CREATE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        log.action === 'UPDATE' ? 'bg-blue-950 text-cyan-300 border border-blue-800' :
                        log.action === 'DELETE' ? 'bg-red-950 text-red-300 border border-red-800' :
                        log.action === 'ROLE_CHANGE' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300 text-[11px]">
                      {log.table_name}
                    </td>
                    <td className="p-3.5 text-slate-300 text-[11px]">
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
          MODAL: USER PROFILE CREATE / EDIT
          ───────────────────────────────────────────────────────────── */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-gradient-to-b from-[#0e1838] to-[#060c1c] border border-blue-500/30 rounded-3xl shadow-2xl p-6 relative text-slate-100">
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">
              {editingUserId ? 'Edit User Profile' : 'Create User Account'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Configure profile identity, role designation, and multi-factor security.
            </p>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Debashis Panda"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-blue-500/30 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address (Supabase Login)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. operations@fusionforgecreation.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-blue-500/30 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-blue-500/30 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role Assignment</label>
                  <select
                    value={userRole}
                    onChange={e => setUserRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-blue-500/30 text-white outline-none focus:border-cyan-400 font-semibold capitalize"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.code}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Organization / Department</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-blue-500/30 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600"
                  />
                  <label htmlFor="is_active" className="text-slate-300 font-medium">
                    User account is active and permitted to login
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="mfa_enabled"
                    checked={mfaEnabled}
                    onChange={e => setMfaEnabled(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600"
                  />
                  <label htmlFor="mfa_enabled" className="text-emerald-400 font-medium">
                    Enforce Multi-Factor Authentication (2FA) for this staff account
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-95 text-white font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  {editingUserId ? 'Update Profile' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ROLE & PERMISSION MATRIX BUILDER (Super Admin Only)
          ───────────────────────────────────────────────────────────── */}
      {isRoleModalOpen && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-gradient-to-b from-[#0f1c3f] via-[#0a1330] to-[#060c1f] border border-blue-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-slate-100 max-h-[92vh] flex flex-col">
            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                {editingRoleId ? `Configure Role: ${roleName}` : 'Define New RBAC Role'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Set granular operational permissions across all system modules and actions.
              </p>
            </div>

            <form onSubmit={handleSaveRole} className="flex-1 flex flex-col overflow-hidden space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-xs">Role Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operations Lead"
                    value={roleName}
                    onChange={e => setRoleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-blue-500/30 text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-xs">Unique Code</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingRoleId}
                    placeholder="e.g. operations_lead"
                    value={roleCode}
                    onChange={e => setRoleCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-blue-500/30 text-white font-mono text-xs outline-none focus:border-cyan-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-xs">Description</label>
                  <input
                    type="text"
                    required
                    placeholder="Operational scope summary"
                    value={roleDescription}
                    onChange={e => setRoleDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-blue-500/30 text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Permissions Category Filter */}
              <div className="flex items-center justify-between pt-2 border-t border-blue-500/20">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        activeCategoryFilter === cat
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] font-mono text-cyan-400">
                  {selectedPermissions.length} / {permissions.length} Selected
                </div>
              </div>

              {/* Permissions Selection Checklist */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 rounded-2xl bg-slate-950/60 border border-blue-500/20 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredPermissions.map(perm => {
                  const isChecked = selectedPermissions.includes(perm.code);
                  return (
                    <div
                      key={perm.code}
                      onClick={() => handleTogglePermission(perm.code)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start space-x-3 ${
                        isChecked
                          ? 'bg-blue-950/60 border-cyan-400/50 text-white shadow-sm'
                          : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-600 bg-slate-800'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">{perm.name}</span>
                          <span className="px-1 py-0.2 rounded text-[8px] font-mono uppercase bg-slate-800 text-cyan-300">
                            {perm.category}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-cyan-400/80">{perm.code}</div>
                        <p className="text-[10px] text-slate-400 leading-snug">{perm.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Note: Super Admin always retains unrestricted access across all system operations.
                </span>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsRoleModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 cursor-pointer"
                  >
                    {editingRoleId ? 'Save Permissions' : 'Create Role'}
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
