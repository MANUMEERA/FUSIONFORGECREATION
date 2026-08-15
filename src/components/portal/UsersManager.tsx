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
  UserCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole } from '../../types';

export const UsersManager: React.FC = () => {
  const { users, currentUser, addUser, updateUser, deleteUser, switchRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [company, setCompany] = useState('Fusion Forge Creation');
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setEditingId(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setRole('staff');
    setCompany('Fusion Forge Creation');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserProfile) => {
    setEditingId(user.id);
    setFullName(user.full_name || user.name || '');
    setEmail(user.email);
    setPhone(user.phone || '');
    setRole(user.role);
    setCompany(user.company || 'Fusion Forge Creation');
    setIsActive(user.is_active ?? true);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateUser(editingId, {
        full_name: fullName,
        name: fullName,
        email,
        phone,
        role,
        company,
        is_active: isActive,
        updated_at: new Date().toISOString()
      });
    } else {
      addUser({
        full_name: fullName,
        name: fullName,
        email,
        phone,
        role,
        company,
        is_active: isActive,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => {
    const displayName = u.full_name || u.name || '';
    const matchesSearch = 
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (r: UserRole) => {
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
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-400" />
            Users & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-sm text-slate-400">
            Manage profiles, roles (Super Admin, Admin, Editor, Accountant, Staff), and access scopes.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add User Profile</span>
        </button>
      </div>

      {/* Role Switcher Sandbox */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-purple-950/30 border border-blue-500/20 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Active Session: {currentUser.full_name || currentUser.name}</div>
            <div className="text-[11px] text-slate-400">
              Role: <span className="font-mono text-cyan-400 uppercase font-semibold">{currentUser.role.replace('_', ' ')}</span> • {currentUser.email}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1">Quick Role Switch:</span>
          {(['super_admin', 'admin', 'editor', 'accountant', 'staff', 'client'] as UserRole[]).map(r => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                currentUser.role === r 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email, company..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Administrator</option>
          <option value="editor">Editor</option>
          <option value="accountant">Accountant</option>
          <option value="staff">Staff</option>
          <option value="client">Client</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/50 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Phone / Status</th>
                <th className="p-3.5">Access Scope</th>
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
                    <div className="text-slate-300 font-mono text-[11px]">{user.phone || '—'}</div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${user.is_active !== false ? 'text-emerald-400' : 'text-red-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.is_active !== false ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                      {user.is_active !== false ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {user.role === 'super_admin' && 'Root Control: All Core Tables & DB Schema'}
                    {user.role === 'admin' && 'Full System Read & Write Access'}
                    {user.role === 'editor' && 'Content, Projects, Services & FAQs'}
                    {user.role === 'accountant' && 'Invoices, GST Reports, Payments & Ledgers'}
                    {user.role === 'staff' && 'Read-only View & Operational Tasks'}
                    {user.role === 'project_manager' && 'Clients, Enquiries, Sprints & Deliverables'}
                    {user.role === 'client' && 'Client Dashboard, Assigned Invoices & Quotes'}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit User"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete user "${user.full_name || user.name}"?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400"
                          title="Delete User"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0d1527] border border-slate-700 rounded-2xl shadow-2xl p-6 relative text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              {editingId ? 'Edit User Profile' : 'Create User Profile'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Configure profile fields, role permissions, and active status.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manoj Satapathy"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@fusionforgecreation.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 00112"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role Assignment</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  >
                    <option value="super_admin">Super Admin (All Privileges)</option>
                    <option value="admin">Administrator</option>
                    <option value="editor">Editor (Content & Services)</option>
                    <option value="accountant">Accountant (GST & Invoices)</option>
                    <option value="staff">Staff (Operational View)</option>
                    <option value="client">Client (Portal View)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Organization / Company</label>
                <input
                  type="text"
                  placeholder="e.g. Fusion Forge Creation"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-slate-300 font-medium">
                  User account is active and permitted to authenticate
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30"
                >
                  {editingId ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
