/**
 * RentEase Validators
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

const isNotEmpty = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return true;
};

const isPositiveNumber = (val) => {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !isNaN(num) && num > 0;
};

const isNonNegativeNumber = (val) => {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !isNaN(num) && num >= 0;
};

const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

const isDateRangeValid = (startDate, endDate) => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return false;
  return new Date(startDate) <= new Date(endDate);
};

/**
 * Validates an object against a rules schema.
 * Returns { isValid: boolean, errors: { [field]: string } }
 */
const validate = (data, rules) => {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];

    if (fieldRules.required && !isNotEmpty(value)) {
      errors[field] = fieldRules.message || `${fieldRules.label || field} is required.`;
      continue;
    }

    if (fieldRules.email && isNotEmpty(value) && !isValidEmail(value)) {
      errors[field] = 'Please enter a valid email address.';
      continue;
    }

    if (fieldRules.positiveNumber && isNotEmpty(value) && !isPositiveNumber(value)) {
      errors[field] = 'Please enter a valid positive number.';
      continue;
    }

    if (fieldRules.minLength && isNotEmpty(value) && String(value).length < fieldRules.minLength) {
      errors[field] = `Must be at least ${fieldRules.minLength} characters.`;
      continue;
    }

    if (fieldRules.custom) {
      const customErr = fieldRules.custom(value, data);
      if (customErr) {
        errors[field] = customErr;
        continue;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

window.RentEase = window.RentEase || {};
window.RentEase.validators = {
  isValidEmail,
  isNotEmpty,
  isPositiveNumber,
  isNonNegativeNumber,
  isValidDate,
  isDateRangeValid,
  validate
};

const Validators = {
  ...window.RentEase.validators,
  isEmail: isValidEmail,
  isEmpty: (v) => !isNotEmpty(v),
  minLength: (v, len) => String(v).length >= len
};

if (typeof window !== 'undefined') {
  window.Validators = Validators;
}
if (typeof global !== 'undefined') {
  global.Validators = Validators;
}
