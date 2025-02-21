/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import FormWrapper from "@/components/formWrapper";
import React, { useState } from "react";
import FormInput from "@/components/formInput";
import ErrorMessage from "@/components/errorMessage";
import ButtonDiv from "@/components/button";
import { useRouter } from "next/navigation";
import {
  requestPasswordReset,
  RequestResetPasswordDto,
} from "@/api/auth/password-reset";
import SpinnerLoader from "@/components/spinnerLoader";

const PasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    setError("");

    localStorage.setItem("resetEmail", email);

    setLoading(true);

    const dto: RequestResetPasswordDto = { email };
    try {
      const response = await requestPasswordReset(dto);
      console.log("Password reset requested:", response);
      router.push("/sign-in/password-reset/otp-validation");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Password reset request failed. Please try again."
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
        />
      )}

      <FormWrapper
        title="Password Reset"
        subtitle="Reset your password to continue trading on ComX"
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Enter the Email Address you registered with"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your Email"
            className={`w-full ${error ? "border-red-500" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            errorMessage="Your Email is required."
            onClose={() => setError("")}
          />
          <h5 className="text-center text-[#98A9BCCC] text-[0.875rem] leading-[1.3125rem] mb-[12.3125rem]">
            Note that you’ll be sent an OTP to the email address provided
          </h5>
          <div className="flex justify-between items-center">
            <ButtonDiv
              option="BACK"
              onClick={() => router.back()}
              className="text-[#252631] hover:text-[#000000] font-medium text-[0.75rem] leading-[1.025625rem] cursor-pointer"
            />
            <ButtonDiv
              type="submit"
              option={loading ? <SpinnerLoader /> : "PROCEED"}
              className={`
                 "text-[#D71E0E] hover:text-[#74322c] font-medium text-[0.875rem] leading-[1.025625rem]"
              `}
            />
          </div>
        </form>
      </FormWrapper>
    </div>
  );
};

export default PasswordResetPage;
