export interface IndianState {
  code: string;
  name: string;
}

export const INDIAN_STATES: IndianState[] = [
  { code: '01', name: 'Jammu & Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '25', name: 'Daman & Diu' },
  { code: '26', name: 'Dadra & Nagar Haveli' },
  { code: '27', name: 'Maharashtra' },
  { code: '28', name: 'Andhra Pradesh (Old)' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' },
  { code: '35', name: 'Andaman & Nicobar Islands' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' },
  { code: '38', name: 'Ladakh' },
  { code: '97', name: 'Other Territory' }
];

export const getStateCodeByName = (stateName: string): string => {
  if (!stateName) return '';
  const clean = stateName.trim().toLowerCase();
  const found = INDIAN_STATES.find(
    s => s.name.toLowerCase() === clean ||
         clean.includes(s.name.toLowerCase()) ||
         s.name.toLowerCase().includes(clean)
  );
  return found ? found.code : '';
};

export const getStateNameByCode = (code: string): string => {
  if (!code) return '';
  const cleanCode = code.trim().padStart(2, '0');
  const found = INDIAN_STATES.find(s => s.code === cleanCode);
  return found ? found.name : '';
};

export const formatPlaceOfSupply = (stateName: string, stateCode?: string): string => {
  if (!stateName && !stateCode) return '';
  const code = stateCode ? stateCode.padStart(2, '0') : getStateCodeByName(stateName);
  const name = stateName || getStateNameByCode(code);
  return code && name ? `${code}-${name}` : (name || code || '');
};

// Standard 15-character GSTIN Regex: 2 digits + 10-char PAN + 1 entity num + 'Z' + 1 checksum
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export interface GstinValidationResult {
  isValid: boolean;
  isUrp: boolean;
  stateCode: string;
  stateName: string;
  placeOfSupply: string;
  pan: string;
  status: 'valid' | 'invalid_format' | 'incomplete' | 'unregistered' | 'invalid_state';
  message: string;
}

export const validateAndDeriveGstin = (gstinInput?: string | null): GstinValidationResult => {
  if (!gstinInput || !gstinInput.trim() || gstinInput.trim().toUpperCase() === 'URP' || gstinInput.trim() === '—') {
    return {
      isValid: false,
      isUrp: true,
      stateCode: '',
      stateName: '',
      placeOfSupply: '',
      pan: '',
      status: 'unregistered',
      message: 'Unregistered Person (URP) / Non-GST Client'
    };
  }

  const clean = gstinInput.trim().toUpperCase();

  // Extract first 2 digits
  let stateCode = '';
  let stateName = '';
  let placeOfSupply = '';
  let pan = '';

  if (clean.length >= 2) {
    const rawCode = clean.substring(0, 2);
    if (/^\d{2}$/.test(rawCode)) {
      stateCode = rawCode;
      stateName = getStateNameByCode(stateCode);
      if (stateName) {
        placeOfSupply = `${stateCode}-${stateName}`;
      }
    }
  }

  if (clean.length >= 12) {
    pan = clean.substring(2, 12);
  }

  if (clean.length < 15) {
    return {
      isValid: false,
      isUrp: false,
      stateCode,
      stateName,
      placeOfSupply,
      pan,
      status: 'incomplete',
      message: `Incomplete GSTIN (${clean.length}/15 characters)`
    };
  }

  if (!stateName) {
    return {
      isValid: false,
      isUrp: false,
      stateCode,
      stateName: '',
      placeOfSupply: '',
      pan,
      status: 'invalid_state',
      message: `Invalid State Code [${stateCode}] in GSTIN`
    };
  }

  if (!GSTIN_REGEX.test(clean)) {
    return {
      isValid: false,
      isUrp: false,
      stateCode,
      stateName,
      placeOfSupply,
      pan,
      status: 'invalid_format',
      message: 'Invalid GSTIN format pattern (Expected: 2-digit code + PAN + 1 char + Z + check char)'
    };
  }

  return {
    isValid: true,
    isUrp: false,
    stateCode,
    stateName,
    placeOfSupply,
    pan,
    status: 'valid',
    message: `Verified GSTIN • ${stateName} (${stateCode})`
  };
};
