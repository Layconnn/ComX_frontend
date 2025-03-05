/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import axiosInstance from "@/api/axiosInstance";
import StepProgress from "@/components/stepProgress";
import FormWrapper from "@/components/formWrapper";
import { useRegistration } from "@/contexts/registrationContext";
import ButtonDiv from "@/components/button";
import FormInput from "@/components/formInput";
import ErrorMessage from "@/components/errorMessage";
import SpinnerLoader from "@/components/spinnerLoader";
import { useFormValidation } from "@/hooks/individual/useFormValidation";
import { useCompanyFormValidation } from "@/hooks/corperate/useFormValidation";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAccessToken, setGoogleEmail } from "@/redux/slices/authSlice";

export default function CompleteProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email'); 

  useEffect(() => {
    if (token) {
      // Dispatch the token to your Redux store (or set local state)
      dispatch(setAccessToken(token));
      if (email) {
        dispatch(setGoogleEmail(email));
        console.log(email)
      }
    }
  }, [token, email, dispatch]);

  // Retrieve accountType from Redux; defaults to "individual" if not set.
  const accountType =
    useSelector((state: RootState) => state.registration.accountType) ||
    "individual";

  const { currentStep, setCurrentStep } = useRegistration();
  // State for individual fields
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // State for corporate fields
  const [companyName, setCompanyName] = useState<string>("");
  const [businessType, setBusinessType] = useState<string>("");
  const [dateOfIncorporation, setDateOfIncorporation] = useState<string>("");

  // Common fields for both
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Error and loading state
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Validation hooks for individual and corporate
  const { errors, validateFields, clearError } = useFormValidation();
  const { corporateErrors, validateCorporateFields, clearCorporateError } =
    useCompanyFormValidation();

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (accountType === "individual") {
      const fields = { firstName, lastName, phone, password, confirmPassword };
      const isValid = validateFields(fields);
      if (!isValid) {
        setError(
          "Please fill in all required Individual profile fields correctly."
        );
        return;
      }
      if (!password.trim() || !confirmPassword.trim()) {
        setError("Password is required.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    } else {
      const fields = {
        companyName,
        dateOfIncorporation,
        businessType,
        password,
        confirmPassword,
      };
      const isValid = validateCorporateFields(fields);
      if (!isValid) {
        setError(
          "Please fill in all required Corporate profile fields correctly."
        );
        return;
      }
      if (!password.trim() || !confirmPassword.trim()) {
        setError("Password is required.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    console.log("Submitting password:", password);
    setError("");
    setLoading(true);

    try {
      if (accountType === "individual") {
        await axiosInstance.patch(
          "/auth/profile/individual",
          {
            firstName,
            lastName,
            phone,
            password: password.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        router.push("/register/individual/otp-validation");
      } else {
        await axiosInstance.patch(
          "/auth/profile/corporate",
          {
            companyName,
            businessType,
            dateOfIncorporation,
            password: password.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        router.push("/register/corporate/otp-verification");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Profile update failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex justify-center items-center mt-[2.375rem] mb-[1.8125rem]">
        <img src="/logo.svg" alt="ComX" />
      </div>

      {error && (
        <ErrorMessage
          message={error}
          isNotification
          onClose={() => setError("")}
          className="mb-[1.5rem] w-full"
        />
      )}

      <FormWrapper
        title="Complete Your Profile"
        className="mb-[0rem]"
        subtitle={
          accountType === "individual"
            ? "Please complete your profile with your personal details."
            : "Please complete your corporate profile details."
        }
      >
        <form onSubmit={handleSubmit} className="w-full">
          {accountType === "individual" ? (
            <>
              <FormInput
                id="firstName"
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
                className={`w-full ${errors.firstName ? "border-red-500" : ""}`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!errors.firstName}
                errorMessage={errors.firstName}
                onClose={() => clearError("firstName")}
              />
              <FormInput
                id="lastName"
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
                className={`w-full ${errors.lastName ? "border-red-500" : ""}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!errors.lastName}
                errorMessage={errors.lastName}
                onClose={() => clearError("lastName")}
              />
              <FormInput
                id="phone"
                name="phone"
                label="Phone"
                placeholder="Enter your phone number"
                className={`w-full ${errors.phone ? "border-red-500" : ""}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={!!errors.phone}
                errorMessage={errors.phone}
                onClose={() => clearError("phone")}
              />
            </>
          ) : (
            <>
              <FormInput
                id="companyName"
                name="companyName"
                label="Company Name"
                placeholder="Enter your company name"
                className={`w-full ${
                  corporateErrors.companyName ? "border-red-500" : ""
                }`}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                error={!!corporateErrors.companyName}
                errorMessage={corporateErrors.companyName}
                onClose={() => clearCorporateError("companyName")}
              />
              <div className="mb-5">
                <label className="text-[0.875rem] leading-[1.025625rem] font-medium">
                  Type of Business
                </label>
                <select
                  name="businessType"
                  id="businessType"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className={`appearance-none pl-4 pb-4 pt-[0.875rem] text-[0.875rem] rounded text-black border border-[#E8ECEF] mt-[0.875rem] pr-[15.5px] w-full ${
                    corporateErrors.businessType ? "border-red-500" : ""
                  }`}
                  style={{
                    backgroundImage: "url('/arrow-down.svg')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "calc(100% - 15.5px) center",
                  }}
                >
                  <option value="" className="text-[#98A9BC]">
                    Select type of Business
                  </option>
                  <option value="RETAIL">RETAIL</option>
                  <option value="SERVICE">SERVICE</option>
                  <option value="MANUFACTURING">MANUFACTURING</option>
                </select>
                {corporateErrors.businessType && (
                  <ErrorMessage
                    message={corporateErrors.businessType}
                    isNotification={false}
                    onClose={() => clearCorporateError("businessType")}
                  />
                )}
              </div>
              <FormInput
                id="dateOfIncorporation"
                name="dateOfIncorporation"
                type="date"
                label="Date of Incorporation"
                placeholder="Select date of incorporation"
                className={`w-full text-black pr-[1.15625rem] ${
                  corporateErrors.dateOfIncorporation ? "border-red-500" : ""
                }`}
                value={dateOfIncorporation}
                onChange={(e) => setDateOfIncorporation(e.target.value)}
                error={!!corporateErrors.dateOfIncorporation}
                errorMessage={corporateErrors.dateOfIncorporation}
                onClose={() => clearCorporateError("dateOfIncorporation")}
              />
            </>
          )}
          {/* Common fields */}
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            className={`w-full ${
              errors.password || corporateErrors.password
                ? "border-red-500"
                : ""
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password || !!corporateErrors.password}
            errorMessage={errors.password || corporateErrors.password}
            onClose={() => {
              clearError("password");
              clearCorporateError("password");
            }}
          />
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            className={`w-full ${
              errors.confirmPassword || corporateErrors.confirmPassword
                ? "border-red-500"
                : ""
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={
              !!errors.confirmPassword || !!corporateErrors.confirmPassword
            }
            errorMessage={
              errors.confirmPassword || corporateErrors.confirmPassword
            }
            onClose={() => {
              clearError("confirmPassword");
              clearCorporateError("confirmPassword");
            }}
          />
          <ButtonDiv
            type="submit"
            option={loading ? <SpinnerLoader /> : "COMPLETE PROFILE"}
            className="outline-none bg-none flex justify-center items-center mx-auto mt-[2.5rem] text-[0.875rem] leading-[1.025625rem] text-[#D71E0E] font-medium cursor-pointer"
          />
        </form>
      </FormWrapper>
      <StepProgress currentStep={currentStep} totalSteps={4} />
    </div>
  );
}
