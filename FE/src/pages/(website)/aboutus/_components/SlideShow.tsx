// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import '@/App.css'

// import required modules
// import { Pagination } from 'swiper/modules';

// images
import thum_35 from '@/assets/images/thumbnail-35.jpg';
import thum_36 from '@/assets/images/thumbnail-36.jpg';
import thum_37 from '@/assets/images/thumbnail-37.jpg';

const SlideShow = () => {
    // const pagination = {
    //     clickable: true,
    //     renderBullet: function (index: any, className: any) {
    //         return '<span class="w-5 h-5 mt-14' + ' ' + className + '">' + (index + 1) + '</span>';
    //     },
    // };
    return (
        <>
            <Swiper
                breakpoints={{
                    1200: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    0: {
                        slidesPerView: 1,
                    },
                }}
                // pagination={pagination}
                // modules={[Pagination]}
                spaceBetween={30}
                className="mySwiper">
                <SwiperSlide>
                    <div className='flex flex-col gap-y-6 items-center hover:cursor-move'>
                        <img className='max-w-[415px] w-full rounded-xl' src={thum_35} alt="thum_35" />
                        <div className='Content max-w-[415px] text-[13px] lg:text-[16px] flex flex-col gap-y-[18px]'>
                            <h6 className='uppercase font-bold'>
                                Chiếc thuyền bây giờ đã đi
                            </h6>
                            <div className='text-[#888] text-sm'>
                                Tôi cũng rất buồn và bóng rổ. Bệnh tật hay bệnh tật không cần chăm sóc dễ dàng. Dịch vụ khách hàng phải luôn đi trước xe cộ
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='flex flex-col gap-y-6 items-center'>
                        <img className='max-w-[415px] w-full rounded-xl' src={thum_36} alt="thum_36" />
                        <div className='Content max-w-[415px] text-[13px] lg:text-[16px] flex flex-col gap-y-[18px]'>
                            <h6 className='uppercase font-bold'>
                                Tôi sẽ không trở thành nhân viên của điền trang, cũng không phải người giám sát
                            </h6>
                            <div className='text-[#888] text-sm'>
                                Tôi cũng rất buồn và bóng rổ. Bệnh tật hay bệnh tật không cần chăm sóc dễ dàng. Dịch vụ khách hàng phải luôn đi trước xe cộ
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='flex flex-col gap-y-6 items-center'>
                        <img className='max-w-[415px] w-full rounded-xl' src={thum_37} alt="thum_37" />
                        <div className='Content max-w-[415px] text-[13px] lg:text-[16px] flex flex-col gap-y-[18px]'>
                            <h6 className='uppercase font-bold'>
                                Tôi sẽ không trở thành nhân viên của điền trang, cũng không phải người giám sát
                            </h6>
                            <div className='text-[#888] text-sm'>
                                Tôi cũng rất buồn và bóng rổ. Bệnh tật hay bệnh tật không cần chăm sóc dễ dàng. Dịch vụ khách hàng phải luôn đi trước xe cộ
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='flex flex-col gap-y-6 items-center'>
                        <img className='max-w-[415px] w-full rounded-xl' src={thum_35} alt="thum_35" />
                        <div className='Content max-w-[415px] text-[13px] lg:text-[16px] flex flex-col gap-y-[18px]'>
                            <h6 className='uppercase font-bold'>
                                Chiếc thuyền bây giờ đã đi
                            </h6>
                            <div className='text-[#888] text-sm'>
                                Tôi cũng rất buồn và bóng rổ. Bệnh tật hay bệnh tật không cần chăm sóc dễ dàng. Dịch vụ khách hàng phải luôn đi trước xe cộ
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='flex flex-col gap-y-6 items-center'>
                        <img className='max-w-[415px] w-full rounded-xl' src={thum_36} alt="thum_36" />
                        <div className='Content max-w-[415px] text-[13px] lg:text-[16px] flex flex-col gap-y-[18px]'>
                            <h6 className='uppercase font-bold'>
                                Tôi sẽ không trở thành nhân viên của điền trang, cũng không phải người giám sát
                            </h6>
                            <div className='text-[#888] text-sm'>
                                Tôi cũng rất buồn và bóng rổ. Bệnh tật hay bệnh tật không cần chăm sóc dễ dàng. Dịch vụ khách hàng phải luôn đi trước xe cộ
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    )
}

export default SlideShow
