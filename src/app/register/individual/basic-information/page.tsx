/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setIndividualRegistrationStep1 } from "@/redux/slices/individualRegistrationSlice";
import { setAccountType } from "@/redux/slices/registrationSlice";
import { useRegistration } from "@/contexts/registrationContext";
import StepProgress from "@/components/stepProgress";
import FormWrapper from "@/components/formWrapper";
import ButtonDiv from "@/components/button";
import FormInput from "@/components/formInput";
import ErrorMessage from "@/components/errorMessage";
import { useFormValidation } from "@/hooks/individual/useFormValidation";
import SpinnerLoader from "@/components/spinnerLoader";

export default function BasicInformation() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const errorFromUrl = searchParams.get("error") || "";
  const { setCurrentStep, currentStep } = useRegistration();
  const [error, setError] = useState<string>(errorFromUrl);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { errors, validateFields, clearError } = useFormValidation();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const handleAccountTypeChange = (type: "individual" | "corporate") => {
    if (type === "corporate") {
      router.push("/register/corporate/company-information");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields = { firstName, lastName, email: emailValue };
    const isValid = validateFields(fields);
    if (!isValid) {
      setError("Please fill in all required fields correctly.");
      return;
    }
    setError("");
    dispatch(setIndividualRegistrationStep1(fields));
    dispatch(setAccountType("individual"));
    setLoading(true);
    setTimeout(() => {
      setCurrentStep(2);
      router.push("/register/individual/login-details");
      setLoading(false);
    }, 1000);
  };

  const handleGoogleSignUp = () => {
    dispatch(setAccountType("individual"));
    const googleRedirectUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google-redirect?accountType=individual`;
    window.location.href = googleRedirectUrl;
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
        title="Register new account"
        subtitle="Sign up for an account and start trading today"
      >
        <p className="text-[#1E1E1E] text-[0.875rem] leading-[1.025625rem] mb-[0.875rem] max-[400px]:text-[0.75rem]">
          Select the category that best describes you
        </p>
        <div className="flex gap-[0.635rem] mb-[1.25rem]">
          <ButtonDiv
            option="Individual"
            onClick={() => handleAccountTypeChange("individual")}
            className={`flex-1 py-[1.125rem] pl-[2.6875rem] pr-[2.625rem] text-center border transition-colors max-w-[9.125rem] bg-black text-white border-black hover:bg-[#2c2828]`}
          />
          <ButtonDiv
            option="Corporate"
            onClick={() => handleAccountTypeChange("corporate")}
            className={`flex-1 pl-[2.65625rem] pr-[2.59375rem] pt-4 pb-[0.9375rem] text-center border transition-colors max-w-[9.125rem] hover:bg-black hover:text-white hover:border-black`}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-[1.28125rem] max-[640px]:flex-col max-[640px]:gap-0">
            <FormInput
              name="firstName"
              id="firstName"
              type="text"
              label="Your First Name"
              className={`w-full ${errors.firstName ? "border-red-500" : ""}`}
              placeholder="Enter Your First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={!!errors.firstName}
              errorMessage={errors.firstName}
              onClose={() => clearError("firstName")}
            />
            <FormInput
              name="lastName"
              id="lastName"
              type="text"
              label="Your Last Name"
              className={`w-full ${errors.lastName ? "border-red-500" : ""}`}
              placeholder="Enter your Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={!!errors.lastName}
              errorMessage={errors.lastName}
              onClose={() => clearError("lastName")}
            />
          </div>
          <FormInput
            name="email"
            id="email"
            label="Your Email"
            className={`w-full ${errors.email ? "border-red-500" : ""}`}
            placeholder="Enter your Email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            error={!!errors.email}
            errorMessage={errors.email}
            onClose={() => clearError("email")}
          />
          <ButtonDiv
            type="submit"
            option={loading ? <SpinnerLoader /> : "NEXT STEP"}
            className="outline-none bg-none mt-[1.3125rem] flex justify-center items-center mx-auto text-[0.875rem] leading-[1.025625rem] text-[#D71E0E] font-medium cursor-pointer"
          />
        </form>
      </FormWrapper>
      <StepProgress currentStep={currentStep} totalSteps={4} />
      <div className="mx-auto my-6 flex items-center gap-2 max-w-[34.6875rem] w-full">
        <div className="border border-gray-200 w-full"></div>
        <span className="w-full text-center">or sign up with</span>
        <div className="border border-gray-200 w-full"></div>
      </div>
      {/* Google Sign In Button */}
      <ButtonDiv
        className="bg-white border border-[#EEEFF2] py-[1.0625rem] max-w-[34.6875rem] w-full hover:bg-gray-200"
        option={'Google'}
        image="/google.svg"
        onClick={handleGoogleSignUp}
        />
    </div>
  );
}
