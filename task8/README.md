# TypeScript Validation Library

A type-safe validation library with a fluent API for TypeScript projects. This library provides a comprehensive set of validators for common data types and complex schemas, ensuring runtime type safety and data validation.

## Features

- Type-safe validation with TypeScript
- Fluent API design
- Comprehensive validator set
- High test coverage
- Zero dependencies

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

## Usage

### Basic String Validation

```typescript
import { Schema } from './src/schema';

const userSchema = Schema.string()
  .min(3)
  .max(50)
  .pattern(/^[a-zA-Z0-9_]+$/);

const result = userSchema.validate('john_doe');
if (result.success) {
  console.log('Valid username:', result.value);
} else {
  console.log('Validation errors:', result.errors);
}
```

### Complex Schema Example

```typescript
import { Schema } from './src/schema';

const userSchema = Schema.object({
  username: Schema.string().min(3).max(50),
  age: Schema.number().min(0).max(120).integer(),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  tags: Schema.array(Schema.string()),
  metadata: Schema.object({
    lastLogin: Schema.date().optional(),
    preferences: Schema.object({
      theme: Schema.string().optional(),
      notifications: Schema.boolean().optional()
    }).optional()
  }).optional()
});

const result = userSchema.validate({
  username: 'john_doe',
  age: 25,
  email: 'john@example.com',
  tags: ['user', 'premium'],
  metadata: {
    lastLogin: new Date(),
    preferences: {
      theme: 'dark'
    }
  }
});
```

## Available Validators

### Schema.string()
- `.min(length: number)`
- `.max(length: number)`
- `.pattern(regex: RegExp)`
- `.email()`
- `.url()`

### Schema.number()
- `.min(value: number)`
- `.max(value: number)`
- `.integer()`
- `.positive()`
- `.negative()`

### Schema.boolean()
- `.true()`
- `.false()`

### Schema.date()
- `.min(date: Date)`
- `.max(date: Date)`
- `.optional()`

### Schema.array()
- `.min(length: number)`
- `.max(length: number)`
- `.unique()`

### Schema.object()
- `.strict()`
- `.partial()`
- `.pick(keys: string[])`
- `.omit(keys: string[])`

## Testing

The project includes a comprehensive test suite with Jest:

```bash
# Run all tests
npx jest

# Run tests with coverage report
npx jest --coverage
```

### Test Coverage

- 92 unit tests
- 99%+ coverage across all validators
- Detailed coverage report available in `coverage/` directory
- Test report exported to `test_report.txt`

## Project Structure

```
├── src/
│   ├── validators/     # Individual validator implementations
│   └── schema.ts       # Main schema builder
├── tests/             # Test files
├── coverage/          # Coverage reports
├── dist/             # Compiled output
├── jest.config.js    # Jest configuration
└── tsconfig.json     # TypeScript configuration
```

## License

MIT License - feel free to use this library in your projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 