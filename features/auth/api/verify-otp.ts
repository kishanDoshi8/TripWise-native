import { apiRoutes } from "@/config/apiRoutes";
import api from "@/config/axiosConfig";
import { useAuth } from "@/providers/AuthProvider";
import { userSchema } from "@/types";
import { useMutation } from '@tanstack/react-query';
import z from "zod";

export const accessCodeSchema = z
  .string()
  .regex(/^\d{4}$/, { message: "Access code must be exactly 4 digits" });

const variablesSchema = z.object({
    email: z.email(),
    accessCode: accessCodeSchema,
});
const resultSchema = z.object({
    user: userSchema,
    token: z.string().min(1),
    refreshToken: z.string().min(1),
});

type VerifyOtpVariables = z.infer<typeof variablesSchema>;
type VerifyOtpResult = z.infer<typeof resultSchema>;

const verifyOtp = async ({ email, accessCode }: VerifyOtpVariables): Promise<VerifyOtpResult> => {
    const { url, method } = apiRoutes.auth.verifyOtp;
    const response = await api.request<VerifyOtpResult>({url, method, data: { email, accessCode }});
    return resultSchema.parse(response.data);
};

export const useVerifyOtp = () => {
    const { login } = useAuth();

    return useMutation<VerifyOtpResult, unknown, VerifyOtpVariables>({
        onSuccess: (data) => {
            login(data.user, data.token, data.refreshToken);
        },
        mutationFn: verifyOtp,
    })
}