import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const VOUCHER_QUERY_KEY = "VOUCHERS";

interface Ivoucher {
    id?: string;
    code: string;
    category: string;
    discount: any;
    countOnStock: any;
    type: string;
    status?: string;
    startDate: Date;
    endDate: Date;
}

const fetchVoucher = async (action: string, id?: string) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/voucher/${action}/${id ? id : ''}`);
        return data
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Lỗi voucher",
            description: `${error.response.data.message}`,
        })
    }
}

const voucherMutation = async (method: 'post' | 'put', action: string, item: Ivoucher) => {
    const { data } = await axios[method](`${BASE_URL}/voucher/${action}`, item);
    return data
}

const useVoucher = () => {
    const queryClient = useQueryClient();

    const getVoucher = (action: string, id?: string) => {
        const { data, isLoading, isError } = useQuery({
            queryKey: [VOUCHER_QUERY_KEY, id ? id : ''],
            queryFn: async () => await fetchVoucher(action, id),
            enabled: !!action,
        })
        return { data, isLoading, isError }
    }

    const voucherAction = (method: 'post' | 'put', action: string) => {
        return useMutation({
            mutationFn: async (item: any) => {
                const data = await voucherMutation(method, action, item);
                // console.log(data)
                return data
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [VOUCHER_QUERY_KEY] })
            },
            onError: (error: any) => {
                toast({
                    variant: "destructive",
                    title: "Lỗi voucher",
                    description: `${error.response.data.message}`,
                })
            }
        })
    }

    return {
        getVoucher,
        createVoucher: voucherAction('post', 'create-voucher'),
        updateVoucher: voucherAction('put', 'update-voucher'),
        changeStatusVoucher: voucherAction('put', 'change-status-voucher'),
        deleteVoucher: voucherAction('put', 'delete-voucher'),
    };
};

export default useVoucher;
