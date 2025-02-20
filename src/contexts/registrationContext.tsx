"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface RegistrationContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  return (
    <RegistrationContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  }
  return context;
}
