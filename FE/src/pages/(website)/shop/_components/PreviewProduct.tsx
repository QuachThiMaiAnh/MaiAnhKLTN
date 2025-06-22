// ✅ React core hooks và Portal API
import { useEffect, useState } from "react"; // Quản lý state và side effects
import { createPortal } from "react-dom"; // Dùng để render modal ra ngoài DOM gốc (vào <body>)

// ✅ Icon sử dụng trong modal (giỏ hàng, đóng, yêu thích, đánh giá sao)
import { IoBagHandleSharp, IoClose } from "react-icons/io5"; // Giỏ hàng + nút đóng modal
import { SlHeart } from "react-icons/sl"; // Icon trái tim (wishlist)
import { TiStarFullOutline } from "react-icons/ti"; // Icon ngôi sao đánh giá

// ✅ Carousel hiển thị ảnh sản phẩm dạng slide
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"; // Component carousel tuỳ biến + API điều khiển

// ✅ ToggleGroup dùng để chọn thuộc tính (color, size, ...)
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // Nhóm nút chọn một giá trị

// ✅ Kiểu dữ liệu sản phẩm và các hàm xử lý liên quan đến sản phẩm
import { IProduct } from "@/common/types/Orders"; // Kiểu sản phẩm đơn hàng
import {
  extractAttributes, // Tách thuộc tính từ danh sách biến thể
  filterAndFormatAttributes, // Lọc và định dạng thuộc tính theo lựa chọn
  formatCurrency, // Định dạng giá theo VNĐ
} from "@/lib/utils";

// ✅ Context người dùng hiện tại (lấy userId, thông tin đăng nhập)
import { useUserContext } from "@/common/context/UserProvider";

// ✅ Hook thêm sản phẩm vào giỏ hàng
import { useAddToCart } from "../actions/useAddToCart";

// ✅ Thư viện thông báo (toast message)
import { toast } from "@/components/ui/use-toast";

// ✅ Dùng để điều hướng nội bộ trong SPA
import { Link } from "react-router-dom";

// ✅ Hook và kiểu dữ liệu liên quan đến danh sách yêu thích (wishlist)
import { useAddToWishList } from "../../wishlist/action/useAddToWishList"; // Thêm vào wishlist
import { useGetWishList } from "../../wishlist/action/useGetWishList"; // Lấy danh sách wishlist
import { CommentProducts, Product } from "@/common/types/Products"; // Kiểu dữ liệu sản phẩm và đánh giá

