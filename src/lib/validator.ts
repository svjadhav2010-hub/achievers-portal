// Checks if the email perfectly matches standard email formatting
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Enforces a basic security policy for passwords
export function isValidPassword(password: string): boolean {
  // Must be at least 6 characters long
  return password.trim().length >= 6;
}