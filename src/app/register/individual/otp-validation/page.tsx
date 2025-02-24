/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setAccessToken } from "@/redux/slices/authSlice";
import { useRegistration } from "@/contexts/registrationContext";
import StepProgress from "@/components/stepProgress";
import FormWrapper from "@/components/formWrapper";
import FormInput from "@/components/formInput";
import ButtonDiv from "@/components/button";
import ErrorMessage from "@/components/errorMessage";
import { resendSignUpOtpCode } from "@/api/auth/resendCode";
import { verifyOtp, VerifyOtpDto } from "@/api/auth/verify-otp";
import SpinnerLoader from "@/components/spinnerLoader";

export default function IndividualOtpVerification() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentStep, setCurrentStep } = useRegistration();
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [resendMessage, setResendMessage] = useState<string>("");
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const individualStep2 = useSelector(
    (state: RootState) => state.individualRegistration.individualStep2
  );

  const emailFromRedux = individualStep2?.email || "";

  useEffect(() => {
    if(emailFromRedux) {
      setEmail(emailFromRedux);
    } else{
      setOtpError("Registration data missing. Please restart registration.");
    }
    setCurrentStep(3);
  }, [emailFromRedux, setCurrentStep]);

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    router.push("/register/individual/login-details");
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setOtpError("OTP is required.");
      return;
    }
    setOtpError("");

    if(!emailFromRedux) {
      setOtpError("Registration data missing. Please restart registration.");
      return;
    }
    const email = emailFromRedux;
    if (!email) {
      setOtpError("Email missing. Please restart registration.");
      return;
    }

    const dto: VerifyOtpDto = { email, otp };
    setVerifyLoading(true);
    try {
      const response = await verifyOtp(dto);
      dispatch(setAccessToken(response.access_token));
      setCurrentStep(currentStep + 1);
      router.push("/register/individual/registration-successful");
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
    if(!emailFromRedux){
      setResendMessage("No email found. Please restart registration.");
      return;
    }
    const email = emailFromRedux;
    if (!email) {
      setResendMessage("No email found. Please restart registration.");
      return;
    }
    console.log("Verifying OTP for email:", email, "with OTP:", otp);

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

      {otpError && (
        <ErrorMessage
          message={otpError}
          isNotification
          onClose={() => setOtpError("")}
          className="w-full mb-[2.875rem]"
        />
      )}

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
              label={`Enter the 4-digit code that was sent to ${email}`}
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
              className="text-center text-[#98A9BCCC] text-[0.75rem] leading-[1.3125rem] mb-[12.3125rem] cursor-pointer"
              onClick={handleResendCode}
            >
              {resendLoading ? (
                <SpinnerLoader className="border-gray-400 w-2 h-2" />
              ) : (
                "Resend Code"
              )}
            </h5>
          </div>

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
