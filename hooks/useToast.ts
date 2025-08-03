import Toast, { ToastPosition, ToastProps, ToastType } from 'react-native-toast-message';

type Props = {
    title: string;
    desc?: string;
    type?: ToastType;
    timeout?: number;
    position?: ToastPosition;
} & ToastProps;

export function useToast() {
    const showToast = ({ title, desc, type='info', timeout=0, position="top", ...props }: Props) => {
        Toast.show({
            type,
            text1: title,
            text2: desc,
            visibilityTime: timeout,
            autoHide: Boolean(timeout),
            position,
        });
    }

    return {
        showToast
    }
}