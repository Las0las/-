import type { CandidateFormData, ValidationErrors } from '../types';

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): boolean {
  if (!phone || phone.length < 10) return false;
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone);
}

/**
 * Validate URL format
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"]/g, (char) => {
      // Escape potentially dangerous characters
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      };
      return escapeMap[char] || char;
    });
}

/**
 * Validate candidate form data
 */
export function validateCandidateForm(formData: Partial<CandidateFormData>): ValidationErrors {
  const errors: ValidationErrors = {};

  // Required fields
  if (!formData.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (formData.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  } else if (formData.firstName.length > 50) {
    errors.firstName = 'First name must be less than 50 characters';
  }

  if (!formData.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (formData.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  } else if (formData.lastName.length > 50) {
    errors.lastName = 'Last name must be less than 50 characters';
  }

  // Email validation
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation (optional but must be valid if provided)
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number (at least 10 digits)';
  }

  // Title validation
  if (!formData.title?.trim()) {
    errors.title = 'Job title is required';
  } else if (formData.title.length < 2) {
    errors.title = 'Job title must be at least 2 characters';
  } else if (formData.title.length > 100) {
    errors.title = 'Job title must be less than 100 characters';
  }

  // LinkedIn URL validation (optional but must be valid if provided)
  if (formData.linkedin) {
    if (!formData.linkedin.startsWith('http://') && !formData.linkedin.startsWith('https://')) {
      errors.linkedin = 'LinkedIn URL must start with http:// or https://';
    } else if (!validateURL(formData.linkedin)) {
      errors.linkedin = 'Please enter a valid LinkedIn URL';
    }
  }

  // Experience validation
  if (formData.experience !== undefined) {
    if (formData.experience < 0) {
      errors.experience = 'Experience cannot be negative';
    } else if (formData.experience > 70) {
      errors.experience = 'Experience seems unusually high';
    }
  }

  // Rating validation
  if (formData.rating !== undefined) {
    if (formData.rating < 1 || formData.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
  }

  // Salary validation
  if (formData.salary) {
    if (formData.salary.min < 0) {
      errors.salaryMin = 'Minimum salary cannot be negative';
    }
    if (formData.salary.max < 0) {
      errors.salaryMax = 'Maximum salary cannot be negative';
    }
    if (formData.salary.min > formData.salary.max) {
      errors.salary = 'Minimum salary cannot be greater than maximum salary';
    }
  }

  return errors;
}

/**
 * Check if validation errors object is empty
 */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Parse skills string into array
 */
export function parseSkills(skills: string | string[]): string[] {
  if (Array.isArray(skills)) {
    return skills
      .map((skill) => sanitizeInput(skill).trim())
      .filter((skill) => skill.length > 0);
  }

  return skills
    .split(',')
    .map((skill) => sanitizeInput(skill).trim())
    .filter((skill) => skill.length > 0);
}

/**
 * Format skills array to display string
 */
export function formatSkills(skills: string[]): string {
  return skills.join(', ');
}
