import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Printer, 
  Download, 
  Trash2, 
  Edit3, 
  Sparkles, 
  X,
  CreditCard,
  Building2,
  ShieldCheck,
  Percent,
  UserPlus
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { StaffMember, SalaryRecord, SalaryPaymentStatus } from '../../../types';
import { useToast } from '../../../context/ToastContext';

export const SalarySection: React.FC = () => {
  const { 
    staffMembers, 
    salaryRecords, 
    addStaffMember, 
    updateStaffMember, 
    deleteStaffMember, 
    generateMonthlyPayroll, 
    markSalaryPaid, 
    deleteSalaryRecord,
    agencyConfig,
    currentUser
  } = useApp();
  const { success, error: toastError } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'payroll' | 'staff'>('payroll');
  const [selectedPeriodMonth, setSelectedPeriodMonth] = useState('08');
  const [selectedPeriodYear, setSelectedPeriodYear] = useState(2026);
  const [selectedPayslip, setSelectedPayslip] = useState<SalaryRecord | null>(null);

  // Staff Modal
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('Full-Stack Engineer');
  const [department, setDepartment] = useState('Engineering');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [baseSalary, setBaseSalary] = useState<number>(60000);
  const [hraAllowance, setHraAllowance] = useState<number>(20000);
  const [specialAllowance, setSpecialAllowance] = useState<number>(10000);
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [pfApplicable, setPfApplicable] = useState(true);
  const [esiApplicable, setEsiApplicable] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Filtered Payroll Records for Selected Period
  const currentPeriodRecords = salaryRecords.filter(
    r => r.periodMonth === selectedPeriodMonth && r.periodYear === selectedPeriodYear
  );

  // Metrics
  const totalGrossPayroll = currentPeriodRecords.reduce((sum, r) => sum + r.grossSalary, 0);
  const totalNetDisbursements = currentPeriodRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const totalDeductions = currentPeriodRecords.reduce((sum, r) => sum + r.totalDeductions, 0);
  const paidCount = currentPeriodRecords.filter(r => r.paymentStatus === 'paid').length;

  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    setEmployeeId(`FFC-EMP-00${staffMembers.length + 1}`);
    setFullName('');
    setEmail('');
    setPhone('+91 ');
    setDesignation('Software Engineer');
    setDepartment('Engineering');
    setJoiningDate(new Date().toISOString().split('T')[0]);
    setBaseSalary(50000);
    setHraAllowance(20000);
    setSpecialAllowance(10000);
    setBankAccountName('');
    setBankAccountNumber('');
    setBankIfsc('HDFC0000123');
    setPanNumber('ABCDE1234F');
    setPfApplicable(true);
    setEsiApplicable(false);
    setIsActive(true);
    setShowStaffModal(true);
  };

  const handleOpenEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setEmployeeId(staff.employeeId);
    setFullName(staff.fullName);
    setEmail(staff.email);
    setPhone(staff.phone || '');
    setDesignation(staff.designation);
    setDepartment(staff.department);
    setJoiningDate(staff.joiningDate);
    setBaseSalary(staff.baseSalary);
    setHraAllowance(staff.hraAllowance);
    setSpecialAllowance(staff.specialAllowance);
    setBankAccountName(staff.bankAccountName || staff.fullName);
    setBankAccountNumber(staff.bankAccountNumber || '');
    setBankIfsc(staff.bankIfsc || '');
    setPanNumber(staff.panNumber || '');
    setPfApplicable(staff.pfApplicable);
    setEsiApplicable(staff.esiApplicable);
    setIsActive(staff.isActive);
    setShowStaffModal(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !employeeId.trim() || baseSalary <= 0) {
      toastError('Please enter valid employee details and base salary.');
      return;
    }

    try {
      const payload = {
        employeeId: employeeId.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        designation: designation.trim(),
        department: department.trim(),
        joiningDate,
        baseSalary,
        hraAllowance,
        specialAllowance,
        bankAccountName: bankAccountName.trim() || fullName.trim(),
        bankAccountNumber: bankAccountNumber.trim() || undefined,
        bankIfsc: bankIfsc.trim() || undefined,
        panNumber: panNumber.trim().toUpperCase() || undefined,
        pfApplicable,
        esiApplicable,
        isActive
      };

      if (editingStaff) {
        await updateStaffMember(editingStaff.id, payload);
        success(`Updated profile for ${fullName}.`);
      } else {
        await addStaffMember(payload);
        success(`Registered staff member ${fullName} (${employeeId}).`);
      }
      setShowStaffModal(false);
    } catch (err) {
      toastError('Failed to save staff record.');
    }
  };

  const handleRunPayroll = async () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndex = parseInt(selectedPeriodMonth, 10) - 1;
    const periodLabel = `${monthNames[monthIndex]} ${selectedPeriodYear}`;

    try {
      const res = await generateMonthlyPayroll(selectedPeriodMonth, selectedPeriodYear);
      success(`Generated ${res.count} salary vouchers for ${periodLabel}.`);
    } catch (err) {
      toastError('Failed to generate payroll.');
    }
  };

  const handleDisburse = async (rec: SalaryRecord) => {
    const ref = prompt('Enter Bank Payment UTR / Transaction Reference:', `SAL/NEFT/${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    if (ref !== null) {
      await markSalaryPaid(rec.id, ref);
      success(`Salary for ${rec.employeeName} marked as Disbursed/Paid.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs: Monthly Payroll Runs vs Staff Master */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('payroll')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'payroll'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            Payroll Cycles & Payslips
          </button>
          <button
            onClick={() => setActiveSubTab('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'staff'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            Staff Directory & Compensation ({staffMembers.length})
          </button>
        </div>

        {activeSubTab === 'payroll' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedPeriodMonth}
                onChange={e => setSelectedPeriodMonth(e.target.value)}
                className="bg-transparent text-white font-bold outline-none cursor-pointer"
              >
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
              <select
                value={selectedPeriodYear}
                onChange={e => setSelectedPeriodYear(parseInt(e.target.value))}
                className="bg-transparent text-white font-bold outline-none cursor-pointer"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>

            <button
              onClick={handleRunPayroll}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run Payroll</span>
            </button>
          </div>
        )}

        {activeSubTab === 'staff' && (
          <button
            onClick={handleOpenAddStaff}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        )}
      </div>

      {activeSubTab === 'payroll' && (
        <>
          {/* Payroll Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/25">
              <div className="text-xs text-indigo-300 font-semibold mb-1">Total Gross Salary</div>
              <div className="text-2xl font-black text-white font-mono">₹{totalGrossPayroll.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-400 mt-1">{currentPeriodRecords.length} staff processed</div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/25">
              <div className="text-xs text-emerald-300 font-semibold mb-1">Net Take-Home Disbursed</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">₹{totalNetDisbursements.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-300/80 mt-1">Direct Bank Transfers</div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/25">
              <div className="text-xs text-amber-300 font-semibold mb-1">Statutory Deductions (PF/PT/TDS)</div>
              <div className="text-2xl font-black text-amber-400 font-mono">₹{totalDeductions.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-400 mt-1">EPFO & Govt Tax Retentions</div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/25">
              <div className="text-xs text-cyan-300 font-semibold mb-1">Disbursement Status</div>
              <div className="text-2xl font-black text-cyan-400 font-mono">{paidCount} / {currentPeriodRecords.length}</div>
              <div className="text-[11px] text-slate-400 mt-1">Vouchers Completed</div>
            </div>
          </div>

          {/* Salary Records Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/70 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Employee Name & ID</th>
                    <th className="p-3.5">Designation</th>
                    <th className="p-3.5 text-right">Gross Earnings</th>
                    <th className="p-3.5 text-right">Deductions (PF/PT/TDS)</th>
                    <th className="p-3.5 text-right">Net Payable</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Payslip</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentPeriodRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        No payroll vouchers generated for this cycle yet. Click <strong>"Run Payroll"</strong> above to auto-generate salary slips from the Staff Directory.
                      </td>
                    </tr>
                  ) : (
                    currentPeriodRecords.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{rec.employeeName}</div>
                          <div className="text-[10px] font-mono text-cyan-400">
                            {staffMembers.find(s => s.id === rec.employeeId)?.employeeId || 'FFC-EMP'}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-slate-300 font-medium">
                            {staffMembers.find(s => s.id === rec.employeeId)?.designation || 'Engineering Staff'}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {staffMembers.find(s => s.id === rec.employeeId)?.department || 'Core Tech'}
                          </div>
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-slate-200">
                          ₹{rec.grossSalary.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="font-mono font-bold text-amber-400">
                            -₹{rec.totalDeductions.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono">
                            PF: ₹{rec.providentFund} | PT: ₹{rec.professionalTax} | TDS: ₹{rec.tdsDeduction}
                          </div>
                        </td>
                        <td className="p-3.5 text-right font-mono font-black text-emerald-400 text-sm">
                          ₹{rec.netSalary.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                            rec.paymentStatus === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {rec.paymentStatus === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{rec.paymentStatus}</span>
                          </span>
                          {rec.transactionReference && (
                            <div className="text-[9px] font-mono text-slate-400 mt-0.5 truncate max-w-[120px] mx-auto">
                              {rec.transactionReference}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setSelectedPayslip(rec)}
                            className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-cyan-300 border border-blue-500/30 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Payslip</span>
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {rec.paymentStatus !== 'paid' && (
                              <button
                                onClick={() => handleDisburse(rec)}
                                className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold cursor-pointer"
                              >
                                Disburse
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm(`Remove salary voucher for ${rec.employeeName}?`)) {
                                  deleteSalaryRecord(rec.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Staff Master Directory SubTab */}
      {activeSubTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffMembers.map(staff => (
            <div 
              key={staff.id} 
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-white text-sm">{staff.fullName}</div>
                  <div className="text-xs font-mono text-cyan-400">{staff.employeeId}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  staff.isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {staff.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div><strong className="text-slate-400">Designation:</strong> {staff.designation}</div>
                <div><strong className="text-slate-400">Department:</strong> {staff.department}</div>
                <div><strong className="text-slate-400">Email:</strong> {staff.email}</div>
              </div>

              {/* Salary Breakdown Box */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Base Salary:</span>
                  <span className="font-mono font-bold text-white">₹{staff.baseSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>HRA + Special Allowances:</span>
                  <span className="font-mono">₹{(staff.hraAllowance + staff.specialAllowance).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-slate-700">
                  <span>Gross Monthly CTC:</span>
                  <span className="font-mono">₹{(staff.baseSalary + staff.hraAllowance + staff.specialAllowance).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Statutory flags */}
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className={`px-1.5 py-0.5 rounded ${staff.pfApplicable ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800'}`}>
                  PF: {staff.pfApplicable ? 'Yes (12%)' : 'No'}
                </span>
                <span className={`px-1.5 py-0.5 rounded ${staff.panNumber ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800'}`}>
                  PAN: {staff.panNumber || 'N/A'}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleOpenEditStaff(staff)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove staff member ${staff.fullName}?`)) {
                      deleteStaffMember(staff.id);
                    }
                  }}
                  className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Staff Member Add/Edit Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                {editingStaff ? 'Edit Staff Profile' : 'Register New Staff Member'}
              </h3>
              <button onClick={() => setShowStaffModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={e => setEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rahul@fusionforgecreation.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design & UI/UX">Design & UI/UX</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Sales & Accounts">Sales & Accounts</option>
                    <option value="Operations & HR">Operations & HR</option>
                  </select>
                </div>
              </div>

              {/* Compensation Structure */}
              <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 space-y-3">
                <div className="font-bold text-white text-xs">Monthly Compensation Structure (₹)</div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Basic Salary *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={baseSalary}
                      onChange={e => setBaseSalary(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">HRA Allowance</label>
                    <input
                      type="number"
                      min={0}
                      value={hraAllowance}
                      onChange={e => setHraAllowance(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Special Allowance</label>
                    <input
                      type="number"
                      min={0}
                      value={specialAllowance}
                      onChange={e => setSpecialAllowance(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Bank & Tax Details */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Bank Account #</label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={e => setBankAccountNumber(e.target.value)}
                    placeholder="912345678901"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={bankIfsc}
                    onChange={e => setBankIfsc(e.target.value.toUpperCase())}
                    placeholder="HDFC0000123"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">PAN Card #</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={e => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Statutory Checkboxes */}
              <div className="flex items-center space-x-6 p-2 rounded-xl bg-slate-800/40">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pfApplicable}
                    onChange={e => setPfApplicable(e.target.checked)}
                    className="rounded text-cyan-500 w-4 h-4"
                  />
                  <span className="text-slate-300">EPF Applicable (12% of Basic)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded text-cyan-500 w-4 h-4"
                  />
                  <span className="text-slate-300">Active Employment Status</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold"
                >
                  {editingStaff ? 'Update Staff Member' : 'Register Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Payslip Printable Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white text-slate-900 p-8 shadow-2xl space-y-6 my-8 print:m-0 print:p-0 print:shadow-none print:w-full">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  {agencyConfig.name || 'FUSION FORGE CREATION'}
                </h2>
                <p className="text-xs text-slate-600 max-w-sm">
                  {agencyConfig.address || 'Patia, Bhubaneswar, Odisha - 751024'}
                </p>
                <div className="text-[11px] font-mono text-slate-700 font-bold mt-1">
                  GSTIN: {agencyConfig.gstin || '21AAACF9876B1Z5'}
                </div>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded">
                  Salary Slip
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1 font-mono">
                  {selectedPayslip.period}
                </div>
              </div>
            </div>

            {/* Employee Metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-3 rounded-lg bg-slate-50">
              <div>
                <div><span className="text-slate-500">Employee Name:</span> <strong className="text-slate-900">{selectedPayslip.employeeName}</strong></div>
                <div><span className="text-slate-500">Employee ID:</span> <strong className="font-mono text-slate-900">
                  {staffMembers.find(s => s.id === selectedPayslip.employeeId)?.employeeId || 'FFC-EMP-001'}
                </strong></div>
                <div><span className="text-slate-500">Designation:</span> <strong className="text-slate-900">
                  {staffMembers.find(s => s.id === selectedPayslip.employeeId)?.designation || 'Software Engineer'}
                </strong></div>
              </div>
              <div>
                <div><span className="text-slate-500">Department:</span> <strong className="text-slate-900">
                  {staffMembers.find(s => s.id === selectedPayslip.employeeId)?.department || 'Engineering'}
                </strong></div>
                <div><span className="text-slate-500">Payment Status:</span> <strong className="uppercase text-emerald-700 font-bold">{selectedPayslip.paymentStatus}</strong></div>
                <div><span className="text-slate-500">Bank Transfer Ref:</span> <strong className="font-mono text-slate-900">{selectedPayslip.transactionReference || 'NEFT-PROCESSED'}</strong></div>
              </div>
            </div>

            {/* Earnings vs Deductions Table */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Earnings */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-900 border-b border-slate-200">
                  Earnings (₹)
                </div>
                <div className="p-3 space-y-1.5 divide-y divide-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Basic Salary</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.basicSalary.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">House Rent Allowance (HRA)</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.hra.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Special Allowance</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.specialAllowance.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedPayslip.bonusOrIncentive > 0 && (
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-600">Performance Bonus</span>
                      <span className="font-mono font-bold">₹{selectedPayslip.bonusOrIncentive.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t-2 border-slate-300 font-black text-slate-900">
                    <span>Total Gross Earnings</span>
                    <span className="font-mono">₹{selectedPayslip.grossSalary.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-900 border-b border-slate-200">
                  Deductions (₹)
                </div>
                <div className="p-3 space-y-1.5 divide-y divide-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Provident Fund (EPF 12%)</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.providentFund.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Professional Tax (PT)</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.professionalTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Tax Deducted at Source (TDS)</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.tdsDeduction.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-slate-300 font-black text-rose-600">
                    <span>Total Deductions</span>
                    <span className="font-mono">₹{selectedPayslip.totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Highlight */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Net Salary Payable (Take-Home)</div>
                <div className="text-2xl font-black font-mono mt-0.5 text-emerald-400">
                  ₹{selectedPayslip.netSalary.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right text-xs text-slate-300">
                <div>Credited into Employee A/C</div>
                <div className="font-mono text-cyan-400 font-bold">{selectedPayslip.paymentDate || 'Direct Transfer'}</div>
              </div>
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-6 border-t border-slate-200 text-xs">
              <div className="text-center">
                <div className="h-10"></div>
                <div className="border-t border-slate-400 pt-1 w-44 font-semibold text-slate-700">
                  Employee Signature
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[11px] text-blue-700 font-bold italic mb-1">
                  Manoj Satapathy (Authorized Signatory)
                </div>
                <div className="border-t border-slate-400 pt-1 w-52 font-semibold text-slate-700">
                  For Fusion Forge Creation
                </div>
              </div>
            </div>

            {/* Print & Close Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Payslip</span>
              </button>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
