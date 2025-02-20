import axiosInstance from "../axiosInstance";

export interface IndividualSignupDto {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface CorporateSignupDto {
  companyName: string;
  businessType: string; // adjust type as needed (could be enum)
  dateOfIncorporation: string; // in ISO format (YYYY-MM-DD)
  companyEmail: string;
  password: string;
}

export async function registerIndividual(
  dto: IndividualSignupDto
): Promise<{ message: string }> {
  const response = await axiosInstance.post<{ message: string }>(
    "/auth/signup/individual",
    dto
  );
  return response.data;
}

export async function registerCorporate(
  dto: CorporateSignupDto
): Promise<{ message: string }> {
  const response = await axiosInstance.post<{ message: string }>(
    "/auth/signup/corporate",
    dto
  );
  return response.data;
}
