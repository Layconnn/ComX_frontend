/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import { useRegistration } from "@/contexts/registrationContext";
import StepProgress from "@/components/stepProgress";
import FormWrapper from "@/components/formWrapper";
import ButtonDiv from "@/components/button";
import { Slide, ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CorporateRegistrationSuccessful() {
  const { currentStep, setCurrentStep } = useRegistration();
  const router = useRouter();

  useEffect(() => {
    toast.success("Registration Successful!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
    setCurrentStep(4);
  }, [setCurrentStep]);

  const step1DataString = localStorage.getItem("corporateRegistrationStep1");
  const step1Data = step1DataString ? JSON.parse(step1DataString) : {};
  const companyName = step1Data.companyName;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex justify-center items-center mt-[2.375rem] mb-[1.8125rem]">
        <img src="/logo.svg" alt="ComX" />
      </div>
      <FormWrapper
        title="Registration Complete"
        subtitle={`Dear ${companyName}. Your registration is now complete.
You  may proceed to your dashboard and start trading commodities.`}
        success={true}
      >
        <ButtonDiv
          option="GO TO DASHBOARD"
          onClick={() => router.push("/dashboard")}
          className="text-[#D71E0E] hover:text-[#ba473d] font-medium text-[0.75rem] leading-[1.025625rem] text-center cursor-pointer mx-auto"
        />
      </FormWrapper>
      <StepProgress currentStep={currentStep} totalSteps={4} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </div>
  );
}
