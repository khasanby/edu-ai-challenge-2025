export const arrayOf = (validator) => (value) => {
  const errors = [];
  if (value === undefined || value === null) {
    errors.push('Value is required');
  } else if (!Array.isArray(value)) {
    errors.push('Value must be an array');
  } else {
    value.forEach((item, index) => {
      const result = validator(item);
      if (!result.valid) {
        errors.push(`Index ${index}: ${result.errors.join(', ')}`);
      }
    });
  }
  return { valid: errors.length === 0, errors };
};

// Helper function to validate array length
export const withLength = (validator, min, max) => (value) => {
  const result = validator(value);
  if (!result.valid) return result;

  const errors = [];
  if (min !== undefined && value.length < min) {
    errors.push(`Array must have at least ${min} items`);
  }
  if (max !== undefined && value.length > max) {
    errors.push(`Array must have at most ${max} items`);
  }
  return { valid: errors.length === 0, errors: [...result.errors, ...errors] };
}; 