//images
import client_logo_1 from '@/assets/images/client-logo-1.jpg'
import client_logo_2 from '@/assets/images/client-logo-2.jpg'
import bg_25 from '@/assets/images/background-25.jpg'
import thum_38 from '@/assets/images/thumbnail-38.jpg';

//ohter
import About_Us_Bg from '@/assets/images/about-us-bg.jpg'
import SlideShow from './_components/SlideShow'
import SlideOurTeam from './_components/SlideOurTeam'
import { Link } from 'react-router-dom'
import React from 'react';

const AboutUsPage = () => {
    React.useEffect(() => {
        document.title = "Giới Thiệu"; 
      }, []);
    return (
        <>
            <section style={{ backgroundImage: `url(${About_Us_Bg})` }} className='min-h-[600px] bg-cover bg-fixed bg-center bg-no-repeat text-white grid place-items-center'>
                <div className='grid place-items-center max-w-[650px] text-center gap-3 px-5'>
                    <span className='uppercase text-[34px] ms:text-[40px] font-bold'>Chúng tôi là fabricfocus</span>
                    <div className='h-2'>
                        <span className="w-14 h-[1px] inline-block align-top bg-white relative before:absolute before:content-[''] before:w-2 before:h-[1px] before:bg-white before:-left-3 before:top-0 after:absolute after:content-[''] after:w-2 after:h-[1px] after:bg-white after:-right-3 after:top-0"></span>
                    </div>
                    <span className=''>
                        Chúng tôi tin rằng thời trang không chỉ là những gì bạn mặc, mà còn là cách bạn thể hiện bản thân và kể câu chuyện của mình.
                    </span>
                </div>
            </section >
            <section className='w-full md:w-[730px] lg:w-[950px] xl:w-[1160px] mx-auto pt-24 px-4'>
                <div className='w-full grid lg:grid-cols-[500px_auto] gap-x-4'>
                    <div className='grid'>
                        <span className='uppercase'>Về chúng tôi</span>
                        <span className='uppercase text-[34px] ms:text-[40px] font-bold'>Chúng tôi là fabricfocus</span>
                        <div className='h-3'>
                            <span className="w-14 h-[1px] inline-block align-top bg-black relative before:absolute after:absolute after:content-[''] after:w-2 after:h-[1px] after:bg-black after:-right-3 after:top-0"></span>
                        </div>
                        <span>Được thành lập với niềm đam mê thời trang hiện đại, FabricFocus cam kết cung cấp trang phục độc đáo.</span>
                    </div>
                    <div className='grid gap-y-4 text-[#888] text-sm'>
                        <span>
                            Tại FabricFocus, chúng tôi chú ý đến từng chi tiết nhỏ để đảm bảo rằng mỗi sản phẩm đều hoàn hảo khi đến tay bạn. Từ việc chọn vải và màu sắc đến đường may, chúng tôi cam kết mang lại sự thoải mái và độ bền. Trong nỗ lực theo đuổi thời trang bền vững, chúng tôi chọn các vật liệu thân thiện với môi trường, để sản phẩm của chúng tôi không chỉ làm bạn trông đẹp mà còn góp phần vào một hành tinh tốt đẹp hơn.
                        </span>
                        <span>
                            Cho dù bạn thích phong cách thanh lịch, năng động hay tối giản, chúng tôi đều có những thiết kế phù hợp với bạn. Sứ mệnh của FabricFocus là giúp bạn cảm thấy tự tin trong mọi khoảnh khắc, dù bạn đang đi dạo trên phố, làm việc tại văn phòng hay tham dự một sự kiện đặc biệt.
                        </span>
                    </div>
                </div>
            </section>
            <section className={`w-full md:w-[730px] lg:w-[950px] xl:w-[1160px] mx-auto pt-24 px-4`}>
                <SlideShow />
            </section>
            <section className={`max-w-[1408px] mx-auto pt-[140px] px-4 flex flex-col gap-y-16`}>
                <div className='grid place-items-center max-w-[650px] text-center gap-3 px-5 mx-auto'>
                    <span className='uppercase text-[#555]'>Nhóm chúng tôi</span>
                    <span className='uppercase text-[34px] ms:text-[40px] font-bold'>
                        gặp gỡ các chuyên gia
                    </span>
                    <div className='h-2'>
                        <span className="w-14 h-[1px] inline-block align-top bg-[#c2d805] relative before:absolute before:content-[''] before:w-2 before:h-[1px] before:bg-[#c2d805] before:-left-3 before:top-0 after:absolute after:content-[''] after:w-2 after:h-[1px] after:bg-[#c2d805] after:-right-3 after:top-0"></span>
                    </div>
                </div>
                <div className='w-full md:w-[730px] lg:w-[950px] xl:w-[1160px] mx-auto px-4'>
                    <SlideOurTeam />
                </div>
            </section>
            <section className={`w-full md:w-[730px] lg:w-[950px] xl:w-[1160px] mx-auto pt-[140px] px-4 flex flex-col gap-y-16`}>
                <div className='grid place-items-center max-w-[650px] text-center gap-3 px-5 mx-auto'>
                    <span className='uppercase text-[#555]'>Thương hiệu của chúng tôi</span>
                    <span className='uppercase text-[34px] ms:text-[40px] font-bold'>
                        Đối tác của chúng tôi
                    </span>
                    <div className='h-2'>
                        <span className="w-14 h-[1px] inline-block align-top bg-[#c2d805] relative before:absolute before:content-[''] before:w-2 before:h-[1px] before:bg-[#c2d805] before:-left-3 before:top-0 after:absolute after:content-[''] after:w-2 after:h-[1px] after:bg-[#c2d805] after:-right-3 after:top-0"></span>
                    </div>
                </div>
                <div className='Client_Logo grid grid-cols-2 grid-rows-5 md:grid-cols-4 md:grid-rows-3 lg:grid-cols-5 lg:grid-rows-2 *:border *:-mt-[1px] *:-mr-[1px]'>
                    <Link to="">
                        <div className='group relative overflow-hidden place-items-center'>
                            <img className='transition-all duration-500 translate-y-0 group-hover:-translate-y-full' src={client_logo_1} alt="client_logo_1" />
                            <img className='absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500 translate-y-full group-hover:translate-y-0' src={client_logo_2} alt="client_logo_1" />
                        </div>
                    </Link>
                    <Link to="">
                        <div className='group relative overflow-hidden place-items-center'>
                            <img className='transition-all duration-500 translate-y-0 group-hover:-translate-y-full' src={client_logo_1} alt="client_logo_1" />
                            <img className='absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500 translate-y-full group-hover:translate-y-0' src={client_logo_2} alt="client_logo_1" />
                        </div>
                    </Link>
                    <Link to="">
                        <div className='group relative overflow-hidden place-items-center'>
                            <img className='transition-all duration-500 translate-y-0 group-hover:-translate-y-full' src={client_logo_1} alt="client_logo_1" />
                            <img className='absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500 translate-y-full group-hover:translate-y-0' src={client_logo_2} alt="client_logo_1" />
                        </div>
                    </Link>
                    <Link to="">
                        <div className='group relative overflow-hidden place-items-center'>
                            <img className='transition-all duration-500 translate-y-0 group-hover:-translate-y-full' src={client_logo_1} alt="client_logo_1" />
                            <img className='absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500 translate-y-full group-hover:translate-y-0' src={client_logo_2} alt="client_logo_1" />
                        </div>
                    </Link>
                    <Link to="">
                        <div className='group relative overflow-hidden place-items-center'>
                            <img className='transition-all duration-500 translate-y-0 group-hover:-translate-y-full' src={client_logo_1} alt="client_logo_1" />
                            <img className='absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500 translate-y-full group-hover:translate-y-0' src={client_logo_2} alt="client_logo_1" />
                        </div>
                    </Link>
                    <Link to="">
                        <div className='group relative overflow-hidden place-items-center'>
                            <img className='transition-all duration-500 translate-y-0 group-hover:-translate-y-full' src={client_logo_1} alt="client_logo_1" />
                            <img className='absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500 translate-y-full group-hover:translate-y-0' src={client_logo_2} alt="client_logo_1" />
                        </div>
                    </Link>
                    <Link to="">
                        <div className='group relative overflow-hidden place-items-center'>
                            <img className='transition-all duration-500 translate-y-0 group-hover:-translate-y-full' src={client_logo_1} alt="client_logo_1" />
                            <img className='absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500 translate-y-full group-hover:translate-y-0' src={client_logo_2} alt="client_logo_1" />
                        </div>
                    </Link>
                    <Link to="">
                        <div className='group relative overflow-hidden place-items-center'>
                            <img className='transition-all duration-500 translate-y-0 group-hover:-translate-y-full' src={client_logo_1} alt="client_logo_1" />
                            <img className='absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500 translate-y-full group-hover:translate-y-0' src={client_logo_2} alt="client_logo_1" />
                        </div>
                    </Link>
                    <Link to="">
                        <div className='group relative overflow-hidden place-items-center'>
                            <img className='transition-all duration-500 translate-y-0 group-hover:-translate-y-full' src={client_logo_1} alt="client_logo_1" />
                            <img className='absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500 translate-y-full group-hover:translate-y-0' src={client_logo_2} alt="client_logo_1" />
                        </div>
                    </Link>
                    <Link to="">
                        <div className='group relative overflow-hidden place-items-center'>
                            <img className='transition-all duration-500 translate-y-0 group-hover:-translate-y-full' src={client_logo_1} alt="client_logo_1" />
                            <img className='absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500 translate-y-full group-hover:translate-y-0' src={client_logo_2} alt="client_logo_1" />
                        </div>
                    </Link>
                </div>
            </section>
            <section className={`w-full md:w-[730px] lg:w-[950px] xl:w-[1160px] mx-auto pt-[140px] px-4 grid`}>
                <div className='grid grid-cols-1 lg:grid-cols-2 place-items-center'>
                    <div className='hidden lg:block'>
                        <img src={bg_25} alt="bg_25" />
                    </div>
                    <div className='flex flex-col gap-x-4 gap-y-14'>
                        <div className='Title grid gap-y-3'>
                            <span className='uppercase text-[#555]'>Âm thanh thực</span>
                            <span className='uppercase text-[34px] ms:text-[40px] font-bold'>
                                cảm nhận nhịp điệu hoàn hảo
                            </span>
                            <div className='h-2'>
                                <span className="w-2 h-[1px] inline-block align-top bg-[#c2d805] relative after:absolute after:content-[''] after:w-14 after:h-[1px] after:bg-[#c2d805] after:-right-[3.75rem] after:top-0"></span>
                            </div>
                            <span className='text-[#555]'>
                                Tại FabricFocus, chúng tôi tạo ra những thiết kế độc đáo kết hợp phong cách hiện đại và sự thoải mái. Mỗi sản phẩm đều được chăm chút tỉ mỉ từ chất liệu đến đường may, mang đến trải nghiệm thời trang hoàn hảo cho bạn.
                            </span>
                        </div>
                        <div className='Content_Feel grid gap-y-7'>
                            <div className='flex gap-x-0 md:gap-x-6'>
                                <img className='rounded-xl w-[200px] h-[150px]' src={thum_38} alt="thum38" />
                                <div className='flex flex-col justify-center gap-y-3 text-sm'>
                                    <div className='uppercase font-bold'>
                                        Chiếc thuyền bây giờ đã đi
                                    </div>
                                    <span className='text-[#555]'>
                                        Tôi cũng rất buồn và bóng rổ. Bệnh tật hay bệnh tật không cần chăm sóc dễ dàng. Dịch vụ khách hàng phải luôn đi trước xe cộ
                                    </span>
                                </div>
                            </div>
                            <div className='flex gap-x-0 md:gap-x-6'>
                                <img className='rounded-xl w-[200px] h-[150px]' src={thum_38} alt="thum38" />
                                <div className='flex flex-col justify-center gap-y-3 text-sm'>
                                    <div className='uppercase font-bold'>
                                        Chiếc thuyền bây giờ đã đi
                                    </div>
                                    <span className='text-[#555]'>
                                        Tôi cũng rất buồn và bóng rổ. Bệnh tật hay bệnh tật không cần chăm sóc dễ dàng. Dịch vụ khách hàng phải luôn đi trước xe cộ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutUsPage