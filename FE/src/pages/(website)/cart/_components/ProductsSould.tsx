import ImgProduct from "../../../../assets/products/product-1.svg";
const ProductsSould = () => {
    return (
        <>
            <div className="space-y-8 2xl:w-[1408px] py-4 xl:w-[88%] px-4 max-[830px]:flex-col max-[830px]:flex  gap-x-16 mx-auto">
                <div className="Your_Cart flex flex-col gap-6 max-[1440px]:pl-2 max-[1408px]:pl-0">
                    {/* Mid  */}
                    <div className="Mid flex flex-col gap-6">
                        <div className="grid transition-all duration-500 grid-cols-[81px_auto] max-sm:grid-cols-[75px_auto] gap-x-4 border-[#F4F4F4] border-b pb-6">
                            {/* Image */}
                            <div className="Image_Product">
                                <div className="border border-[#dddcdc] rounded-[6px] p-1">
                                    <img className="w-full h-full" src={ImgProduct} alt="img" />
                                </div>
                            </div>
                            {/* Information */}
                            <div className="flex flex-col gap-3">
                                <div className="flex max-sm:grid max-sm:grid-cols-[50%_auto] max-sm:grid-rows-[auto_auto] justify-between items-center gap-4">
                                    <div className="text-[#9D9EA2] flex w-[45%] max-sm:w-full transition-all duration-500 max-sm:text-[14px]">
                                        <div className="hover:text-black">
                                            <a href="#">Khalifa Kush (AAAA) Khalifa Kush</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 max-sm:col-start-1 max-sm:row-start-2">
                                        <div className="flex rounded-[6px] *:transition-all duration-500">
                                            <div className="border border-[#F4F4F4] rounded-[4px] bg-[#F4F4F4] px-[12.8px] py-[5px] text-black">
                                                x 2
                                            </div>
                                        </div>
                                        <div className="">
                                            <p>
                                                $<span>120.00</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="group transition-all pb-0 max-sm:col-start-2 max-sm:row-start-1 max-sm:col-span-2 max-sm:justify-self-center max-sm:mb-2">
                                        <div className="border border-[#F4F4F4] rounded-[4px] bg-[#F4F4F4] px-[12.8px] py-[5px] text-black">
                                            $<span>220.00</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Attribute */}
                                <div className="flex items-center gap-4 max-sm:justify-between">
                                    <div className="text-[#9D9EA2] w-[51%] max-[1408px]:w-[49%] max-xl:w-[47%] max-lg:w-[52%] transition-all duration-500 max-sm:text-[14px]">
                                        <p>Size, Color</p>
                                        <div className="flex items-center w-24 gap-3 border rounded-md py-1 px-3 cursor-pointer max-sm:*:text-[14px] mt-[10px]">
                                            <div>
                                                <p>M</p>
                                            </div>
                                            <div className="bg-[#C3D2CC] px-1.5 max-sm:px-1 h-[2px]"></div>
                                            <div className="w-4 max-sm:w-3 h-4 max-sm:h-3 bg-red-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Attribute */}
                            </div>
                        </div>

                        {/* Cart__Product */}
                        <div className="grid transition-all duration-500 grid-cols-[81px_auto] max-sm:grid-cols-[75px_auto] gap-x-4 border-[#F4F4F4] border-b pb-6">
                            {/* Image */}
                            <div className="Image_Product">
                                <div className="border border-[#dddcdc] rounded-[6px] p-1">
                                    <img className="w-full h-full" src={ImgProduct} alt="img" />
                                </div>
                            </div>
                            {/* Information */}
                            <div className="flex flex-col gap-3">
                                <div className="flex max-sm:grid max-sm:grid-cols-[50%_auto] max-sm:grid-rows-[auto_auto] justify-between items-center gap-4">
                                    <div className="text-[#9D9EA2] flex w-[45%] max-sm:w-full transition-all duration-500 max-sm:text-[14px]">
                                        <div className="hover:text-black">
                                            <a href="#">Khalifa Kush (AAAA) Khalifa Kush</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 max-sm:col-start-1 max-sm:row-start-2">
                                        <div className="flex rounded-[6px] *:transition-all duration-500">
                                            <div className="border border-[#F4F4F4] rounded-[4px] bg-[#F4F4F4] px-[12.8px] py-[5px] text-black">
                                                x 2
                                            </div>
                                        </div>
                                        <div className="">
                                            <p>
                                                $<span>120.00</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="group transition-all pb-0 max-sm:col-start-2 max-sm:row-start-1 max-sm:col-span-2 max-sm:justify-self-center max-sm:mb-2">
                                        <div className="border border-[#F4F4F4] rounded-[4px] bg-[#F4F4F4] px-[12.8px] py-[5px] text-black">
                                            $<span>220.00</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Attribute */}
                                <div className="flex items-center gap-4 max-sm:justify-between">
                                    <div className="text-[#9D9EA2] w-[51%] max-[1408px]:w-[49%] max-xl:w-[47%] max-lg:w-[52%] transition-all duration-500 max-sm:text-[14px]">
                                        <p>Size, Color</p>
                                        <div className="flex items-center w-24 gap-3 border rounded-md py-1 px-3 cursor-pointer max-sm:*:text-[14px] mt-[10px]">
                                            <div>
                                                <p>M</p>
                                            </div>
                                            <div className="bg-[#C3D2CC] px-1.5 max-sm:px-1 h-[2px]"></div>
                                            <div className="w-4 max-sm:w-3 h-4 max-sm:h-3 bg-red-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Attribute */}
                            </div>
                        </div>

                        {/* End Cart__Product */}
                        {/*Cart__Product */}

                        <div className="grid transition-all duration-500 grid-cols-[81px_auto] max-sm:grid-cols-[75px_auto] gap-x-4 border-[#F4F4F4] border-b pb-6">
                            {/* Image */}
                            <div className="Image_Product">
                                <div className="border border-[#dddcdc] rounded-[6px] p-1">
                                    <img className="w-full h-full" src={ImgProduct} alt="img" />
                                </div>
                            </div>
                            {/* Information */}
                            <div className="flex flex-col gap-3">
                                <div className="flex max-sm:grid max-sm:grid-cols-[50%_auto] max-sm:grid-rows-[auto_auto] justify-between items-center gap-4">
                                    <div className="text-[#9D9EA2] flex w-[45%] max-sm:w-full transition-all duration-500 max-sm:text-[14px]">
                                        <div className="hover:text-black">
                                            <a href="#">Khalifa Kush (AAAA) Khalifa Kush</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 max-sm:col-start-1 max-sm:row-start-2">
                                        <div className="flex rounded-[6px] *:transition-all duration-500">
                                            <div className="border border-[#F4F4F4] rounded-[4px] bg-[#F4F4F4] px-[12.8px] py-[5px] text-black">
                                                x 2
                                            </div>
                                        </div>
                                        <div className="">
                                            <p>
                                                $<span>120.00</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="group transition-all pb-0 max-sm:col-start-2 max-sm:row-start-1 max-sm:col-span-2 max-sm:justify-self-center max-sm:mb-2">
                                        <div className="border border-[#F4F4F4] rounded-[4px] bg-[#F4F4F4] px-[12.8px] py-[5px] text-black">
                                            $<span>220.00</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Attribute */}
                                <div className="flex items-center gap-4 max-sm:justify-between">
                                    <div className="text-[#9D9EA2] w-[51%] max-[1408px]:w-[49%] max-xl:w-[47%] max-lg:w-[52%] transition-all duration-500 max-sm:text-[14px]">
                                        <p>Size, Color</p>
                                        <div className="flex items-center w-24 gap-3 border rounded-md py-1 px-3 cursor-pointer max-sm:*:text-[14px] mt-[10px]">
                                            <div>
                                                <p>M</p>
                                            </div>
                                            <div className="bg-[#C3D2CC] px-1.5 max-sm:px-1 h-[2px]"></div>
                                            <div className="w-4 max-sm:w-3 h-4 max-sm:h-3 bg-red-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Attribute */}
                            </div>
                        </div>
                        {/*Cart__Product */}
                    </div>
                    {/* End Mid  */}
                </div>
            </div>
        </>
    );
};

export default ProductsSould;
