// InfoGeneralProduct.tsx
// Component chính để hiển thị và xử lý thông tin sản phẩm (name, mô tả, thuộc tính, biến thể...)

import { useEffect, useReducer, useState } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { tabProductData } from "@/common/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttributeTab from "./AttributeTab";
import { reducer } from "./reducer";

import { Attribute, Data, State } from "@/common/types/Orders";
import {
  formatDataLikeFields,
  getSelectedValues,
  getUniqueTypesFromFields,
} from "@/lib/utils";
import { useFieldArray } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useGetAtributes } from "../actions/useGetAttributes";
import VariationTab from "./VariationTab";
import { FormTypeProductVariation } from "@/common/types/validate";
import { Label } from "@/components/ui/label";

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const InfoGeneralProduct: React.FC<{
  id: boolean; // true nếu đang sửa sản phẩm
  form: FormTypeProductVariation;
  filteredData: Attribute[]; // thuộc tính lọc được từ sản phẩm đang chỉnh sửa ( đã dùng trong sản phẩm)
  attributeValue: Data[][]; // giá trị thuộc tính dạng nhóm theo type
  duplicate: number[]; // danh sách index các biến thể bị trùng (nếu có)
}> = ({ id, form, filteredData, attributeValue, duplicate }) => {
  // State & Hook

  const [valuetab, setValueTab] = useState("attributes"); // Tab hiện tại, mặc định là "attributes"
  const { attributes } = useGetAtributes(); // Lấy danh sách thuộc tính từ API
  const [openAccordionItem, setOpenAccordionItem] = useState<
    string | undefined
  >("item-1"); // Accordion đang mở/đóng

  const [previewImages, setPreviewImages] = useState<{
    [key: string]: string | "";
  }>({}); // Ảnh preview cho từng biến thể

  // Nếu có lỗi ở biến thể → tự động mở tab Variations
  useEffect(() => {
    const hasErrorInVariations =
      Boolean(form.formState.errors.variants) || Boolean(duplicate.length); // Kiểm tra xem có lỗi trong biến thể hay không
    if (hasErrorInVariations) {
      setOpenAccordionItem("item-1");
      setValueTab("variations");
    }
  }, [form.formState.errors]);

  const value = form.watch("descriptionDetail");
  const handleChange = (content: string) => {
    form.setValue("descriptionDetail", content);
  };

  // Khởi tạo state lưu trữ thuộc tính đã chọn và giá trị tương ứng
  const initialState: State = {
    attributesChoose: filteredData,
    valuesChoose: attributeValue,
    valuesMix: [],
  };

  // Sử dụng useReducer để quản lý state của thuộc tính
  const [stateAttribute, dispatch] = useReducer(reducer, initialState);

  // console.log("valueMix: ", stateAttribute.valuesMix);

  // Lưu giá trị đã chọn từ các select box thuộc tính
  const [selectedValues, setSelectedValues] = useState<Record<string, any>>(
    getSelectedValues(attributeValue, attributes)
  ); // {675e387b5cccfd8536c5f0e3: Array(3), 675db53037f987574e4e4a88: Array(1)}

  // Hàm xử lý khi giá trị thuộc tính thay đổi
  const handleAttributeValueChange = (
    attributeId: string,
    selectedOptions: {
      value: string;
      label: string;
      _id: string;
      attribute: string;
    }
  ) => {
    setSelectedValues((prev) => ({
      ...prev,
      [attributeId]: selectedOptions,
    }));
  };

  // Quản lý mảng biến thể trong form
  const { fields, replace, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  // Lưu ảnh preview của từng biến thể
  useEffect(() => {
    const initialImages = fields.reduce((acc, field) => {
      if (field.image) acc[field.id] = field.image;
      return acc;
    }, {} as { [key: string]: string | "" });
    setPreviewImages(initialImages);
  }, [fields]);

  const typeFields: string[] = getUniqueTypesFromFields(fields) as string[];

  return (
    <div className="w-full xl:w-3/4">
      {/* Tên sản phẩm */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                className="border rounded-sm h-8 px-2 mb-4"
                placeholder="Nhập tên sản phẩm"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Mô tả ngắn */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Nhập mô tả sản phẩm"
                {...field}
                rows={10}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Accordion chứa Tabs thuộc tính và biến thể */}
      <div className="border relative">
        <Accordion
          className="bg-white"
          type="single" // Chỉ mở 1 accordion item tại một thời điểm
          collapsible // Cho phép đóng toàn bộ nếu click lại
          value={openAccordionItem} // Trạng thái mở hiện tại
          onValueChange={(value) => setOpenAccordionItem(value)} // Cập nhật khi user chuyển accordion
          orientation="vertical"
        >
          <AccordionItem className="border-none" value="item-1">
            <AccordionTrigger className="border-b p-5 hover:no-underline">
              Thông tin sản phẩm
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <Tabs
                value={valuetab} // giá trị tab hiện tại (attributes | variations)
                onValueChange={(value) => setValueTab(value)}
                className="flex flex-col md:flex-row"
              >
                {/* Danh sách Tabs bên trái (hiển thị theo chiều dọc ở màn hình md trở lên) */}
                <TabsList
                  className="flex flex-col justify-start gap-2 h-auto bg-white border-b 
                       md:border-r border-black md:border-inherit rounded-none 
                       pb-3 md:p-0"
                >
                  {tabProductData.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="py-3 w-full data-[state=active]:bg-slate-200 
                           hover:bg-slate-100 data-[state=active]:rounded-none"
                      onClick={() => {
                        // Khi click vào tab Variations
                        if (tab.value === "variations") {
                          // Nếu đã có tổ hợp giá trị từ AttributeTab (valuesMix)
                          if (stateAttribute.valuesMix.length !== 0) {
                            // Format lại dữ liệu để khớp với fields của useFieldArray
                            const newFields = formatDataLikeFields(
                              stateAttribute.valuesMix
                            );

                            // Cập nhật lại danh sách biến thể trong form
                            replace(newFields);

                            // Ghi đè lại _id của các giá trị biến thể (dùng cho xử lý backend)
                            newFields.forEach((field, index) => {
                              field.values.forEach((value, indx) => {
                                form.setValue(
                                  `variants.${index}.values.${indx}._id`,
                                  value._id
                                );
                              });
                            });
                          }
                        }
                      }}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Tab: AttributeTab - hiển thị vùng chọn thuộc tính */}
                <TabsContent
                  className="px-3 pt-2 flex-1 min-h-[500px]"
                  value="attributes"
                >
                  <AttributeTab
                    attributes={attributes} // Danh sách thuộc tính lấy từ DB
                    stateAttribute={stateAttribute} // reducer state
                    dispatch={dispatch} // dispatch reducer để cập nhật attributes
                    selectedValues={selectedValues} // lưu trạng thái các select box
                    setSelectedValues={setSelectedValues}
                    handleAttributeValueChange={handleAttributeValueChange}
                    replaceFields={replace} // thao tác thay đổi danh sách biến thể
                  />
                </TabsContent>

                {/* Tab: VariationTab - hiển thị vùng quản lý biến thể sản phẩm */}
                <TabsContent
                  className="px-3 pt-2 w-full min-h-[300px]"
                  value="variations"
                >
                  <VariationTab
                    fields={fields} // danh sách các biến thể được bind từ useFieldArray
                    stateAttribute={stateAttribute}
                    typeFields={typeFields} // danh sách các type của thuộc tính đang dùng
                    form={form} // form hook để thao tác
                    attributes={attributes}
                    replaceFields={replace} // thay đổi danh sách biến thể
                    removeFields={remove} // xoá biến thể
                    duplicate={duplicate} // index các biến thể bị trùng (highlight ở VariationTab)
                    previewImages={previewImages} // ảnh preview
                    setPreviewImages={setPreviewImages} // cập nhật ảnh preview
                  />
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Thông báo lỗi ở biến thể nếu có */}
      <span className="block mt-3 text-red-700">
        {form.formState.errors.variants?.message ||
          form.formState.errors.variants?.root?.message}
      </span>

      {/* Mô tả chi tiết với trình soạn thảo rich text */}
      <div className="mt-9 w-full">
        <Label className="text-lg font-medium">Mô tả chi tiết</Label>
        <ReactQuill
          className="bg-white mt-4"
          placeholder="Viết mô tả chi tiết sản phẩm"
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
              ["link", "image"],
              ["clean"],
            ],
          }}
          formats={formats}
        />
      </div>
    </div>
  );
};

export default InfoGeneralProduct;
