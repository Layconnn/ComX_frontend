import { useState } from "react";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateFields = (fields: { [key: string]: string }) => {
    const newErrors: FormErrors = {};

    // First Name Validation (optional)
    if ("firstName" in fields && !fields.firstName) {
      newErrors.firstName = "Your First Name is required.";
    } else if ("firstName" in fields && /^\d/.test(fields.firstName)) {
      newErrors.firstName = "Your First Name cannot start with a number.";
    }

    // Last Name Validation (optional)
    if ("lastName" in fields && !fields.lastName) {
      newErrors.lastName = "Your Last Name is required.";
    } else if ("lastName" in fields && /^\d/.test(fields.lastName)) {
      newErrors.lastName = "Your Last Name cannot start with a number.";
    }

    // Email Validation (optional)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if ("email" in fields) {
      if (!fields.email) {
        newErrors.email = "Your Email is required.";
      } else if (!emailRegex.test(fields.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    // Phone Number Validation (optional)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if ("phone" in fields && !fields.phone) {
      newErrors.phone = "Your Phone Number is required.";
    } else if (
      "phone" in fields &&
      fields.phone &&
      !phoneRegex.test(fields.phone)
    ) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    // Password Validation (only if the field is present and optional)
    if ("password" in fields && !fields.password) {
      newErrors.password = "Your Password is required.";
    } else if (
      "password" in fields &&
      fields.password &&
      fields.password.length < 6
    ) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Confirm Password Validation (only if the field is present and optional)
    if ("confirmPassword" in fields && !fields.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (
      "confirmPassword" in fields &&
      fields.confirmPassword &&
      fields.confirmPassword !== fields.password
    ) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    // Returns true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  };

  return {
    errors,
    validateFields,
    clearError,
  };
};
