import ProductsSould from './ProductsSould'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const Order = () => {
    return (
        <>
            <div>
                <div className="space-y-8 2xl:w-[1408px] xl:w-[1200px] p-4 lg:w-[900px]  mx-auto flex justify-between items-center">
                    <div className=" 2xl:w-[1408px] py-4 border-b border-b-[#C8C9CB] xl:w-[1200px] w-full lg:w-[900px] lg:mt-[32px] mx-auto flex justify-between items-center">
                        <h3 className="text-[24px] font-medium">Your Order</h3>
                        <img className="" src="/src/assets/paid.png" alt="" />
                    </div>
                </div>
                {/*================= PRODUCTS ORDER====================  */}
                <ProductsSould />
                {/*=================END PRODUCTS ORDER  ====================  */}
                {/*=================TOTAL PRODUTS====================  */}
                <div className="space-y-8 2xl:w-[1408px] xl:w-[1200px] lg:grid lg:grid-cols-2 p-4 lg:w-[900px]  mx-auto flex justify-between items-center">
                    <div className=" 2xl:w-[1408px] py-4 border-b border-b-[#C8C9CB] xl:w-[1200px] w-full lg:w-[900px]  mx-auto flex justify-between items-center">
                        <h3 className="text-[24px] font-medium">TOTAL</h3>
                        <div className="text-[24px] text-red-500  font-semibold">
                            $497.00
                        </div>
                    </div>
                </div>
                {/*=================END TOTAL PRODUTS====================  */}
                <div className="2xl:w-[1408px] gap-0 lg:gap-16 xl:w-[1200px] lg:grid lg:grid-cols-2 p-4 lg:w-[900px] mx-auto flex lg:flex-row flex-col">
                    {/* =================ĐỊA CHỈ=================== */}
                    <div className="flex flex-col gap-y-4 justify-between w-full">
                        <div className="flex justify-between">
                            <div className="text-[#9D9EA2]">Shipping</div>
                            <div className="font-medium">New York, US</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-[#9D9EA2]">Shipping Options</div>
                            <div className="font-medium">Same-Day Dispatching</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-[#9D9EA2]">Email Money Transfer</div>
                            <div className="font-medium">Interac</div>
                        </div>
                    </div>
                    {/* =================ĐỊA CHỈ=================== */}
                    {/* ====================TOTAL==================== */}
                    <div className="flex flex-col gap-y-4 justify-between w-full mt-4 lg:mt-0">
                        <div className="flex justify-between">
                            <div className="text-[#9D9EA2]">Subtotal</div>
                            <div className="font-medium">$497.00</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-[#9D9EA2]">Discount</div>
                            <div className="font-medium">$0.0</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-[#9D9EA2]">Shipping Costs</div>
                            <div className="font-medium">$50.00</div>
                        </div>
                    </div>
                    {/* ====================TOTAL==================== */}
                </div>

                {/* ============================SUBtotal===================== */}
                <div className="2xl:w-[1408px] gap-16 xl:w-[1200px] lg:grid lg:grid-cols-2 p-4  lg:w-[900px] mx-auto">
                    <div></div>
                    <div className="flex flex-row lg:flex-row justify-between py-5 border-t border-t-[#F4F4F4] border-b border-b-[#F4F4F4]">
                        <h3 className="text-[20px] font-medium">TOTAL</h3>
                        <div className="text-[20px] text-red-500 font-semibold">
                            $497.00
                        </div>
                    </div>
                </div>

                {/* ============================SUBtotal===================== */}
            </div>
            <div className="2xl:w-[1408px] gap-16 xl:w-[1200px] p-4 lg:w-[900px] mx-auto flex justify-between items-center">
                <Link className="mx-auto text-[#9D9EA2]" to={`#`}>
                    New Order, Click button bellow
                </Link>
            </div>
            <div className="2xl:w-[1408px] gap-16 xl:w-[1200px] p-4 lg:w-[900px] mx-auto flex justify-between items-center">
                <Button className="mx-auto lg:w-40 rounded-[20px]">Shop Now</Button>
            </div>
        </>
    )
}

export default Order
