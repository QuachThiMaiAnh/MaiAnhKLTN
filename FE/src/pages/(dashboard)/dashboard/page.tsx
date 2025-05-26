import { AreaChartList } from "./_components/AreaChartList";
import { CardTabsList } from "./_components/CardTabsList";
import { UserList } from "./_components/UserList";
import { TopProducts } from "./_components/TopProducts";
import { OrderList } from "./_components/OrderList";
import { useEffect } from "react";

export default function DashBoardPage() {
  useEffect(() => {
    document.title = "Thống kê";
  }, []);
  return (
    <div className="bg-[#f1f5f9] grid gap-y-4">
      <CardTabsList />
      {/* <AreaChartList /> */}
      <div className="grid grid-cols-1 gap-4">
        <OrderList />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <AreaChartList />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* <CircleTotal /> */}
        <UserList />
        <TopProducts />
      </div>
    </div>
  );
}
