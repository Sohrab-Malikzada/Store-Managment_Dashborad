

const STORAGE_KEY = 'employee_advances';
const DEDUCTIONS_KEY = 'advance_deductions';

export const getEmployeeAdvances = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveEmployeeAdvances = (advances) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(advances));
};

export const addAdvancePayment = (employeeId, amount, reason) => {
  const advances = getEmployeeAdvances();
  const newAdvance = {
    id: `ADV-${Date.now()}`,
    employeeId,
    amount,
    date: new Date().toISOString().split('T')[0],
    reason,
    status: 'approved',
    remainingBalance: amount
  };
  
  advances.push(newAdvance);
  saveEmployeeAdvances(advances);
  return newAdvance;
};

export const getEmployeeAdvanceBalance = (employeeId) => {
  const advances = getEmployeeAdvances();
  return advances
    .filter(advance => advance.employeeId === employeeId && advance.status === 'approved')
    .reduce((total, advance) => total + advance.remainingBalance, 0);
};

export const getEmployeeAdvanceHistory = (employeeId) => {
  const advances = getEmployeeAdvances();
  return advances.filter(advance => advance.employeeId === employeeId);
};

export const deductFromAdvance = (employeeId, deductionAmount, payrollId) => {
  const advances = getEmployeeAdvances();
  let remainingDeduction = deductionAmount;
  
  const employeeAdvances = advances
    .filter(advance => advance.employeeId === employeeId && advance.remainingBalance > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  for (const advance of employeeAdvances) {
    if (remainingDeduction <= 0) break;
    
    const deductFromThisAdvance = Math.min(advance.remainingBalance, remainingDeduction);
    advance.remainingBalance -= deductFromThisAdvance;
    remainingDeduction -= deductFromThisAdvance;
  }
  
  saveEmployeeAdvances(advances);
  
  const deductions = getAdvanceDeductions();
  deductions.push({
    employeeId,
    payrollId,
    deductionAmount,
    deductionDate: new Date().toISOString().split('T')[0]
  });
  localStorage.setItem(DEDUCTIONS_KEY, JSON.stringify(deductions));
};

export const getAdvanceDeductions = () => {
  const stored = localStorage.getItem(DEDUCTIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getTotalAdvancesGiven = () => {
  const advances = getEmployeeAdvances();
  return advances
    .filter(advance => advance.status === 'approved')
    .reduce((total, advance) => total + advance.amount, 0);
};

export const getTotalOutstandingAdvances = () => {
  const advances = getEmployeeAdvances();
  return advances
    .filter(advance => advance.status === 'approved')
    .reduce((total, advance) => total + advance.remainingBalance, 0);
};
