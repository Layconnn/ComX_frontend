/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ButtonDiv from "@/components/button";
import FormInput from "@/components/formInput";
import FormWrapper from "@/components/formWrapper";
import ErrorMessage from "@/components/errorMessage";
import { login, LoginDto } from "@/api/auth/login";
import SpinnerLoader from "@/components/spinnerLoader";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors: string[] = [];

    if (!email) {
      setEmailError("Your Email is required.");
      errors.push("Your Email is required.");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Your Password is required.");
      errors.push("Your Password is required.");
    } else {
      setPasswordError("");
    }

    if (errors.length > 0) {
      setGlobalError(errors.join(" "));
      return;
    }

    setGlobalError("");
    setLoading(true);

    const dto: LoginDto = { email, password };

    try {
      const response = await login(dto);
      console.log("Login successful:", response);
      localStorage.setItem("access_token", response.access_token);
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      setGlobalError(
        error.response?.data?.message || "Login failed. Please try again."
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

      {globalError && (
        <ErrorMessage
          message={globalError}
          isNotification
          onClose={() => setGlobalError("")}
        />
      )}

      <FormWrapper
        title="Sign In to ComX"
        subtitle="Enter your login credentials below"
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Your Email"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your Email"
            className={`w-full mb-0 ${emailError ? "border-red-500" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            errorMessage={emailError}
            onClose={() => setEmailError("")}
          />
          <FormInput
            label="Your Password"
            type="password"
            id="password"
            name="password"
            placeholder="*********"
            className={`w-full mb-0 ${passwordError ? "border-red-500" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            errorMessage={passwordError}
            onClose={() => setPasswordError("")}
          />
          <div className="flex justify-between items-center mb-[1.9375rem]">
            <div className="flex justify-center items-center gap-1.5">
              <input
                type="checkbox"
                name="signed in"
                id="signed in"
                className="w-5 h-5 cursor-pointer"
              />
              <h6 className="text-[#140706] text-[0.875rem] leading-[1.025625rem]">
                Stay Signed in
              </h6>
            </div>
            <h6
              className="text-[#D71E0E] hover:text-[#a94036] text-[0.875rem] leading-[1.025625rem] cursor-pointer"
              onClick={() => router.push("/sign-in/password-reset")}
            >
              Forgot Password?
            </h6>
          </div>
          <div className="flex flex-col gap-[1.25rem]">
            <ButtonDiv
              type="submit"
              option={
                loading ? (
                  <SpinnerLoader className="border-white" />
                ) : (
                  "Sign In"
                )
              }
              className="w-full py-[0.9375rem] text-[#FFFFFF] bg-[#52965E] hover:bg-[#437F4E] text-[0.875rem] leading-[1.025625rem] font-extrabold rounded-[0.125rem]"
            />
            <ButtonDiv
              option="Back"
              className="w-full py-[0.9375rem] text-[#1E1E1E] bg-[#F8FAFB] hover:bg-[#E8EEF0] text-[0.875rem] leading-[1.025625rem] font-extrabold rounded-[0.125rem]"
              onClick={() => router.push("/welcome")}
            />
          </div>
        </form>
      </FormWrapper>
    </div>
  );
};

export default SignInPage;
