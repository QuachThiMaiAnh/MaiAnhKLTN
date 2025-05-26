import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
// const chartData = [
//     { date: "2022-04-01", desktop: 222, mobile: 150 },
//     { date: "2023-05-02", desktop: 97, mobile: 180 },
//     { date: "2024-04-03", desktop: 167, mobile: 120 },
//     { date: "2024-04-04", desktop: 242, mobile: 260 },
//     { date: "2024-04-05", desktop: 373, mobile: 290 },
//     { date: "2024-04-06", desktop: 301, mobile: 340 },
//     { date: "2024-04-07", desktop: 245, mobile: 180 },
//     { date: "2024-04-08", desktop: 409, mobile: 320 },
//     { date: "2024-04-09", desktop: 59, mobile: 110 },
//     { date: "2024-04-10", desktop: 261, mobile: 190 },
//     { date: "2024-04-11", desktop: 327, mobile: 350 },
//     { date: "2024-04-12", desktop: 292, mobile: 210 },
//     { date: "2024-04-13", desktop: 342, mobile: 380 },
//     { date: "2024-04-14", desktop: 137, mobile: 220 },
//     { date: "2024-04-15", desktop: 120, mobile: 170 },
//     { date: "2024-04-16", desktop: 138, mobile: 190 },
//     { date: "2024-04-17", desktop: 446, mobile: 360 },
//     { date: "2024-04-18", desktop: 364, mobile: 410 },
//     { date: "2024-04-19", desktop: 243, mobile: 180 },
//     { date: "2024-04-20", desktop: 89, mobile: 150 },
//     { date: "2024-04-21", desktop: 137, mobile: 200 },
//     { date: "2024-04-22", desktop: 224, mobile: 170 },
//     { date: "2024-04-23", desktop: 138, mobile: 230 },
//     { date: "2024-04-24", desktop: 387, mobile: 290 },
//     { date: "2024-04-25", desktop: 215, mobile: 250 },
//     { date: "2024-04-26", desktop: 75, mobile: 130 },
//     { date: "2024-04-27", desktop: 383, mobile: 420 },
//     { date: "2024-04-28", desktop: 122, mobile: 180 },
//     { date: "2024-04-29", desktop: 315, mobile: 240 },
//     { date: "2024-04-30", desktop: 454, mobile: 380 },
//     { date: "2024-05-01", desktop: 165, mobile: 220 },
//     { date: "2024-05-02", desktop: 293, mobile: 310 },
//     { date: "2024-05-03", desktop: 247, mobile: 190 },
//     { date: "2024-05-04", desktop: 385, mobile: 420 },
//     { date: "2024-05-05", desktop: 481, mobile: 390 },
//     { date: "2024-05-06", desktop: 498, mobile: 520 },
//     { date: "2024-05-07", desktop: 388, mobile: 300 },
//     { date: "2024-05-08", desktop: 149, mobile: 210 },
//     { date: "2024-05-09", desktop: 227, mobile: 180 },
//     { date: "2024-05-10", desktop: 293, mobile: 330 },
//     { date: "2024-05-11", desktop: 335, mobile: 270 },
//     { date: "2024-05-12", desktop: 197, mobile: 240 },
//     { date: "2024-05-13", desktop: 197, mobile: 160 },
//     { date: "2024-05-14", desktop: 448, mobile: 490 },
//     { date: "2024-05-15", desktop: 473, mobile: 380 },
//     { date: "2024-05-16", desktop: 338, mobile: 400 },
//     { date: "2024-05-17", desktop: 499, mobile: 420 },
//     { date: "2024-05-18", desktop: 315, mobile: 350 },
//     { date: "2024-05-19", desktop: 235, mobile: 180 },
//     { date: "2024-05-20", desktop: 177, mobile: 230 },
//     { date: "2024-05-21", desktop: 82, mobile: 140 },
//     { date: "2024-05-22", desktop: 81, mobile: 120 },
//     { date: "2024-05-23", desktop: 252, mobile: 290 },
//     { date: "2024-05-24", desktop: 294, mobile: 220 },
//     { date: "2024-05-25", desktop: 201, mobile: 250 },
//     { date: "2024-05-26", desktop: 213, mobile: 170 },
//     { date: "2024-05-27", desktop: 420, mobile: 460 },
//     { date: "2024-05-28", desktop: 233, mobile: 190 },
//     { date: "2024-05-29", desktop: 78, mobile: 130 },
//     { date: "2024-05-30", desktop: 340, mobile: 280 },
//     { date: "2024-05-31", desktop: 178, mobile: 230 },
//     { date: "2024-06-01", desktop: 178, mobile: 200 },
//     { date: "2024-06-02", desktop: 470, mobile: 410 },
//     { date: "2024-06-03", desktop: 103, mobile: 160 },
//     { date: "2024-06-04", desktop: 439, mobile: 380 },
//     { date: "2024-06-05", desktop: 88, mobile: 140 },
//     { date: "2024-06-06", desktop: 294, mobile: 250 },
//     { date: "2024-06-07", desktop: 323, mobile: 370 },
//     { date: "2024-06-08", desktop: 385, mobile: 320 },
//     { date: "2024-06-09", desktop: 438, mobile: 480 },
//     { date: "2024-06-10", desktop: 155, mobile: 200 },
//     { date: "2024-06-11", desktop: 92, mobile: 150 },
//     { date: "2024-06-12", desktop: 492, mobile: 420 },
//     { date: "2024-06-13", desktop: 81, mobile: 130 },
//     { date: "2024-06-14", desktop: 426, mobile: 380 },
//     { date: "2024-06-15", desktop: 307, mobile: 350 },
//     { date: "2024-06-16", desktop: 371, mobile: 310 },
//     { date: "2024-06-17", desktop: 475, mobile: 520 },
//     { date: "2024-06-18", desktop: 107, mobile: 170 },
//     { date: "2024-06-19", desktop: 341, mobile: 290 },
//     { date: "2024-06-20", desktop: 408, mobile: 450 },
//     { date: "2024-06-21", desktop: 169, mobile: 210 },
//     { date: "2024-06-22", desktop: 317, mobile: 270 },
//     { date: "2024-06-23", desktop: 480, mobile: 530 },
//     { date: "2024-06-24", desktop: 132, mobile: 180 },
//     { date: "2024-06-25", desktop: 141, mobile: 190 },
//     { date: "2024-06-26", desktop: 434, mobile: 380 },
//     { date: "2024-06-27", desktop: 448, mobile: 490 },
//     { date: "2024-06-28", desktop: 149, mobile: 200 },
//     { date: "2024-06-29", desktop: 103, mobile: 160 },
//     { date: "2024-06-30", desktop: 446, mobile: 400 },
// ]
const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    desktop: {
        label: "Doanh thu",
        color: "#2a9d90",
    },
    mobile: {
        label: "Lợi nhuận",
        color: "#e76e50",
    },
} satisfies ChartConfig

