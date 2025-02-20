import axiosInstance from "../axiosInstance";

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export async function login(dto: LoginDto): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", dto);
  return response.data;
}
