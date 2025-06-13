import { Schema } from './src/schema';
import * as readline from 'readline';

// Define a user profile schema with various field types
const userProfileSchema = Schema.object({
  // Required fields
  username: Schema.string().minLength(3),
  age: Schema.number().min(18).max(120).integer(),
  isActive: Schema.boolean(),
  
  // Optional fields
  email: Schema.string().optional(),
  tags: Schema.array(Schema.string()).optional(),
  preferences: Schema.object({
    theme: Schema.string().optional(),
    notifications: Schema.boolean().optional()
  }).optional()
});

// Example valid user data
const validUser = {
  username: "johndoe",
  age: 25,
  isActive: true,
  email: "john@example.com",
  tags: ["developer", "typescript"],
  preferences: {
    theme: "dark",
    notifications: true
  }
};

// Example invalid user data
const invalidUser = {
  username: "jo", // Too short
  age: 15, // Too young
  isActive: "yes", // Wrong type
  email: "invalid-email", // Invalid email format
  tags: [123, true], // Wrong types in array
  preferences: {
    theme: 123, // Wrong type
    notifications: "yes" // Wrong type
  }
};

// Function to validate and display results
function validateAndDisplay(data: any, label: string) {
  console.log(`\n=== ${label} ===`);
  const result = userProfileSchema.validate(data);
  
  if (result.valid) {
    console.log("✅ VALID");
  } else {
    console.log("❌ INVALID");
    console.log("Errors:");
    result.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user and get input
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Function to convert string input to appropriate type
function convertInput(field: string, value: string): any {
  switch (field) {
    case 'age':
      return parseInt(value, 10);
    case 'isActive':
      return value.toLowerCase() === 'true' || value.toLowerCase() === 'yes' || value.toLowerCase() === 'y';
    case 'tags':
      return value ? value.split(',').map(tag => tag.trim()) : undefined;
    case 'preferences.notifications':
      return value.toLowerCase() === 'true' || value.toLowerCase() === 'yes' || value.toLowerCase() === 'y';
    default:
      return value || undefined;
  }
}

// Function to prompt user for input and validate
async function promptAndValidate() {
  console.log("\n=== Interactive User Input ===");
  console.log("Please enter the following information (press Enter to skip optional fields):\n");

  const username = await prompt("Username (required): ");
  const age = await prompt("Age (required): ");
  const isActive = await prompt("Is Active? (required, yes/no): ");
  const email = await prompt("Email (optional): ");
  const tags = await prompt("Tags (optional, comma-separated): ");
  const theme = await prompt("Theme (optional): ");
  const notifications = await prompt("Notifications enabled? (optional, yes/no): ");

  const userInput = {
    username: convertInput('username', username),
    age: convertInput('age', age),
    isActive: convertInput('isActive', isActive),
    email: convertInput('email', email),
    tags: convertInput('tags', tags),
    preferences: {
      theme: convertInput('theme', theme),
      notifications: convertInput('preferences.notifications', notifications)
    }
  };

  validateAndDisplay(userInput, "User Input Validation");
  rl.close();
}

// Main function to run validations
async function main() {
  console.log("Validation Library Demo\n");
  
  // Run static examples
  validateAndDisplay(validUser, "Valid User Data");
  validateAndDisplay(invalidUser, "Invalid User Data");
  
  // Run interactive example
  await promptAndValidate();
}

// Run the demo
main().catch(console.error); 