export function AreaChartList() {
    const { data: chartData, isLoading, isError } = useQuery({
        queryKey: ['chartData'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:8080/api/dashboard/get-data-area-chart');
            setFilteredData(data);
            return data;
        }
    })
    const [filterType, setFilterType] = React.useState("day"); // Mặc định lọc theo ngày
    const [startDate, setStartDate] = React.useState<string>("");
    const [endDate, setEndDate] = React.useState<string>("");
    const [filteredData, setFilteredData] = React.useState(chartData);

    const filterData = () => {
        const start = new Date(startDate || chartData[0].date);
        const end = new Date(endDate || chartData[chartData.length - 1].date);

        let newData = chartData?.filter((item: any) => {
            const date = new Date(item.date);

            // Lọc theo ngày
            if (filterType === "day") {
                return date >= start && date <= end;
            }

            // Lọc theo tháng
            if (filterType === "month") {
                return (
                    (date.getFullYear() > start.getFullYear() ||
                        (date.getFullYear() === start.getFullYear() && date.getMonth() >= start.getMonth())) &&
                    (date.getFullYear() < end.getFullYear() ||
                        (date.getFullYear() === end.getFullYear() && date.getMonth() <= end.getMonth()))
                );
            }

            // Lọc theo năm
            if (filterType === "year") {
                return date.getFullYear() >= start.getFullYear() && date.getFullYear() <= end.getFullYear();
            }

            return false;
        });

        // Nếu lọc theo tháng, tổng hợp dữ liệu theo tháng
        if (filterType === "month") {
            const groupedByMonth = {};

            newData.forEach((item: any) => {
                const date = new Date(item.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (!groupedByMonth[monthKey]) {
                    groupedByMonth[monthKey] = { date: monthKey, desktop: 0, mobile: 0 };
                }

                groupedByMonth[monthKey].desktop += item.desktop;
                groupedByMonth[monthKey].mobile += item.mobile;
            });

            newData = Object.values(groupedByMonth);
        }

        // Nếu lọc theo năm, tổng hợp dữ liệu theo năm
        if (filterType === "year") {
            const groupedByYear = {};

            newData.forEach((item: any) => {
                const date = new Date(item.date);
                const yearKey = `${date.getFullYear()}`;

                if (!groupedByYear[yearKey]) {
                    groupedByYear[yearKey] = { date: yearKey, desktop: 0, mobile: 0 };
                }

                groupedByYear[yearKey].desktop += item.desktop;
                groupedByYear[yearKey].mobile += item.mobile;
            });

            newData = Object.values(groupedByYear);
        }

        // console.log('newData', newData);
        setFilteredData(newData);
    };

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error</div>

    return (
        <Card className="col-span-1 lg:col-span-4">
            <CardHeader className="flex items-center sm:items-start gap-2 space-y-0 border-b py-5 2xl:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Biểu đồ doanh thu và lợi nhuận</CardTitle>
                    <CardDescription>
                        Biểu đồ so sánh doanh thu và lợi nhuận
                    </CardDescription>
                </div>

                {/* Chọn kiểu lọc */}
                <div className="flex flex-col xl:flex-row items-start gap-2">
                    <div className="flex flex-col lg:flex-row items-center gap-2">
                        {/* Chọn ngày bắt đầu và ngày kết thúc */}
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <label htmlFor="start">Ngày bắt đầu:</label>
                            <input
                                type="date"
                                id="start"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={chartData[0].date}
                                max={chartData[chartData.length - 1].date}
                                className="border rounded-lg px-2 py-1"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <label htmlFor="end">Ngày kết thúc:</label>
                            <input
                                type="date"
                                id="end"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={chartData[0].date}
                                max={chartData[chartData.length - 1].date}
                                className="border rounded-lg px-2 py-1"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <label htmlFor="start">Biểu đồ theo</label>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[150px] rounded-lg mt-0">
                                <SelectValue placeholder="Chọn kiểu lọc" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="day">Ngày</SelectItem>
                                <SelectItem value="month">Tháng</SelectItem>
                                <SelectItem value="year">Năm</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Nút lọc */}
                        <Button onClick={filterData} className="1408px:ml-4">
                            Lọc dữ liệu
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {/* Hiển thị biểu đồ */}
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[300px] w-full"
                >
                    <AreaChart
                        accessibilityLayer
                        data={filteredData}
                        className="aspect-auto h-[300px] w-full"
                    >
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2a9d90" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#2a9d90" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#e76e50" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#e76e50" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            minTickGap={24}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                if (filterType === "day") {
                                    return date.toLocaleDateString("vi-VN", {
                                        day: "numeric",
                                        month: "numeric",
                                        year: "numeric",
                                    });
                                }
                                if (filterType === "month") {
                                    return value; // Dữ liệu theo tháng đã ở dạng "YYYY-MM"
                                }
                                if (filterType === "year") {
                                    return date.getFullYear();
                                }
                                return value;
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={3}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        if (filterType === "day") {
                                            const date = new Date(value);
                                            return date.toLocaleDateString("vi-VN", {
                                                day: "numeric",
                                                month: "numeric",
                                                year: "numeric",
                                            });
                                        }
                                        if (filterType === "month") {
                                            return value; // Hiển thị "YYYY-MM"
                                        }
                                        if (filterType === "year") {
                                            return value; // Hiển thị năm
                                        }
                                        return value;
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="mobile"
                            type="natural"
                            fill="url(#fillMobile)"
                            stroke="#e76e50"
                            stackId="a"
                            fillOpacity={0.4}
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="#2a9d90"
                            stackId="a"
                            fillOpacity={0.4}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}