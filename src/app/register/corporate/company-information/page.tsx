/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCorporateRegistrationStep1 } from "@/redux/slices/corporateRegistrationSlice";
import { setAccountType } from "@/redux/slices/registrationSlice";
import { useRegistration } from "@/contexts/registrationContext";
import StepProgress from "@/components/stepProgress";
import FormWrapper from "@/components/formWrapper";
import ButtonDiv from "@/components/button";
import FormInput from "@/components/formInput";
import ErrorMessage from "@/components/errorMessage";
import { useCompanyFormValidation } from "@/hooks/corperate/useFormValidation";
import SpinnerLoader from "@/components/spinnerLoader";

export default function CompanyRegistration() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const errorFromUrl = searchParams.get("error") || "";
  const { currentStep, setCurrentStep } = useRegistration();
  const [companyName, setCompanyName] = useState<string>("");
  const [businessType, setBusinessType] = useState<string>("");
  const [dateOfIncorporation, setDateOfIncorporation] = useState<string>("");
  const [globalError, setGlobalError] = useState<string>(errorFromUrl);
  const [loading, setLoading] = useState<boolean>(false);
  const { corporateErrors, validateCorporateFields, clearCorporateError } =
    useCompanyFormValidation();

  useEffect(() => {
    if (globalError) {
      const timer = setTimeout(() => setGlobalError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [globalError]);

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const handleAccountTypeChange = (type: "individual" | "corporate") => {
    if (type === "individual") {
      router.push("/register/individual/basic-information");
    } else {
      dispatch(setAccountType("corporate"));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fields = {
      companyName,
      businessType,
      dateOfIncorporation,
    };

    const isValid = validateCorporateFields(fields);
    if (!isValid) {
      setGlobalError("Please fill in all fields correctly.");
      return;
    }
    setGlobalError("");
    dispatch(setCorporateRegistrationStep1(fields));
    dispatch(setAccountType("corporate"));

    setLoading(true);
    setTimeout(() => {
      setCurrentStep(2);
      router.push("/register/corporate/login-details");
      setLoading(false);
    }, 1000);
  };

  const handleGoogleSignUp = () => {
    dispatch(setAccountType("corporate"));
    const googleRedirectUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google-redirect?accountType=corporate`;
    window.location.href = googleRedirectUrl;
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
          className="w-full mb-4"
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
            className={`flex-1 py-[1.125rem] pl-[2.6875rem] pr-[2.625rem] text-center border transition-colors max-w-[9.125rem] ${"bg-white text-black border-gray-300 hover:bg-black hover:text-white hover:border-black"}`}
          />
          <ButtonDiv
            option="Corporate"
            onClick={() => handleAccountTypeChange("corporate")}
            className={`flex-1 pl-[2.65625rem] pr-[2.59375rem] pt-4 pb-[0.9375rem] text-center border transition-colors max-w-[9.125rem] ${"bg-black text-white border-black hover:bg-[#2c2828]"}`}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <FormInput
            name="companyName"
            id="companyName"
            label="Your Company Name"
            className={`w-full ${
              corporateErrors.companyName ? "border-red-500" : ""
            }`}
            placeholder="Enter Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            error={!!corporateErrors.companyName}
            errorMessage={corporateErrors.companyName}
            onClose={() => clearCorporateError("companyName")}
          />
          <div className="flex gap-[1.28125rem] mb-[1.3125rem] items-center max-[640px]:flex-col max-[640px]:gap-0">
            <div className="mb-5 max-[640px]:w-full">
              <label className="text-[0.875rem] leading-[1.025625rem] font-medium">
                Type of Business
              </label>
              <select
                name="businessType"
                id="businessType"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className={`appearance-none pl-4 pb-4 pt-[0.875rem] text-[0.875rem] rounded-[0.125rem] text-black border border-[#E8ECEF] mt-[0.875rem] pr-[15.5px] w-full ${
                  corporateErrors.businessType ? "border-red-500" : ""
                }`}
                style={{
                  backgroundImage: "url('/arrow-down.svg')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "calc(100% - 15.5px) center",
                }}
              >
                <option value="">Select type of Business</option>
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
              name="dateOfIncorporation"
              id="dateOfIncorporation"
              type="date"
              label="Date of Incorporation"
              className={`w-full pr-[1.15625rem] text-black ${
                corporateErrors.dateOfIncorporation ? "border-red-500" : ""
              }`}
              value={dateOfIncorporation}
              onChange={(e) => setDateOfIncorporation(e.target.value)}
              error={!!corporateErrors.dateOfIncorporation}
              errorMessage={corporateErrors.dateOfIncorporation}
              onClose={() => clearCorporateError("dateOfIncorporation")}
            />
          </div>
          <ButtonDiv
            type="submit"
            option={loading ? <SpinnerLoader /> : "NEXT STEP"}
            className="outline-none bg-none flex justify-center items-center mx-auto text-[0.875rem] leading-[1.025625rem] text-[#D71E0E] font-medium cursor-pointer"
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
        option={"Google"}
        image="/google.svg"
        onClick={handleGoogleSignUp}
      />
    </div>
  );
}
