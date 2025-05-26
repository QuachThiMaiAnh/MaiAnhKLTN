import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../../../components/theme-provider';
import StatusCard from './_components/StatusCard';

const CartPage = () => {


    return <>
        <StatusCard />
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            < Outlet />
        </ThemeProvider>


    </>;
}

export default CartPage
