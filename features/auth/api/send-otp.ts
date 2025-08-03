import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/axiosConfig';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

const sendOtpInputSchema = z.object({
    email: z.email(),
});

type SendOtpVariables = z.infer<typeof sendOtpInputSchema>;
type SendOtpResult = { message: string };

export const sendOtp = async ({ email }: SendOtpVariables): Promise<SendOtpResult> => {
    const { url, method } = apiRoutes.auth.sendOtp;
    const response = await api.request<SendOtpResult>({ url, method, data: { email }});
    return response.data;
};

export const useSendOtp = () => {
    return useMutation<SendOtpResult, unknown, SendOtpVariables>({
        mutationFn: sendOtp,
    });
};