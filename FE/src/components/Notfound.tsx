import { useNavigate } from "react-router-dom";
import img from "../assets/notfound.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center h-[580px] justify-center p-3">
      <div
        className=" w-full max-w-[600px] h-[300px] md:h-[350px] lg:h-[450px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${img})`,
        }}
      />
      <button
        onClick={() => navigate("/")}
        className=" mb-20  px-3 py-1 text-[14px] sm:text-[15px] md:px-6 md:py-2 text-white bg-[#b8cd06] rounded-lg transition duration-300 hover:bg-[#a1b805] active:scale-95"
      >
        Trở về trang chủ
      </button>
    </div>
  );
};

export default NotFound;
