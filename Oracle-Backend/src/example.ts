// src/example.ts

// A simple function that takes a name and returns a greeting message.
function greet(name: string): string {
  return `Hello, ${name}! Welcome to TypeScript.`;
}

// Testing the function
const userName = 'Alice';  // Renamed from 'name' to 'userName'

console.log(greet(name));  // Output: Hello, Alice! Welcome to TypeScript.

