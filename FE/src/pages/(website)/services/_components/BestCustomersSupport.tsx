const BestCustomersSupport = () => {
  return (
    <div className="container mt-[140px]  mb-[140px] max-[991px]:mt-[70px] max-[991px]:mb-[70px] px-4 relative min-[1200px]:w-[1170px] min-[992px]:w-[970px] min-[768px]:w-[750px]">
      {/* title best customers support */}
      <div className="text-center">
        <div className="text-[14px] highlight leading-[22px] text-[#555] uppercase mb-[5px]">
          our award
        </div>
        <div
          className="text-[40px] highlight max-[767px]:text-[34px] max-[767px]:leading-[40px] leading-[46px] text-[#343434] font-black uppercase"
          style={{
            fontFamily: "'Raleway', sans-serif",
          }}
        >
          Hỗ trợ khách hàng tốt nhất
        </div>
        <div className="p-[20px_0]  title-underline h-[21px]">
          <span className="w-[55px]  text-[#c2d805] h-[1px] bg-current inline-block align-top relative"></span>
        </div>
      </div>
      {/* end title best customers support */}
      {/* Quisque scelerisque leo nisl */}
      <div className="grid mt-[70px] gap-y-[30px] max-[768px]:grid-cols-1 grid-cols-[45%_55%] justify-center items-center">
        <div className="">
          <img
            className="mx-auto"
            src="/src/assets/icons/thumbnail-34.jpg"
            alt="icon"
          />
        </div>
        <div>
          <div className="">
            <div className="px-4">
              <h4
                className="text-[18px] px-4 highlight leading-[24px] text-[#343434] font-black uppercase mb-[22px]"
                style={{
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
              Một sự kết hợp giữa các yếu tố tạo nên sự hoàn hảo.
              </h4>
              <p className="mb-[22px]  highlight text-[#888]">
              Một hệ thống được xây dựng một cách kỹ lưỡng, với sự phối hợp hoàn hảo giữa các yếu tố, mang lại sự ổn định và hiệu quả. Chúng tôi chú trọng đến từng chi tiết nhỏ, đảm bảo mọi phần đều hoàn thiện và tối ưu hóa hiệu suất. Mọi thứ đều được chuẩn bị chu đáo, hướng đến sự thành công và hiệu quả lâu dài. Chúng tôi cam kết mang đến những giải pháp tối ưu, dễ dàng tiếp cận và đáp ứng mọi nhu cầu của khách hàng.
              </p>
              <p className="text-[#888] highlight">
              Chúng tôi luôn duy trì sự xuất sắc và uy tín trong mọi dịch vụ mà mình cung cấp. Với các giải pháp linh hoạt và đa dạng, đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn, từ những vấn đề nhỏ nhất cho đến những yêu cầu phức tạp. Môi trường làm việc của chúng tôi luôn sạch sẽ, ngăn nắp và chuyên nghiệp, đảm bảo mang lại sự hài lòng tối đa cho khách hàng. Chúng tôi tận dụng tối đa mọi nguồn lực để tạo ra những kết quả xuất sắc, đáp ứng mọi yêu cầu khắt khe. Cam kết mang lại sự hoàn hảo trong từng chi tiết, mỗi sản phẩm và dịch vụ mà chúng tôi cung cấp.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* end Quisque scelerisque leo nisl */}
    </div>
  );
};

export default BestCustomersSupport;
