import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { columnsProducts } from "./columnsProducts"
import { DataTableProducts } from "./dataTableProducts"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export function TopProducts() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['TopProducts'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:8080/api/dashboard/get-data-top-products')
            return data
        }
    })

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error</div>
    return (
        <Card className='col-span-1 lg:col-span-4'>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Sản phẩm bán chạy</CardTitle>
                    <CardDescription>
                        Những sản phẩm có lượt mua nhiều nhất
                    </CardDescription>
                </div>
                {/* <Select>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select> */}
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full flex flex-col justify-between min-h-[419px]">
                    <DataTableProducts columns={columnsProducts} data={data} />
                </div>
            </CardContent>
        </Card>
    )
}
