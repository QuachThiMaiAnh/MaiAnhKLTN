import { Outlet } from "react-router-dom";
import StatusCard from "./_components/StatusCard";

const CartPage = () => {
  return (
    <>
      <StatusCard />
      <Outlet />
    </>
  );
};

export default CartPage;
