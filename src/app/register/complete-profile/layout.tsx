"use client";
import { RegistrationProvider } from "@/contexts/registrationContext";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RegistrationProvider>{children}</RegistrationProvider>;
}
