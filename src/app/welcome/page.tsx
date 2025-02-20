/* eslint-disable @next/next/no-img-element */
"use client";
import SignOption from "@/components/signOption";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full">
        <div className="flex justify-center items-center mt-[2.375rem] mb-[5.75rem]">
          <img src="/logo.svg" alt="ComX" />
        </div>
        <div className="flex flex-col gap-[4.4375rem] justify-center items-center mb-8">
          <SignOption
            title="Sign in to ComX"
            subtitle="Welcome to ComX"
            className="bg-[#52965E] hover:bg-[#3f7b4a]"
            option="Sign in"
            onclick={() => router.push("/sign-in")}
          />
          <SignOption
            title="Create an Account"
            subtitle="Join the Family"
            className="bg-[#140706] hover:bg-[#2c2828]"
            option="Register"
            onclick={() =>
              router.push("/register/individual/basic-information")
            }
          />
        </div>
      </div>
    </div>
  );
}
