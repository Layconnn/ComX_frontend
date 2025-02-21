import axiosInstance from "../axiosInstance";

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  access_token: string;
}

export async function verifyOtp(dto: VerifyOtpDto): Promise<VerifyOtpResponse> {
  const response = await axiosInstance.post<VerifyOtpResponse>(
    "/auth/verify-otp",
    dto
  );
  return response.data;
}

export interface VerifyResetOtpDto {
  email: string;
  otp: string;
}

export interface VerifyResetOtpResponse {
  message: string;
  access_token?: string;
}

export async function verifyResetOtp(
  dto: VerifyResetOtpDto
): Promise<VerifyResetOtpResponse> {
  const response = await axiosInstance.post<VerifyResetOtpResponse>(
    "/auth/verify-reset-password-otp",
    dto
  );
  return response.data;
}
