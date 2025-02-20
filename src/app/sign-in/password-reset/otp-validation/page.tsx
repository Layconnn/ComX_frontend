/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormWrapper from "@/components/formWrapper";
import FormInput from "@/components/formInput";
import ButtonDiv from "@/components/button";
import ErrorMessage from "@/components/errorMessage";
// Import the API function for verifying OTP for password reset
import {
  verifyResetOtp,
  VerifyResetOtpDto,
  VerifyResetOtpResponse,
} from "@/api/auth/verify-otp";
// Import the API function for resetting the password
import { resetPassword, ResetPasswordDto } from "@/api/auth/password-reset";
import { resendPasswordResetCode } from "@/api/auth/resendCode";

const PasswordResetOtpValidationPage = () => {
  const router = useRouter();

  // OTP and email state
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");

  // States for new password inputs (hidden until OTP is verified)
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // Global error state and loading states
  const [globalError, setGlobalError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string>("");
  const [resendLoading, setResendLoading] = useState<boolean>(false);

  // State to track whether the OTP has been verified
  const [otpVerified, setOtpVerified] = useState<boolean>(false);

  useEffect(() => {
    // You might optionally check for stored email or initialize animations here.
  }, []);

  // Step 1: Verify OTP (without updating password)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setOtpError("OTP is required.");
      return;
    }
    setOtpError("");

    // Retrieve the email from localStorage (stored under "resetEmail" on password reset request)
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      setOtpError(
        "Email data missing. Please restart the password reset process."
      );
      return;
    }
    const email = storedEmail;

    const dto: VerifyResetOtpDto = { email, otp };

    setLoading(true);
    try {
      // Call the endpoint that verifies the OTP only (without updating the password)
      const response: VerifyResetOtpResponse = await verifyResetOtp(dto);
      console.log("OTP verified successfully:", response);
      setOtpVerified(true); // OTP is valid, reveal new password inputs
      // Optionally, you might remove the OTP from localStorage here if desired.
    } catch (error: any) {
      console.error(error);
      const backendMsg = error.response?.data?.message;
      // If the backend returns "Incorrect OTP code.", display "OTP code invalid"
      setOtpError(
        backendMsg === "Incorrect OTP code."
          ? "OTP code invalid"
          : backendMsg || "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password (after OTP is verified)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate new password fields
    if (!newPassword || !confirmPassword) {
      setPasswordError("Both password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError("");

    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      setGlobalError(
        "Email data missing. Please restart the password reset process."
      );
      return;
    }
    const email = storedEmail;

    // Construct DTO for resetting password. Use the OTP that was already verified.
    const dto: ResetPasswordDto = { email, token: otp, newPassword };

    setLoading(true);
    try {
      const response = await resetPassword(dto);
      console.log("Password reset successfully:", response);
      localStorage.removeItem("resetEmail");
      // Optionally store the token, then route to sign-in
      localStorage.setItem("access_token", response.access_token);
      router.push("/sign-in");
    } catch (error: any) {
      console.error(error);
      setPasswordError(
        error.response?.data?.message ||
          "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP code for password reset
  const handleResendCode = async () => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      setResendMessage(
        "No email found. Please restart the password reset process."
      );
      return;
    }
    const email = storedEmail;
    try {
      setResendLoading(true);
      setResendMessage("");
      const response = await resendPasswordResetCode(email);
      setResendMessage(response.message);
    } catch (error: any) {
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

      {globalError && (
        <ErrorMessage
          message={globalError}
          isNotification
          onClose={() => setGlobalError("")}
          className="w-full mb-[5.375rem]"
        />
      )}

      {resendMessage && (
        <p className="text-center text-green-600 mb-4">{resendMessage}</p>
      )}

      {passwordError && (
        <ErrorMessage
          message={passwordError}
          isNotification
          onClose={() => setPasswordError("")}
          className="w-full mt-4"
        />
      )}

      <FormWrapper
        title="Password Reset"
        subtitle="Reset your password to continue trading on ComX"
      >
        {!otpVerified ? (
          // Step 1: OTP Verification Form
          <form onSubmit={handleVerifyOtp}>
            <div className="flex flex-col">
              <FormInput
                label="Enter the 4-digit code sent to your email"
                type="text"
                name="otp"
                id="otp"
                placeholder="Enter OTP"
                className={`w-full ${otpError ? "border-red-500" : ""}`}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                maxLength={4}
                error={!!otpError}
                errorMessage={otpError}
                onClose={() => setOtpError("")}
              />
              <h5
                className="text-center text-[#98A9BCCC] text-[0.75rem] leading-[1.3125rem] mb-[3.125rem] cursor-pointer"
                onClick={handleResendCode}
              >
                {resendLoading ? (
                  <div className="w-5 h-5 border-2 border-[#98A9BCCC] border-b-transparent rounded-full inline-block animate-spin mx-auto" />
                ) : (
                  "Resend Code"
                )}
              </h5>
            </div>

            {otpError && (
              <ErrorMessage
                message={otpError}
                isNotification
                onClose={() => setPasswordError("")}
                className="w-full mb-[5.375rem]"
              />
            )}

            <div className="flex justify-between">
              <ButtonDiv
                option="BACK"
                className="text-[#252631] hover:text-[#000000] font-medium text-[0.75rem] leading-[1.025625rem] cursor-pointer"
                onClick={() => router.back()}
              />
              <ButtonDiv
                type="submit"
                option={
                  loading ? (
                    <div className="w-5 h-5 border-4 border-[#D71E0E] border-b-transparent rounded-full inline-block animate-spin mx-auto" />
                  ) : (
                    "VERIFY OTP"
                  )
                }
                className="text-[#D71E0E] hover:text-[#74322c] font-medium text-[0.875rem] leading-[1.025625rem]"
              />
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div
              className="flex flex-col gap-4 transition-all duration-500 ease-in-out"
              style={{
                opacity: otpVerified ? 1 : 0,
                transform: otpVerified ? "translateY(0)" : "translateY(-20px)",
              }}
            >
              <FormInput
                label="New Password"
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="Enter new password"
                className="w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <FormInput
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm new password"
                className="w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between mt-6">
              <ButtonDiv
                option="BACK"
                className="text-[#252631] hover:text-[#000000] font-medium text-[0.75rem] leading-[1.025625rem] cursor-pointer"
                onClick={() => router.back()}
              />
              <ButtonDiv
                type="submit"
                option={
                  loading ? (
                    <div className="w-5 h-5 border-4 border-[#D71E0E] border-b-transparent rounded-full inline-block animate-spin mx-auto" />
                  ) : (
                    "RESET PASSWORD"
                  )
                }
                className="text-[#D71E0E] hover:text-[#74322c] font-medium text-[0.875rem] leading-[1.025625rem]"
              />
            </div>
          </form>
        )}
      </FormWrapper>
    </div>
  );
};

export default PasswordResetOtpValidationPage;
