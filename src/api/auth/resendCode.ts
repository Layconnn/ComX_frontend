import axiosInstance from "../axiosInstance";

export interface ResendCodeEmailResponse {
  message: string;
}

export async function resendSignUpOtpCode(
  email: string
): Promise<ResendCodeEmailResponse> {
  const response = await axiosInstance.post<ResendCodeEmailResponse>(
    "/auth/resend-verify-otp",
    { email }
  );
  return response.data;
}

export async function resendPasswordResetCode(
  email: string
): Promise<ResendCodeEmailResponse> {
  const response = await axiosInstance.post<ResendCodeEmailResponse>(
    "/auth/resend-password-reset-otp",
    { email }
  );
  return response.data;
}
