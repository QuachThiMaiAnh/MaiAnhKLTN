import { useNavigate } from "react-router-dom";
import img from "../assets/notfound.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center h-[580px] justify-center p-3">
      {/* Hình ảnh not found */}
      <div
        className="w-full max-w-[600px] h-[300px] md:h-[350px] lg:h-[450px] bg-cover bg-center rounded-md shadow-md"
        style={{
          backgroundImage: `url(${img})`,
        }}
      />

      {/* Nút trở về */}
      <button
        onClick={() => navigate("/")}
        className="mb-20 mt-6 px-4 py-2 text-sm sm:text-base md:px-6 md:py-2 rounded-lg 
                   bg-primary text-primary-foreground 
                   hover:bg-primary/90 active:scale-95 transition duration-300"
      >
        Trở về trang chủ
      </button>
    </div>
  );
};

export default NotFound;
