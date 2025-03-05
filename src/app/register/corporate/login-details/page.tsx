/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegistration } from "@/contexts/registrationContext";
import StepProgress from "@/components/stepProgress";
import FormWrapper from "@/components/formWrapper";
import FormInput from "@/components/formInput";
import ButtonDiv from "@/components/button";
import ErrorMessage from "@/components/errorMessage";
import { useCompanyFormValidation } from "@/hooks/corperate/useFormValidation";
import { registerCorporate, CorporateSignupDto } from "@/api/auth/register";
import SpinnerLoader from "@/components/spinnerLoader";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setCorporateRegistrationStep2 } from "@/redux/slices/corporateRegistrationSlice";

export default function CorporateLoginDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentStep, setCurrentStep } = useRegistration();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { corporateErrors, validateCorporateFields, clearCorporateError } = useCompanyFormValidation();

  const corporateStep1 = useSelector(
    (state: RootState) => state.corporateRegistration.corporateStep1
  );

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const handleVerifyAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    const fields = {
      companyEmail: emailValue,
      password,
      confirmPassword,
    };

    const isValid = validateCorporateFields(fields);
    if (!isValid) {
      setError("Please fill in all required fields correctly.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    if (!corporateStep1) {
      setError("Basic company info missing. Please restart registration.");
      return;
    }

    const dto: CorporateSignupDto = {
      companyName: corporateStep1.companyName,
      businessType: corporateStep1.businessType,
      dateOfIncorporation: corporateStep1.dateOfIncorporation,
      companyEmail: emailValue,
      password: password,
    };

    dispatch(setCorporateRegistrationStep2({ companyEmail: emailValue }));

    setLoading(true);
    try {
      const response = await registerCorporate(dto);
      console.log("API response:", response);
      setCurrentStep(3);
      router.push("/register/corporate/otp-verification");
    } catch (apiError: any) {
      console.error(apiError);
      setError(
        apiError.response?.data?.message ||
          "Registration failed. Please try again."
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
          className="mb-[1.5rem]"
        />
      )}
      <FormWrapper
        title="Register new account"
        subtitle="Sign up for an account and start trading today"
      >
        <form onSubmit={handleVerifyAccount}>
          <FormInput
            name="companyEmail"
            id="companyEmail"
            type="email"
            label="Company Email"
            className={`w-full ${corporateErrors.companyEmail ? "border-red-500" : ""}`}
            placeholder="Enter email"
            labelClassName="font-light text-[#252631]"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            error={!!corporateErrors.companyEmail}
            errorMessage={corporateErrors.companyEmail}
            onClose={() => clearCorporateError("companyEmail")}
          />
          <FormInput
            name="password"
            id="password"
            type="password"
            label="Password"
            className={`w-full ${corporateErrors.password ? "border-red-500" : ""}`}
            placeholder="Enter Password"
            labelClassName="font-light text-[#252631]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!corporateErrors.password}
            errorMessage={corporateErrors.password}
            onClose={() => clearCorporateError("password")}
          />
          <FormInput
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            className={`w-full ${
              corporateErrors.confirmPassword ? "border-red-500" : ""
            }`}
            placeholder="Confirm Password"
            labelClassName="font-light text-[#252631]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!corporateErrors.confirmPassword}
            errorMessage={corporateErrors.confirmPassword}
            onClose={() => clearCorporateError("confirmPassword")}
          />
          <ButtonDiv
            option={loading ? <SpinnerLoader /> : "VERIFY ACCOUNT"}
            type="submit"
            className="outline-none bg-none flex justify-center items-center mx-auto text-[0.875rem] leading-[1.025625rem] text-[#D71E0E] font-medium cursor-pointer"
          />
        </form>
      </FormWrapper>
      <StepProgress currentStep={currentStep} totalSteps={4} />
    </div>
  );
}
