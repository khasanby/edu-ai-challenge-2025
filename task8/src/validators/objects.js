export const object = (schema) => (value) => {
  const errors = [];
  if (value === undefined || value === null) {
    errors.push('Value is required');
  } else if (typeof value !== 'object' || Array.isArray(value)) {
    errors.push('Value must be an object');
  } else {
    // Validate each field in the schema
    Object.entries(schema).forEach(([key, validator]) => {
      const result = validator(value[key]);
      if (!result.valid) {
        errors.push(`${key}: ${result.errors.join(', ')}`);
      }
    });

    // Check for unexpected properties
    const schemaKeys = new Set(Object.keys(schema));
    Object.keys(value).forEach(key => {
      if (!schemaKeys.has(key)) {
        errors.push(`Unexpected property: ${key}`);
      }
    });
  }
  return { valid: errors.length === 0, errors };
};

// Helper function to make object properties optional
export const partial = (schema) => {
  const optionalSchema = {};
  Object.entries(schema).forEach(([key, validator]) => {
    optionalSchema[key] = (value) => {
      if (value === undefined || value === null) {
        return { valid: true, errors: [] };
      }
      return validator(value);
    };
  });
  return object(optionalSchema);
}; 