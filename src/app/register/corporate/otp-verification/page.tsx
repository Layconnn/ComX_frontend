/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRegistration } from "@/contexts/registrationContext";
import StepProgress from "@/components/stepProgress";
import FormWrapper from "@/components/formWrapper";
import FormInput from "@/components/formInput";
import ButtonDiv from "@/components/button";
import ErrorMessage from "@/components/errorMessage";
import { verifyOtp, VerifyOtpDto } from "@/api/auth/verify-otp";
import { resendSignUpOtpCode } from "@/api/auth/resendCode";
import SpinnerLoader from "@/components/spinnerLoader";

export default function CorporateOtpVerification() {
  const router = useRouter();
  const { currentStep, setCurrentStep } = useRegistration();

  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [resendMessage, setResendMessage] = useState<string>("");
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [companyEmail, setCompanyEmail] = useState<string>("");

  useEffect(() => {
    const step2DataString = localStorage.getItem("corporateRegistrationStep2");
    if (step2DataString) {
      const step2Data = JSON.parse(step2DataString);
      setCompanyEmail(step2Data.companyEmail);
    }
    setCurrentStep(3);
  }, [setCurrentStep]);

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    router.push("/register/corporate/login-details");
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setOtpError("OTP is required.");
      return;
    }

    const step2DataString = localStorage.getItem("corporateRegistrationStep2");
    if (!step2DataString) {
      setOtpError("Registration data missing. Please restart registration.");
      return;
    }
    const step2Data = JSON.parse(step2DataString);
    const email = step2Data.companyEmail || step2Data.email;
    if (!email) {
      setOtpError("Email missing. Please restart registration.");
      return;
    }

    const dto: VerifyOtpDto = { email, otp };
    setVerifyLoading(true);
    try {
      const response = await verifyOtp(dto);
      localStorage.setItem("access_token", response.access_token);
      setCurrentStep(currentStep + 1);
      router.push("/register/corporate/registration-successful");
    } catch (error: any) {
      console.error(error);
      setOtpError(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendCode = async () => {
    const step2DataString = localStorage.getItem("corporateRegistrationStep2");
    if (!step2DataString) {
      setResendMessage("No email found. Please restart registration.");
      return;
    }
    const step2Data = JSON.parse(step2DataString);
    if (!step2Data) {
      setResendMessage("No email found. Please restart registration.");
      return;
    }
    const email = step2Data.companyEmail || step2Data.email;
    if (!email) {
      setResendMessage("No email found. Please restart registration.");
      return;
    }
    try {
      setResendLoading(true);
      setResendMessage("");
      const response = await resendSignUpOtpCode(email);
      setResendMessage(response.message);
    } catch (error: unknown) {
      console.error(error);
      setResendMessage("Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex justify-center items-center mt-[2.375rem] mb-[1.8125rem]">
        <img src="/logo.svg" alt="ComX" />
      </div>

      {resendMessage && (
        <p className="text-center text-green-600 mb-4">{resendMessage}</p>
      )}

      <FormWrapper
        title="Account details"
        subtitle="Sign up for an account and start trading today"
      >
        <form onSubmit={handleFinish}>
          <div className="flex flex-col">
            <FormInput
              label={`Enter the 4-digit code that was sent to ${companyEmail}`}
              type="text"
              name="otp"
              id="otp"
              placeholder="Enter code"
              className="w-full"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                setOtp(value);
              }}
              maxLength={4}
            />
            <h5
              className="text-center text-[#98A9BCCC] text-[0.75rem] leading-[1.3125rem] mb-[3.125rem] cursor-pointer"
              onClick={handleResendCode}
            >
              {resendLoading ? (
                <SpinnerLoader />
              ) : (
                "Resend Code"
              )}
            </h5>
          </div>

          {otpError && (
            <ErrorMessage
              message={otpError}
              isNotification
              onClose={() => setOtpError("")}
              className="w-full mb-[5.375rem]"
            />
          )}

          <div className="flex justify-between">
            <ButtonDiv
              option="BACK"
              className="text-[#252631] hover:text-[#000000] font-medium text-[0.875rem] leading-[1.025625rem] cursor-pointer"
              onClick={handleBack}
            />
            <ButtonDiv
              type="submit"
              option={verifyLoading ? <SpinnerLoader /> : "FINISH"}
              className=
                  "text-[#D71E0E] hover:text-[#74322c] font-medium text-[0.875rem] leading-[1.025625rem]"
            />
          </div>
        </form>
      </FormWrapper>
      <StepProgress currentStep={currentStep} totalSteps={4} />
    </div>
  );
}