const PreviewProduct = ({
  // Nhận vào 3 props: trạng thái mở modal, hàm đóng modal, và ID sản phẩm được chọn
  isOpen,
  onClose,
  selectedIndex,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedIndex: string | null;
}) => {
  // Lấy ID người dùng hiện tại từ context
  const { _id } = useUserContext();

  // State quản lý carousel ảnh sản phẩm (API điều khiển và chỉ số ảnh đang hiển thị)
  const [apiImage, setApiImage] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Số lượng sản phẩm muốn thêm vào giỏ hàng
  const [quantity, setQuantity] = useState(1);

  // Dữ liệu sản phẩm được fetch để hiển thị trong modal
  const [productPopup, setProductPopup] = useState<IProduct>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Các hook thao tác với giỏ hàng và wishlist
  const { addCart, isAdding } = useAddToCart();
  const { addWishList } = useAddToWishList();

  // Lấy danh sách sản phẩm yêu thích từ server
  const { wishList } = useGetWishList(_id);

  // State dùng để xác định thuộc tính nào còn hợp lệ sau khi người dùng đã chọn 1 thuộc tính
  const [attributesChoose, setAttributesChoose] = useState<
    Record<string, string[][]>
  >({});

  // State chứa các thuộc tính đã được người dùng chọn (theo định dạng: {color: "id1", size: "id2"})
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  // Khi ID sản phẩm được chọn thay đổi, gọi API để lấy thông tin sản phẩm tương ứng
  useEffect(() => {
    if (!selectedIndex || productPopup?._id === selectedIndex) return;

    // Reset lại các lựa chọn thuộc tính
    setSelectedAttributes({});

    const fetchProduct = async () => {
      setIsLoading(true);
      setAttributesChoose({}); // Reset gợi ý thuộc tính

      // Gọi API để lấy thông tin sản phẩm theo ID
      const response = await fetch(
        `http://localhost:8080/api/products/${selectedIndex}`
      );
      const data = await response.json();
      setIsLoading(false);
      setProductPopup(data); // Gán dữ liệu sản phẩm vào state
    };

    fetchProduct();
  }, [selectedIndex, productPopup?._id]);

  // Khi carousel được mount, lắng nghe sự kiện chuyển slide để cập nhật chỉ số ảnh
  useEffect(() => {
    if (!apiImage) {
      return;
    }

    setCurrent(apiImage.selectedScrollSnap() + 1);

    apiImage.on("select", () => {
      setCurrent(apiImage.selectedScrollSnap() + 1);
    });
  }, [apiImage]);

  // Đóng modal khi người dùng nhấn phím Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Nếu đang loading dữ liệu thì không render gì cả
  if (isLoading) {
    return null;
  }

  // Tách danh sách thuộc tính từ danh sách biến thể
  const attributesProduct =
    !isLoading &&
    Object.entries(extractAttributes(productPopup?.variants || []));

  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn một thuộc tính (color, size...)
  const handleAttributeSelect = (type: string, value: string) => {
    setSelectedAttributes((prev) => {
      const newSelected = { ...prev };

      if (type in newSelected) {
        if (newSelected[type] === value) {
          delete newSelected[type]; // Bỏ chọn nếu chọn lại giá trị đang chọn
        } else {
          newSelected[type] = value; // Cập nhật giá trị mới
        }
      } else {
        newSelected[type] = value; // Thêm mới
      }

      return newSelected;
    });

    if (!productPopup) return;

    // Tìm danh sách các giá trị hợp lệ còn lại sau khi đã chọn
    const attributeSelected = filterAndFormatAttributes(
      productPopup,
      type,
      value
    );

    setAttributesChoose((prev) => {
      const newSelected = { ...prev };

      // Cập nhật từng nhóm thuộc tính dựa trên kết quả filter
      Object.keys(attributeSelected).forEach((key) => {
        const newValue = attributeSelected[key];

        if (newSelected[key]) {
          if (
            newValue.length === newSelected[key][0].length &&
            newValue.every(
              (value, index) => value === newSelected[key][0][index]
            )
          ) {
            delete newSelected[key]; // Nếu không có gì thay đổi, loại bỏ
          } else {
            newSelected[key] = [newValue]; // Ghi đè nếu khác
          }
        } else {
          newSelected[key] = [newValue]; // Thêm mới
        }
      });

      return newSelected;
    });
  };

  // Tìm biến thể phù hợp với các thuộc tính người dùng đã chọn
  const variantChoose =
    Object.entries(selectedAttributes).length ===
    productPopup?.variants[0].values.length
      ? productPopup?.variants.find((variant) =>
          variant.values.every((values) =>
            Object.entries(selectedAttributes).some(([key, value]) => {
              return key === values.type && values._id === value;
            })
          )
        )
      : null;

  // Hàm xử lý khi bấm "thêm giỏ hàng"
  const handleAddToCart = async () => {
    if (!variantChoose) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn thuộc tính sản phẩm",
      });
      return;
    }

    if (quantity < 0) {
      toast({
        variant: "destructive",
        title: "Số lượng không hợp lệ",
      });
      return;
    }

    // Gửi dữ liệu lên server để thêm vào giỏ hàng
    const data = {
      productId: productPopup?._id,
      variantId: variantChoose._id,
      quantity: quantity,
      userId: _id,
    };

    addCart(data);
  };

  // Lấy số lượng tồn kho từ biến thể được chọn (nếu có), hoặc từ sản phẩm gốc
  const countStock = variantChoose
    ? variantChoose.countOnStock
    : productPopup?.countOnStock;

  // Tạo danh sách hình ảnh: ảnh chính + ảnh các biến thể có ảnh
  const images = [
    productPopup?.image,
    ...(productPopup?.variants
      ? productPopup.variants.filter((v) => {
          return v.image != "";
        })
      : []),
  ];

  // Lọc các đánh giá chưa bị xóa
  const activeData =
    productPopup?.comments?.filter((item: CommentProducts) => !item.deleted) ??
    [];

  // Tính tổng số sao
  const totalRating = activeData?.length
    ? activeData.reduce(
        (sum: number, item: CommentProducts) => sum + item.rating,
        0
      )
    : 0;

  // Tính điểm trung bình từ tổng sao và số đánh giá
  const averageRating = productPopup && totalRating / activeData.length;

  // ID danh mục cần ẩn (mặc định loại bỏ ID này nếu tồn tại)
  const targetId = "675dadfde9a2c0d93f9ba531";

  // Kiểm tra danh mục cần ẩn có tồn tại không
  const exists = productPopup?.category.find(
    (category) => category._id == targetId
  )
    ? true
    : false;

  // Nếu danh mục tồn tại và có từ 2 danh mục trở lên, loại bỏ danh mục ẩn
  const categories =
    productPopup?.category && productPopup?.category.length >= 2 && exists
      ? productPopup?.category.filter((category) => category._id !== targetId)
      : productPopup?.category;

  // console.log("attributesProduct", attributesProduct);
  // console.log("productPopup", productPopup);
  // console.log("attributesChoose", attributesChoose);
  // console.log("selectedAttributes", selectedAttributes);
  // console.log("variantChoose", variantChoose);

  return createPortal(
    // Overlay nền tối toàn màn hình, mờ dần theo trạng thái isOpen
    <div
      className={`fixed inset-0 bg-[#000c] z-50 backdrop-blur-sm transition-opacity duration-500 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } flex items-center justify-center`}
      onClick={onClose} // Đóng modal khi click ra ngoài
    >
      {/* Hộp modal hiển thị nội dung xem nhanh sản phẩm */}
      <div
        className={`absolute max-w-[1170px] top-0 left-0 right-0 bottom-0 overflow-auto bg-white p-4 rounded shadow-lg transform transition-transform duration-500 m-5 xl:mx-auto ${
          isOpen ? "scale-100 opacity-100" : "scale-120 opacity-0 p-[15px]"
        }`}
        onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click vào trong modal
      >
        <div className="grid grid-co1 md:grid-cols-2 py-10 px-[15px] lg:py-20 lg:px-[100px] overflow-hidden">
          {/* Cột trái: carousel ảnh sản phẩm */}
          <div className="px-[15px] mx-auto mb-[30px] md:mb-0">
            <Carousel className="w-full max-w-xs" setApi={setApiImage}>
              <CarouselContent>
                {images?.map((img, index: number) => (
                  <CarouselItem key={index}>
                    <img
                      className="w-full"
                      src={typeof img === "string" ? img : img?.image}
                      alt="Anh san pham"
                      loading="lazy"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Danh sách ảnh thumbnail bên dưới để chọn slide */}
            <div className="flex items-center mt-4 gap-2">
              {images.map((img, index: number) => (
                <div
                  key={index}
                  className={`${
                    index + 1 === current ? "border-[#b8cd06] border-4" : ""
                  } transition-all`}
                >
                  <img
                    key={index}
                    className={`size-14 `}
                    src={typeof img === "string" ? img : img?.image}
                    alt="Ảnh sản phẩm"
                    onClick={() => apiImage?.scrollTo(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cột phải: thông tin sản phẩm */}
          <div className="px-[15px]">
            {/* Hiển thị danh mục sản phẩm */}
            <div className="uppercase text-[#555] text-sm leading-5 flex gap-4 mb-2">
              {productPopup &&
                categories &&
                categories.map((category) => (
                  <Link
                    key={category._id}
                    onClick={onClose}
                    to={`/shopping?category=${category._id}`}
                    className=" hover:text-blue-900 hover:underline"
                  >
                    {category.name}
                  </Link>
                ))}
            </div>

            {/* Tên sản phẩm */}
            <h2 className="text-3xl leading-8 uppercase font-black font-raleway text-[#343434] mb-[25px]">
              {productPopup?.name}
            </h2>

            {/* Giá và đánh giá */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center md:mb-[25px]">
              {/* Giá bán / giá giảm */}
              <span className="uppercase text-lg text-[#555]">
                giá:{" "}
                <span className="text-red-700 font-semibold text-sm">
                  {variantChoose ? (
                    variantChoose.priceSale !== undefined &&
                    variantChoose.priceSale > 0 &&
                    variantChoose.priceSale < variantChoose.price ? (
                      <>
                        <span className=" text-xl">
                          {formatCurrency(variantChoose.priceSale ?? 0)} VNĐ
                        </span>
                        <span className="line-through ml-3 text-[#bcbcbc]">
                          {formatCurrency(variantChoose.price)} VNĐ
                        </span>
                      </>
                    ) : (
                      <span className="text-xl">
                        {formatCurrency(variantChoose.price)} VNĐ
                      </span>
                    )
                  ) : productPopup?.priceSale &&
                    productPopup?.priceSale > 0 &&
                    productPopup.priceSale < productPopup.price ? (
                    <>
                      <span className="text-xl">
                        {formatCurrency(productPopup?.priceSale)} VNĐ
                      </span>
                      <span className="line-through ml-3 text-[#bcbcbc]">
                        {formatCurrency(productPopup?.price)} VNĐ
                      </span>
                    </>
                  ) : (
                    <span className="text-xl">
                      {formatCurrency(productPopup?.price ?? 0)} VNĐ
                    </span>
                  )}
                </span>
              </span>

              {/* Hiển thị đánh giá sao */}
              <div className="flex gap-0.5 mb-[25px] md:mb-0">
                {[...Array(5)].map((_, index) => (
                  <TiStarFullOutline
                    key={index}
                    className={`text-[#b8cd06] ${
                      averageRating && index < Math.floor(averageRating)
                        ? "text-[#b8cd06]"
                        : "text-[#ccc]"
                    }`}
                  />
                ))}
                <span className="text-[13px] text-[#888] leading-5">
                  {(productPopup && productPopup.comments.length) || 0} Đánh giá
                </span>
              </div>
            </div>

            {/* Mô tả sản phẩm */}
            <p className="text-sm text-[#888] leading-[22px] mb-[30px]">
              {productPopup?.description}
            </p>

            {/* Hiển thị thuộc tính (màu sắc, size...) */}
            {attributesProduct &&
              attributesProduct.map(([key, value]) => (
                <div
                  className="mb-10 flex flex-col md:flex-row md:items-center"
                  key={key}
                >
                  <span className="uppercase text-[13px] text-[#343434] font-raleway font-black mb-2 w-full md:w-4/12">
                    {key}:
                  </span>

                  <ToggleGroup
                    className="justify-start gap-2 w-full md:w-8/12 flex-wrap px-[15px]"
                    type="single"
                    disabled={productPopup?.deleted}
                  >
                    {/* Hiển thị Toggle cho từng giá trị thuộc tính */}
                    {(value as string[]).map((item: string, idx: number) => {
                      if (item.split(":")[1].startsWith("#")) {
                        // Nếu là màu sắc (color code), hiển thị ô màu
                        return (
                          <ToggleGroupItem
                            onClick={() =>
                              handleAttributeSelect(key, item.split(":")[0])
                            }
                            key={`${item.split(":")[0]}-${idx}`}
                            className={`rounded-none border data-[state=on]:border-2 size-6 p-0 cusor-pointer transition-all`}
                            value={item.split(":")[0]}
                            style={{
                              backgroundColor: item.split(":")[1],
                            }}
                            disabled={
                              key in attributesChoose
                                ? !attributesChoose[key][0].includes(
                                    item.split(":")[0]
                                  )
                                : false
                            }
                          ></ToggleGroupItem>
                        );
                      } else {
                        // Nếu là size/text, hiển thị button text
                        return (
                          <ToggleGroupItem
                            onClick={() =>
                              handleAttributeSelect(key, item.split(":")[0])
                            }
                            className="rounded-none border data-[state=on]:border-2 data-[state=on]:text-black transition-all uppercase px-3 h-8"
                            value={item.split(":")[0]}
                            key={item.split(":")[0]}
                            disabled={
                              key in attributesChoose
                                ? !attributesChoose[key][0].includes(
                                    item.split(":")[0]
                                  )
                                : false
                            }
                          >
                            {item.split(":")[1]}
                          </ToggleGroupItem>
                        );
                      }
                    })}
                  </ToggleGroup>
                </div>
              ))}

            {/* Số lượng và trạng thái tồn kho */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center">
              <span className="uppercase text-[13px] text-[#343434] font-raleway font-black mb-2 w-full md:w-4/12">
                số lượng:
              </span>

              <div className="flex flex-col xl:flex-row md:items-start xl:items-center xl:h-[42px] ">
                <div className="flex items-center h-[42px]">
                  {/* Nút giảm số lượng */}
                  <button
                    className={`cursor-pointer flex justify-center items-center text-5xl font-light w-[50px] h-full text-center border border-r-0 rounded-tl-full rounded-bl-full text-[#333] outline-0 ${
                      productPopup?.deleted
                        ? "bg-gray-100 opacity-35 pointer-events-none"
                        : ""
                    }`}
                    onClick={() => {
                      if (quantity > 1) setQuantity(quantity - 1);
                    }}
                  >
                    -
                  </button>

                  {/* Input nhập số lượng */}
                  <input
                    className={`border py-2 text-center outline-0 max-w-24 ${
                      productPopup?.deleted
                        ? "bg-gray-100 opacity-35 pointer-events-none"
                        : ""
                    }`}
                    onChange={(e) => {
                      const input = e.target.value;
                      if (/^\d+$/.test(input) && Number(input) > 0) {
                        setQuantity(+e.target.value);
                      }
                    }}
                    value={productPopup?.deleted ? 0 : quantity}
                  />

                  {/* Nút tăng số lượng */}
                  <button
                    className={`cursor-pointer flex justify-center items-center text-3xl font-light w-[50px] h-full text-center border border-l-0 rounded-tr-full rounded-br-full text-[#333] ${
                      productPopup?.deleted
                        ? "bg-gray-100 opacity-35 pointer-events-none"
                        : ""
                    }`}
                    onClick={() => {
                      setQuantity(+quantity + 1);
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Thông báo trạng thái sản phẩm */}
                {productPopup?.deleted ? (
                  <span className="ml-4 text-xl text-red-700 font-bold mt-3 xl:mt-0 md:mb-4 xl:mb-0">
                    Sản phẩm ngừng bán
                  </span>
                ) : (
                  <span className="ml-4 text-xs">
                    {countStock} sản phẩm có sẵn
                  </span>
                )}
              </div>
            </div>

            {/* Nút thao tác: Thêm giỏ hàng / thêm yêu thích */}
            <div className="flex flex-col md:flex-row gap-2 text-[11px] font-raleway font-bold">
              <button
                className={`btn-add text-white uppercase flex-1 ${
                  isAdding ? "cursor-not-allowed" : ""
                } ${
                  productPopup?.deleted ? "opacity-30 pointer-events-none" : ""
                }`}
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                <span className="btn-add__wrapper text-[11px] px-[30px] rounded-full bg-[#343434] pt-[17px] pb-[15px] font-raleway">
                  <span className="icon">
                    <IoBagHandleSharp />
                  </span>
                  <span className="text">thêm giỏ hàng</span>
                </span>
              </button>

              <button
                className={`btn-add text-white uppercase flex-1 ${
                  productPopup?.deleted ? "opacity-30 pointer-events-none" : ""
                }`}
                onClick={() =>
                  addWishList({
                    userId: _id,
                    productId: productPopup?._id,
                    variantId: "",
                    quantity: 0,
                  })
                }
              >
                <span className="btn-add__wrapper text-[11px] px-[30px] border rounded-full text-[#343434] pt-[17px] pb-[15px] font-raleway">
                  <span className="icon">
                    <SlHeart
                      className={`text ${
                        wishList?.products.some(
                          (product: Product) =>
                            product.productItem._id === productPopup?._id
                        )
                          ? "text-red-700"
                          : ""
                      }`}
                    />
                  </span>
                  <span
                    className={`text ${
                      wishList?.products.some(
                        (product: Product) =>
                          product.productItem._id === productPopup?._id
                      )
                        ? "text-red-700"
                        : ""
                    }`}
                  >
                    thêm yêu thích
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Nút đóng modal (góc trên bên phải) */}
        <IoClose
          className="absolute top-4 right-4 text-4xl cursor-pointer"
          onClick={onClose}
        />
      </div>
    </div>,
    document.body // Mount modal vào thẳng thẻ body
  );
};

export default PreviewProduct;
