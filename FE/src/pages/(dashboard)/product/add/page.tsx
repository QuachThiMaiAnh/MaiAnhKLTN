import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// UI Components
import Container from "../_components/Container";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InfoGeneralProduct from "../_components/InfoProduct";
import StatusProduct from "../_components/StatusProduct";
import { toast } from "@/components/ui/use-toast";

// Schema & Types
import { productSchema } from "@/common/types/validate";
import { Attribute } from "@/common/types/Orders";

// API & Hooks
import { getProductEdit } from "../actions/api";
import { useCreateProduct } from "../actions/useCreateProduct";
import { useUpdateProduct } from "../actions/useUpdateProduct";
import { useGetAtributes } from "../actions/useGetAttributes";
import { UploadFiles } from "@/lib/upload";

// Utils
import {
  checkForDuplicateVariants,
  getUniqueAttributeValue,
  getUniqueTypes,
} from "@/lib/utils";
import { Console } from "console";

const ProductAddPage = () => {
  const { id } = useParams(); // Lấy `id` từ URL để xác định tạo mới hay chỉnh sửa
  const navigate = useNavigate();

  const [duplicate, setDuplicate] = useState<number[]>([]); // Lưu trữ các vị trí biến thể bị trùng
  const [isDoing, setIsDoing] = useState(false); // Trạng thái đang thực hiện thao tác

  const { createProduct, isCreatting } = useCreateProduct(); // Hook để tạo sản phẩm mới
  const { updateProduct, isUpdating } = useUpdateProduct(id!); // Hook để cập nhật sản phẩm

  const { isLoadingAtributes, attributes } = useGetAtributes(); // Hook để lấy danh sách thuộc tính sản phẩm

  // Đổi tiêu đề trang khi tạo sản phẩm mới
  useEffect(() => {
    if (!id) document.title = "Tạo sản phẩm mới";
    else document.title = "Chỉnh sửa sản phẩm";
  }, [id]);

  // Khởi tạo form với giá trị mặc định
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: id
      ? undefined // nếu là edit, sẽ reset sau khi fetch dữ liệu
      : {
          name: "",
          description: "",
          createdAt: "",
          updatedAt: "",
          deleted: false,
          price: 0,
          priceSale: 0,
          category: [],
          image: "",
          type: "variable",
        },
  });

  // Lấy dữ liệu sản phẩm khi `id` tồn tại
  const { data: product, isLoading } = useQuery({
    queryKey: id ? ["Products", id] : ["Products"],
    queryFn: async () => {
      if (id) {
        const data = await getProductEdit(id); // Lấy dữ liệu sản phẩm để chỉnh sửa
        form.reset(data); // cập nhật dữ liệu vào form
        return data;
      }
      return {};
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });

  // Xử lý khi submit form
  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    setIsDoing(true); // Đặt trạng thái đang thực hiện thao tác

    // Kiểm tra các biến thể có bị trùng hay không
    const duplicateValues = checkForDuplicateVariants(values); // Hàm kiểm tra trùng biến thể
    setDuplicate(duplicateValues);

    // Nếu có biến thể trùng, hiển thị thông báo lỗi và dừng lại
    if (duplicateValues.length) {
      const duplicatePositions = duplicateValues.map((i) => i + 1).join(", "); // Chuyển sang vị trí 1-based
      toast({
        variant: "destructive",
        title: "Trùng giá trị biến thể",
        description: `Các biến thể trùng tại vị trí thứ --->  ${duplicatePositions}`,
      });
      setIsDoing(false);
      return;
    }

    // Xử lý sự kiện khi upload ảnh (ảnh sản phẩm và các biến thể)
    const uploaded = await UploadFiles(values);

    if (id) {
      // Nếu có `id`, thực hiện cập nhật sản phẩm
      await updateProduct({ data: uploaded, id });
    } else {
      // Nếu không có `id`, thực hiện tạo sản phẩm mới
      await createProduct(uploaded);
    }

    navigate("/admin/products");
    setIsDoing(false);
  };

  // Loading UI
  if (isLoading || isLoadingAtributes) {
    return (
      <Container>
        <div className="spinner mx-auto"></div>
      </Container>
    );
  }

  // Lọc thuộc tính phù hợp khi edit sản phẩm
  const types = id ? getUniqueTypes(product) : []; //["màu sắc", "kích thước", "chất liệu"];
  const filteredData = types.length
    ? attributes.filter((item: Attribute) => types.includes(item.name))
    : []; // [// { name: "màu sắc", values: [....] }, { name: "kích thước", values: [....] }];

  const attributeValue = id ? getUniqueAttributeValue(product) : []; // [[{ type: "màu sắc", _id: "123", lable: "Đỏ", value: "#887766" },{}], [{ type: "kích thước", _id: "456", lable: "L", value: "L" },{}]];  Data[][]

  // console.log("types:", types);
  // console.log("filteredData:", filteredData);
  // console.log("attributeValue:", attributeValue);
  return (
    <>
      <h1 className="text-4xl font-normal font-raleway mb-5">
        {id ? "Cập nhật " : "Tạo "}sản phẩm
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-wrap xl:flex-nowrap gap-4">
            <InfoGeneralProduct
              id={!!id} // Kiểm tra xem có phải là chỉnh sửa hay không
              form={form} // Truyền form để lấy giá trị
              filteredData={filteredData} // Truyền dữ liệu thuộc tính đã sử dụng
              attributeValue={attributeValue} // Truyền giá trị thuộc tính đã sử dụng
              duplicate={duplicate} // Truyền các vị trí biến thể bị trùng
            />

            <StatusProduct form={form} loading={isDoing} />
          </div>

          <Button disabled={isDoing} type="submit">
            Lưu sản phẩm
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductAddPage;
