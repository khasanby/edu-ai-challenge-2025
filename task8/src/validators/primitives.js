export const isString = (value) => {
  const errors = [];
  if (value === undefined || value === null) {
    errors.push('Value is required');
  } else if (typeof value !== 'string') {
    errors.push('Value must be a string');
  }
  return { valid: errors.length === 0, errors };
};

export const isNumber = (value) => {
  const errors = [];
  if (value === undefined || value === null) {
    errors.push('Value is required');
  } else if (typeof value !== 'number' || isNaN(value)) {
    errors.push('Value must be a number');
  }
  return { valid: errors.length === 0, errors };
};

export const isBoolean = (value) => {
  const errors = [];
  if (value === undefined || value === null) {
    errors.push('Value is required');
  } else if (typeof value !== 'boolean') {
    errors.push('Value must be a boolean');
  }
  return { valid: errors.length === 0, errors };
};

// Helper function to make validators optional
export const optional = (validator) => (value) => {
  if (value === undefined || value === null) {
    return { valid: true, errors: [] };
  }
  return validator(value);
};

// Helper function to add custom error messages
export const withMessage = (validator, message) => (value) => {
  const result = validator(value);
  if (!result.valid) {
    return { valid: false, errors: [message] };
  }
  return result;
}; 