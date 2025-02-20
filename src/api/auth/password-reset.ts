import axiosInstance from "../axiosInstance";

export interface RequestResetPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  access_token: string;
}

export async function requestPasswordReset(
  dto: RequestResetPasswordDto
): Promise<{ message: string }> {
  const response = await axiosInstance.post<{ message: string }>(
    "/auth/request-password-reset",
    dto
  );
  return response.data;
}

export async function resetPassword(
  dto: ResetPasswordDto
): Promise<ResetPasswordResponse> {
  const response = await axiosInstance.put<ResetPasswordResponse>(
    "/auth/reset-password",
    dto
  );
  return response.data;
}
