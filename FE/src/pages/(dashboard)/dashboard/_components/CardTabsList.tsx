import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DollarSign, Package, Truck, Users, Activity, BadgeDollarSign } from "lucide-react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export function CardTabsList() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['CardTabsList'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:8080/api/dashboard/get-data-card')
            return data
        }
    })
    if (isLoading) return (
        <div className='grid gap-4 sm:grid-cols-2 1408px:grid-cols-6 *:transition-all *:duration-300'>
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-white" />
            </div>
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-white" />
            </div>
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-white" />
            </div>
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-white" />
            </div>
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-white" />
            </div>
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-white" />
            </div>
        </div>
    )
    if (isError) return (
        <div className="flex items-center justify-center p-[10rem] my-10   ">
            <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
            <span className="text-red-600 font-semibold">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</span>
        </div>
    );
    return (
        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 1408px:grid-cols-6 *:transition-all *:duration-300">
                    <Card className="hover:-translate-y-1 hover:shadow-md bg-gradient-to-r from-[#FFEDD5] to-[#FDBA74] text-black">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                            <DollarSign />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(data?.total) || NaN} VNĐ</div>
                        </CardContent>
                    </Card>
                    <Card className="hover:-translate-y-1 hover:shadow-md bg-gradient-to-r from-[#FDE68A] to-[#F59E0B] text-black">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lợi nhuận</CardTitle>
                            <Activity />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(data?.totalProfit) || NaN} VNĐ</div>
                        </CardContent>
                    </Card>
                    <Card className="hover:-translate-y-1 hover:shadow-md bg-gradient-to-r from-[#D9F99D] to-[#84CC16] text-black">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Giá nhập</CardTitle>
                            <BadgeDollarSign />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(data?.totalImport) || NaN} VNĐ</div>
                        </CardContent>
                    </Card>
                    <Card className="hover:-translate-y-1 hover:shadow-md bg-gradient-to-r from-[#BBF7D0] to-[#22C55E] text-black">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
                            <Truck />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{data?.order || NaN}</div>
                        </CardContent>
                    </Card>
                    <Card className="hover:-translate-y-1 hover:shadow-md bg-gradient-to-r from-[#CCFBF1] to-[#14B8A6] text-black">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
                            <Package />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{data.product || NaN}</div>
                        </CardContent>
                    </Card>
                    <Card className="hover:-translate-y-1 hover:shadow-md bg-gradient-to-r from-[#E0F2FE] to-[#3B82F6] text-black">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
                            <Users />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{data.user || NaN}</div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
    )
}