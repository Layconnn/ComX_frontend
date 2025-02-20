import { useState } from "react";

interface FormErrors {
  companyName?: string;
  businessType?: string;
  dateOfIncorporation?: string;
  companyEmail?: string;
  password?: string;
  confirmPassword?: string;
}

export const useCompanyFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateFields = (fields: { [key: string]: string }) => {
    const newErrors: FormErrors = {};

    // Company Name Validation (optional - only validate if provided)
    if ("companyName" in fields) {
      if (!fields.companyName) {
        newErrors.companyName = "Company Name is required.";
      } else if (/^\d/.test(fields.companyName)) {
        newErrors.companyName = "Company Name cannot start with a number.";
      }
    }

    // Business Type Validation (optional)
    if ("businessType" in fields) {
      if (!fields.businessType) {
        newErrors.businessType = "Business Type is required.";
      } else {
        const validTypes = ["RETAIL", "SERVICE", "MANUFACTURING"];
        if (!validTypes.includes(fields.businessType)) {
          newErrors.businessType = "Please select a valid Business Type.";
        }
      }
    }

    // Date Validation (optional)
    if ("dateOfIncorporation" in fields) {
      if (!fields.dateOfIncorporation) {
        newErrors.dateOfIncorporation = "Date is required.";
      } else {
        if (isNaN(Date.parse(fields.dateOfIncorporation))) {
          newErrors.dateOfIncorporation = "Please enter a valid date.";
        }
      }
    }

    // Company Email Validation (optional)
    if ("companyEmail" in fields) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!fields.companyEmail) {
        newErrors.companyEmail = "Company Email is required.";
      } else if (!emailRegex.test(fields.companyEmail)) {
        newErrors.companyEmail = "Please enter a valid email address.";
      }
    }

    // Password Validation (optional)
    if ("password" in fields) {
      if (!fields.password) {
        newErrors.password = "Your Password is required.";
      } else if (fields.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long.";
      }
    }

    // Confirm Password Validation (optional)
    if ("confirmPassword" in fields) {
      if (!fields.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password.";
      } else if (
        fields.password &&
        fields.confirmPassword !== fields.password
      ) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
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
