// import imageEnd from "../../../../assets/products/imageEnd.png"

const SubscribeSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between pt-16 bg-white">
      {/* Hình ảnh bên trái */}
      <div className="md:flex hidden  justify-center md:ml-16 mb-8 md:mb-0 w-full md:w-1/2">
        <img
          src={"http://unionagency.one/exzo/img/background-8.jpg"}
          alt="Ưu Đãi Đặc Biệt"
          className=" max-h[100%] max-w[100%] object-cover"
        />
      </div>

      {/* Phần nội dung bên phải */}
      <div className="md:w-1/2 mx-5 text-center xl:pr-32">
        <div className="text-center">
          <p className="text-[#b8cd06] gap-1 font-questrial text-lg text-center uppercase mb-3">
            Ưu đãi đặc biệt{" "}
            <span className="text-[#555]">cho người đăng ký</span>
          </p>
          <h2 className="text-3xl justify-center font-extrabold font-raleway text-[#343434] mb-4 ">
            <span>
              
            </span>ƯU ĐÃI MỚI MỖI TUẦN <span className="text-[#b8cd06]">+</span>{" "}
              <br />
              HỆ THỐNG GIẢM GIÁ <span className="text-[#b8cd06]">+</span> GIÁ
              TỐT NHẤT
          </h2>
        </div>

        <p className="text-gray-500 text-sm mb-8">
          Hãy trải nghiệm những ưu đãi đặc biệt. Luôn có chương trình giảm giá
          mỗi tuần với mức giá tốt nhất dành cho bạn.
        </p>

        {/* <div className="flex mb-10 items-center border border-gray-300 rounded-full overflow-hidden">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="flex-1 text-sm py-2 md:py-3 pl-6 md:pl-6 text-gray-600 border-none placeholder-gray-400 focus:outline-none focus:border-transparent"
            style={{
              outline: "none",
              boxShadow: "none",
            }}
          />
          <button className="group relative md:pr-16 px-14 md:px-14 py-6 md:py-6 bg-[#b8cd06] text-white rounded-full overflow-hidden">
            <span className="absolute font-bold text-xs top-4 md:top-4 left-12 md:left-[53px] transition-all duration-200 ease-in-out transform group-hover:translate-x-full group-hover:opacity-0">
              Gửi
            </span>
            <span className="absolute inset-y-0 left-0 flex items-center justify-center w-full text-white transition-all duration-200 ease-in-out transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 md:w-5 md:h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SubscribeSection;
