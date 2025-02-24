/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRegistration } from "@/contexts/registrationContext";
import StepProgress from "@/components/stepProgress";
import FormWrapper from "@/components/formWrapper";
import ButtonDiv from "@/components/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Slide, ToastContainer, toast } from "react-toastify";
import SpinnerLoader from "@/components/spinnerLoader";

export default function CorporateRegistrationSuccessful() {
  const { currentStep, setCurrentStep } = useRegistration();
  const [firstName, setFirstName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const accessToken =  useSelector((state: RootState) => state.auth.accessToken);
  const individualStep1 = useSelector((state: RootState) => state.individualRegistration.individualStep1);
  

  useEffect(() => {
    if (!accessToken) {
      router.push("register/individual/basic-information");
      return;
    }
    if (individualStep1) {
      setFirstName(individualStep1?.firstName || '')
    }

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

    // 4. Update current step
    setCurrentStep(4);
  }, [accessToken, individualStep1, setCurrentStep, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex justify-center items-center mt-[2.375rem] mb-[1.8125rem]">
        <img src="/logo.svg" alt="ComX LOGO" />
      </div>
      <FormWrapper
        title="Registration Complete"
        subtitle={`Dear ${firstName}. Your registration is now complete.
You  may proceed to your dashboard and start trading commodities.`}
        success={true}
      >
        <ButtonDiv
          option={loading ? <SpinnerLoader /> : "GO TO DASHBOARD"}
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setCurrentStep(4);
              router.push("/dashboard");
              setLoading(false);
            }, 1000);
          }}
          className=
              "text-[#D71E0E] hover:text-[#ba473d] font-medium text-[0.75rem] leading-[1.025625rem] text-center cursor-pointer mx-auto"
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
