"use client";
import React from "react";

interface StepProgressProps {
  currentStep: number; // e.g. 1, 2, 3, ...
  totalSteps: number; // e.g. 4
}

export default function StepProgress({
  currentStep,
  totalSteps,
}: StepProgressProps) {
  // Clamp currentStep so it never exceeds totalSteps or goes below 1
  const safeCurrentStep = Math.min(Math.max(currentStep, 1), totalSteps);

  // Calculate progress percentage for the bar
  const progressPercentage = (safeCurrentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto mt-[4.3125rem] mb-8 max-[640px]:mt-[1.5rem]">
      {/* Fraction or Label (e.g. "1/4") */}
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
