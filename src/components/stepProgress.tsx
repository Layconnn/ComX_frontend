"use client";
import React from "react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({
  currentStep,
  totalSteps,
}: StepProgressProps) {
  const safeCurrentStep = Math.min(Math.max(currentStep, 1), totalSteps);

  const progressPercentage = (safeCurrentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-[34.6875rem] mx-auto mt-[4.3125rem] mb-8 max-[640px]:mt-[1.5rem]">
      <div className="text-center text-sm font-medium">
        <span className="font-bold text-[#252631]">{safeCurrentStep}</span>
        <span
          className={` ${
            safeCurrentStep === totalSteps
              ? "font-bold text-[#252631]"
              : "text-[#98A9BC]"
          }`}
        >
          /{totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-[#E8ECEF] rounded-full mt-4">
        <div
          className="absolute h-2 bg-[#D71E0E] rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
