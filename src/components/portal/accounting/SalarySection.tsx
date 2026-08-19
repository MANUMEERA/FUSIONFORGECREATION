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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8E0F0] shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('payroll')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'payroll'
                ? 'bg-[#8E2D9D] text-white shadow-xs'
                : 'text-[#5F5A72] hover:text-[#1E1B2E] bg-slate-100'
            }`}
          >
            Payroll Cycles & Payslips
          </button>
          <button
            onClick={() => setActiveSubTab('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'staff'
                ? 'bg-[#8E2D9D] text-white shadow-xs'
                : 'text-[#5F5A72] hover:text-[#1E1B2E] bg-slate-100'
            }`}
          >
            Staff Directory & Compensation ({staffMembers.length})
          </button>
        </div>

        {activeSubTab === 'payroll' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#E8E0F0] text-xs">
              <Calendar className="w-3.5 h-3.5 text-[#8E2D9D]" />
              <select
                value={selectedPeriodMonth}
                onChange={e => setSelectedPeriodMonth(e.target.value)}
                className="bg-transparent text-[#1E1B2E] font-bold outline-none cursor-pointer"
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
                className="bg-transparent text-[#1E1B2E] font-bold outline-none cursor-pointer"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>

            <button
              onClick={handleRunPayroll}
              className="px-3.5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run Payroll</span>
            </button>
          </div>
        )}

        {activeSubTab === 'staff' && (
          <button
            onClick={handleOpenAddStaff}
            className="px-4 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
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
            <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
              <div className="text-xs text-[#8E2D9D] font-semibold mb-1">Total Gross Salary</div>
              <div className="text-2xl font-black text-[#1E1B2E] font-mono">₹{totalGrossPayroll.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-[#817B91] mt-1">{currentPeriodRecords.length} staff processed</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
              <div className="text-xs text-[#059669] font-semibold mb-1">Net Take-Home Disbursed</div>
              <div className="text-2xl font-black text-[#059669] font-mono">₹{totalNetDisbursements.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-[#059669] mt-1">Direct Bank Transfers</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
              <div className="text-xs text-amber-700 font-semibold mb-1">Statutory Deductions (PF/PT/TDS)</div>
              <div className="text-2xl font-black text-amber-700 font-mono">₹{totalDeductions.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-[#817B91] mt-1">EPFO & Govt Tax Retentions</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
              <div className="text-xs text-[#8E2D9D] font-semibold mb-1">Disbursement Status</div>
              <div className="text-2xl font-black text-[#8E2D9D] font-mono">{paidCount} / {currentPeriodRecords.length}</div>
              <div className="text-[11px] text-[#817B91] mt-1">Vouchers Completed</div>
            </div>
          </div>

          {/* Salary Records Table */}
          <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5FF] text-[#5F5A72] font-bold border-b border-[#E8E0F0] uppercase tracking-wider text-[10px]">
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
                <tbody className="divide-y divide-[#E8E0F0]">
                  {currentPeriodRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#817B91]">
                        No payroll vouchers generated for this cycle yet. Click <strong>"Run Payroll"</strong> above to auto-generate salary slips from the Staff Directory.
                      </td>
                    </tr>
                  ) : (
                    currentPeriodRecords.map(rec => (
                      <tr key={rec.id} className="hover:bg-[#FAF5FF] transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-[#1E1B2E]">{rec.employeeName}</div>
                          <div className="text-[10px] font-mono text-[#8E2D9D]">
                            {staffMembers.find(s => s.id === rec.employeeId)?.employeeId || 'FFC-EMP'}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-[#1E1B2E] font-medium">
                            {staffMembers.find(s => s.id === rec.employeeId)?.designation || 'Engineering Staff'}
                          </div>
                          <div className="text-[10px] text-[#817B91]">
                            {staffMembers.find(s => s.id === rec.employeeId)?.department || 'Core Tech'}
                          </div>
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-[#1E1B2E]">
                          ₹{rec.grossSalary.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="font-mono font-bold text-amber-700">
                            -₹{rec.totalDeductions.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[9px] text-[#817B91] font-mono">
                            PF: ₹{rec.providentFund} | PT: ₹{rec.professionalTax} | TDS: ₹{rec.tdsDeduction}
                          </div>
                        </td>
                        <td className="p-3.5 text-right font-mono font-black text-[#059669] text-sm">
                          ₹{rec.netSalary.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                            rec.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {rec.paymentStatus === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{rec.paymentStatus}</span>
                          </span>
                          {rec.transactionReference && (
                            <div className="text-[9px] font-mono text-[#817B91] mt-0.5 truncate max-w-[120px] mx-auto">
                              {rec.transactionReference}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setSelectedPayslip(rec)}
                            className="px-2.5 py-1 rounded-lg bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC]/40 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
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
                                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#059669] border border-emerald-200 text-[10px] font-bold cursor-pointer"
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
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-[#817B91] hover:text-red-600 border border-[#E8E0F0] cursor-pointer"
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
              className="p-5 rounded-2xl bg-white border border-[#E8E0F0] hover:border-[#8E2D9D]/40 shadow-xs transition-all space-y-3 relative group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-[#1E1B2E] text-sm">{staff.fullName}</div>
                  <div className="text-xs font-mono text-[#8E2D9D]">{staff.employeeId}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  staff.isActive 
                    ? 'bg-emerald-50 text-[#059669] border border-emerald-200' 
                    : 'bg-slate-100 text-[#817B91] border border-slate-200'
                }`}>
                  {staff.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="text-xs text-[#5F5A72] space-y-1">
                <div><strong className="text-[#1E1B2E]">Designation:</strong> {staff.designation}</div>
                <div><strong className="text-[#1E1B2E]">Department:</strong> {staff.department}</div>
                <div><strong className="text-[#1E1B2E]">Email:</strong> {staff.email}</div>
              </div>

              {/* Salary Breakdown Box */}
              <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs space-y-1">
                <div className="flex justify-between text-[#5F5A72]">
                  <span>Base Salary:</span>
                  <span className="font-mono font-bold text-[#1E1B2E]">₹{staff.baseSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#817B91] text-[11px]">
                  <span>HRA + Special Allowances:</span>
                  <span className="font-mono">₹{(staff.hraAllowance + staff.specialAllowance).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#059669] font-bold pt-1 border-t border-[#E8E0F0]">
                  <span>Gross Monthly CTC:</span>
                  <span className="font-mono">₹{(staff.baseSalary + staff.hraAllowance + staff.specialAllowance).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Statutory flags */}
              <div className="flex items-center gap-2 text-[10px] text-[#5F5A72]">
                <span className={`px-1.5 py-0.5 rounded ${staff.pfApplicable ? 'bg-purple-50 text-[#8E2D9D] border border-purple-200' : 'bg-slate-100'}`}>
                  PF: {staff.pfApplicable ? 'Yes (12%)' : 'No'}
                </span>
                <span className={`px-1.5 py-0.5 rounded ${staff.panNumber ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100'}`}>
                  PAN: {staff.panNumber || 'N/A'}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E0F0]">
                <button
                  onClick={() => handleOpenEditStaff(staff)}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#5F5A72] text-xs font-semibold cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove staff member ${staff.fullName}?`)) {
                      deleteStaffMember(staff.id);
                    }
                  }}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-red-50 text-[#817B91] hover:text-red-600 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white border border-[#E8E0F0] p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0F0]">
              <h3 className="text-base font-bold text-[#1E1B2E] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#8E2D9D]" />
                {editingStaff ? 'Edit Staff Profile' : 'Register New Staff Member'}
              </h3>
              <button onClick={() => setShowStaffModal(false)} className="p-1.5 rounded-lg text-[#817B91] hover:text-[#1E1B2E] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={e => setEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rahul@fusionforgecreation.com"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
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
              <div className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] space-y-3">
                <div className="font-bold text-[#1E1B2E] text-xs">Monthly Compensation Structure (₹)</div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#5F5A72] text-[11px] mb-1">Basic Salary *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={baseSalary}
                      onChange={e => setBaseSalary(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5F5A72] text-[11px] mb-1">HRA Allowance</label>
                    <input
                      type="number"
                      min={0}
                      value={hraAllowance}
                      onChange={e => setHraAllowance(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5F5A72] text-[11px] mb-1">Special Allowance</label>
                    <input
                      type="number"
                      min={0}
                      value={specialAllowance}
                      onChange={e => setSpecialAllowance(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Bank & Tax Details */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Bank Account #</label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={e => setBankAccountNumber(e.target.value)}
                    placeholder="912345678901"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={bankIfsc}
                    onChange={e => setBankIfsc(e.target.value.toUpperCase())}
                    placeholder="HDFC0000123"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">PAN Card #</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={e => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              {/* Statutory Checkboxes */}
              <div className="flex items-center space-x-6 p-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0]">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pfApplicable}
                    onChange={e => setPfApplicable(e.target.checked)}
                    className="rounded text-[#8E2D9D] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[#1E1B2E]">EPF Applicable (12% of Basic)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded text-[#8E2D9D] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[#1E1B2E]">Active Employment Status</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white text-[#1E1B2E] p-8 shadow-xl space-y-6 my-8 print:m-0 print:p-0 print:shadow-none print:w-full border border-[#E8E0F0]">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-[#1E1B2E] pb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-[#1E1B2E] uppercase">
                  {agencyConfig.name || 'FUSION FORGE CREATION'}
                </h2>
                <p className="text-xs text-[#5F5A72] max-w-sm">
                  {agencyConfig.address || 'Patia, Bhubaneswar, Odisha - 751024'}
                </p>
                <div className="text-[11px] font-mono text-[#1E1B2E] font-bold mt-1">
                  GSTIN: {agencyConfig.gstin || '21AAACF9876B1Z5'}
                </div>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 bg-[#8E2D9D] text-white text-xs font-black uppercase tracking-wider rounded">
                  Salary Slip
                </div>
                <div className="text-xs font-bold text-[#5F5A72] mt-1 font-mono">
                  {selectedPayslip.period}
                </div>
              </div>
            </div>

            {/* Employee Metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-[#E8E0F0] p-3 rounded-lg bg-[#FAF5FF]">
              <div>
                <div><span className="text-[#5F5A72]">Employee Name:</span> <strong className="text-[#1E1B2E]">{selectedPayslip.employeeName}</strong></div>
                <div><span className="text-[#5F5A72]">Employee ID:</span> <strong className="font-mono text-[#1E1B2E]">
                  {staffMembers.find(s => s.id === selectedPayslip.employeeId)?.employeeId || 'FFC-EMP-001'}
                </strong></div>
                <div><span className="text-[#5F5A72]">Designation:</span> <strong className="text-[#1E1B2E]">
                  {staffMembers.find(s => s.id === selectedPayslip.employeeId)?.designation || 'Software Engineer'}
                </strong></div>
              </div>
              <div>
                <div><span className="text-[#5F5A72]">Department:</span> <strong className="text-[#1E1B2E]">
                  {staffMembers.find(s => s.id === selectedPayslip.employeeId)?.department || 'Engineering'}
                </strong></div>
                <div><span className="text-[#5F5A72]">Payment Status:</span> <strong className="uppercase text-[#059669] font-bold">{selectedPayslip.paymentStatus}</strong></div>
                <div><span className="text-[#5F5A72]">Bank Transfer Ref:</span> <strong className="font-mono text-[#1E1B2E]">{selectedPayslip.transactionReference || 'NEFT-PROCESSED'}</strong></div>
              </div>
            </div>

            {/* Earnings vs Deductions Table */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Earnings */}
              <div className="border border-[#E8E0F0] rounded-lg overflow-hidden">
                <div className="bg-[#FAF5FF] px-3 py-1.5 font-bold text-[#1E1B2E] border-b border-[#E8E0F0]">
                  Earnings (₹)
                </div>
                <div className="p-3 space-y-1.5 divide-y divide-[#E8E0F0]">
                  <div className="flex justify-between">
                    <span className="text-[#5F5A72]">Basic Salary</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.basicSalary.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#5F5A72]">House Rent Allowance (HRA)</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.hra.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#5F5A72]">Special Allowance</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.specialAllowance.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedPayslip.bonusOrIncentive > 0 && (
                    <div className="flex justify-between pt-1">
                      <span className="text-[#5F5A72]">Performance Bonus</span>
                      <span className="font-mono font-bold">₹{selectedPayslip.bonusOrIncentive.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t-2 border-[#E8E0F0] font-black text-[#1E1B2E]">
                    <span>Total Gross Earnings</span>
                    <span className="font-mono">₹{selectedPayslip.grossSalary.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="border border-[#E8E0F0] rounded-lg overflow-hidden">
                <div className="bg-[#FAF5FF] px-3 py-1.5 font-bold text-[#1E1B2E] border-b border-[#E8E0F0]">
                  Deductions (₹)
                </div>
                <div className="p-3 space-y-1.5 divide-y divide-[#E8E0F0]">
                  <div className="flex justify-between">
                    <span className="text-[#5F5A72]">Provident Fund (EPF 12%)</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.providentFund.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#5F5A72]">Professional Tax (PT)</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.professionalTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#5F5A72]">Tax Deducted at Source (TDS)</span>
                    <span className="font-mono font-bold">₹{selectedPayslip.tdsDeduction.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-[#E8E0F0] font-black text-rose-600">
                    <span>Total Deductions</span>
                    <span className="font-mono">₹{selectedPayslip.totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Highlight */}
            <div className="p-4 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#5F5A72] uppercase tracking-wider font-bold">Net Salary Payable (Take-Home)</div>
                <div className="text-2xl font-black font-mono mt-0.5 text-[#059669]">
                  ₹{selectedPayslip.netSalary.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right text-xs text-[#5F5A72]">
                <div>Credited into Employee A/C</div>
                <div className="font-mono text-[#8E2D9D] font-bold">{selectedPayslip.paymentDate || 'Direct Transfer'}</div>
              </div>
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-6 border-t border-[#E8E0F0] text-xs">
              <div className="text-center">
                <div className="h-10"></div>
                <div className="border-t border-[#817B91] pt-1 w-44 font-semibold text-[#5F5A72]">
                  Employee Signature
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[11px] text-[#8E2D9D] font-bold italic mb-1">
                  Manoj Satapathy (Authorized Signatory)
                </div>
                <div className="border-t border-[#817B91] pt-1 w-52 font-semibold text-[#5F5A72]">
                  For Fusion Forge Creation
                </div>
              </div>
            </div>

            {/* Print & Close Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E8E0F0] print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Payslip</span>
              </button>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-bold text-xs cursor-pointer"
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
