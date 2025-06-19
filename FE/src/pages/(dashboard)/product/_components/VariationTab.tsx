import { Attribute, State, Variant } from "@/common/types/Orders";
import { FormTypeProductVariation } from "@/common/types/validate";
import { FieldArrayWithId } from "react-hook-form";

import { FaCloudUploadAlt } from "react-icons/fa";

// UI

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import {
  areArraysEqual,
  formatDataLikeFields,
  getAttributesUsedInArray,
  getUniqueTypesFromFields,
  updateFields,
} from "@/lib/utils";
import VariationValues from "./VariationValues";
import { VariantItem } from "@/common/types/Products";

const VariationTab = ({
  fields,
  stateAttribute,
  typeFields,
  form,
  attributes,
  replaceFields,
  removeFields,
  duplicate,
  previewImages,
  setPreviewImages,
}: {
  fields: FieldArrayWithId<Variant>[];
  stateAttribute: State;
  typeFields: string[];
  form: FormTypeProductVariation;
  attributes: Attribute[];
  replaceFields: (fields: Variant[]) => void;
  removeFields: (index: number) => void;
  duplicate: number[];
  previewImages: {
    [key: string]: string | "";
  };
  setPreviewImages: React.Dispatch<
    React.SetStateAction<{ [key: string]: string | "" }>
  >;
}) => {
  // Lựa chọn thao tác hàng loạt (tạo biến thể, xóa tất cả, đồng giá, đồng tồn kho,...)
  const [stateSelect, setStateSelect] = useState<string>("create");

  // Danh sách các accordion (biến thể) đang mở
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Khi có lỗi ở biến thể, tự động mở các accordion tương ứng để người dùng dễ sửa.
  useEffect(() => {
    const errorKeys = Object.keys(form.formState.errors.variants || {}).map(
      (index) => `variant-${index}`
    );

    // Mở các mục có lỗi
    setOpenItems((prev) => [...new Set([...prev, ...errorKeys])]);
  }, [form.formState.errors]);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setPreviewImages((prev) => ({
        ...prev,
        [id]: imageUrl,
      }));

      form.setValue(`variants.${index}.image`, file);
    }
  };

  const handleButtonClick = () => {
    //o	Tạo biến thể: Sinh biến thể từ tổ hợp giá trị thuộc tính đã chọn.
    if (stateSelect === "create") {
      if (stateAttribute.valuesMix.length !== 0) {
        // Lấy danh sách các loại thuộc tính từ stateAttribute (type)
        const typesFromReducer = getUniqueTypesFromFields(
          stateAttribute.attributesChoose
        );

        /**
         * Nếu loại thuộc tính không thay đổi (areArraysEqual trả về true):
            Cập nhật lại các biến thể hiện có bằng hàm updateFields (giữ lại các giá trị đã nhập trước đó nếu có thể).
            Nếu loại thuộc tính đã thay đổi:
            Tạo mới hoàn toàn danh sách biến thể từ tổ hợp giá trị (formatDataLikeFields).
         */
        const newFields = areArraysEqual(
          typeFields as string[],
          typesFromReducer as string[]
        )
          ? updateFields(fields, formatDataLikeFields(stateAttribute.valuesMix))
          : formatDataLikeFields(stateAttribute.valuesMix);

        replaceFields(newFields);
        newFields.forEach((field, index) => {
          field.values.forEach((value, indx) => {
            form.setValue(`variants.${index}.values.${indx}._id`, value._id);
          });
        });
      }
    }

    // o	Xóa tất cả: Xóa toàn bộ biến thể.
    if (stateSelect === "deleteAll") {
      replaceFields([]);
    }

    //o	Đồng bộ số lượng tồn kho/giá bán/giá gốc/giá giảm giá: Hiển thị prompt để nhập giá trị, sau đó cập nhật cho tất cả biến thể.
    if (stateSelect === "countOnStock") {
      const value = prompt("Nhập số lượng tồn kho cho tất cả biến thể");

      fields.forEach((field, index) => {
        form.setValue(
          `variants.${index}.countOnStock`,
          parseInt(value || "1", 10)
        );
      });
    }

    if (stateSelect === "priceOriginal") {
      const value = prompt("Nhập giá gốc cho tất cả biến thể");

      fields.forEach((field, index) => {
        form.setValue(
          `variants.${index}.originalPrice`,
          parseInt(value || "1", 10)
        );
      });
    }

    if (stateSelect === "price") {
      const value = prompt("Nhập giá bán cho tất cả biến thể");

      fields.forEach((field, index) => {
        form.setValue(`variants.${index}.price`, parseInt(value || "1", 10));
      });
    }

    if (stateSelect === "priceSale") {
      const value = prompt("Nhập giá giảm giá cho tất cả biến thể");

      fields.forEach((field, index) => {
        form.setValue(
          `variants.${index}.priceSale`,
          parseInt(value || "0", 10)
        );
      });
    }
  };

  const handleToggle = (value: string) => {
    setOpenItems(
      (prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value) // Đóng mục
          : [...prev, value] // Mở mục
    );
  };

  const matchingAttributes = getAttributesUsedInArray(fields, attributes);

  // console.log("matchingAttributes: ", matchingAttributes); // Thuộc tính nào đang được sử dụng trong biến thể
  console.log("Biến thể: ", form.getValues("variants"));
  // console.log("fields:", fields);
  // console.log(previewImages);

  return (
    <>
      <div className="flex gap-3 border-b pb-3">
        <select
          className="w-2/3"
          value={stateSelect}
          onChange={(e) => setStateSelect(e.target.value)}
        >
          <option value="create">
            Tạo biến thể từ tất cả thuộc tính đã chọn
          </option>
          <option value="deleteAll">Xóa tất cả</option>
          <option value="countOnStock">Số lượng tồn kho</option>
          <option value="priceOriginal">Đồng giá gốc</option>
          <option value="price">Đồng giá bán</option>
          <option value="priceSale">Đồng giá giảm giá</option>
        </select>
        <Button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-black"
          onClick={handleButtonClick}
        >
          Chọn
        </Button>
      </div>
      <div>
        {fields.length > 0 &&
          fields?.[0]?.values[0]?.name != "" &&
          fields.map((field, index) => {
            return (
              <div className={`pb-6`} key={field.id}>
                <Accordion
                  className="w-full border-black"
                  type="multiple"
                  value={openItems} // Điều khiển các mục được mở
                  onValueChange={(values) => setOpenItems(values)}
                >
                  <AccordionItem value={`variant-${index}`}>
                    <div
                      className={`flex gap-3 relative w-full justify-between items-center ${
                        duplicate.includes(index) ? "border-red-500 border" : ""
                      }`}
                    >
                      <AccordionTrigger
                        className="text-left font-bold justify-between"
                        onClick={() => handleToggle(`variant-${index}`)}
                      >
                        {duplicate.includes(index) ? (
                          <span className="text-red-500">Biến thể trùng</span>
                        ) : (
                          <span>Thuộc tính {index + 1}</span>
                        )}
                      </AccordionTrigger>

                      <div className="flex gap-2">
                        {matchingAttributes?.map((attribute, indx) => {
                          return (
                            <div key={attribute._id}>
                              <select
                                className="w-24 md:w-28 py-1"
                                value={form.watch(
                                  `variants.${index}.values.${indx}._id`
                                )} // Theo dõi giá trị của trường
                                onChange={(e) => {
                                  form.setValue(
                                    `variants.${index}.values.${indx}._id`,
                                    e.target.value
                                  );
                                }}
                              >
                                {attribute.values.map((value: VariantItem) => {
                                  return (
                                    <option key={value._id} value={value._id}>
                                      {value.name}
                                    </option>
                                  );
                                })}
                              </select>

                              {form.formState.errors.variants && (
                                <p className="text-red-600">
                                  {form.formState.errors.variants.message}
                                </p> // Lỗi chung cho variants
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <AccordionContent className="mt-4 bg-gray-100 px-4">
                      <div className="pt-4 border-t border-black">
                        <div className="mt-2 flex flex-col lg:flex-row border-b border-gray-300 pb-4">
                          <input
                            className={`input-file__${field.id}`}
                            type="file"
                            hidden
                            {...form.register(`variants.${index}.image`)} // Đảm bảo rằng form register đã được sử dụng
                            onChange={(e) =>
                              handleImageChange(e, field.id, index)
                            } // Gọi hàm xử lý khi file thay đổi
                          />

                          {/* Preview Image */}
                          <div>
                            <div
                              onClick={() => {
                                const inputElement = document.querySelector(
                                  `.input-file__${field.id}`
                                );
                                if (inputElement) {
                                  (inputElement as HTMLInputElement).click();
                                }
                              }}
                              className="h-[100px] w-[100px] border border-dashed border-blue-300 cursor-pointer rounded p-1 flex items-center justify-center"
                            >
                              {previewImages[field.id] ? (
                                <div className="relative">
                                  <img
                                    src={previewImages[field.id] || ""}
                                    alt="Preview"
                                    className="object-cover w-[90px] h-[90px]"
                                  />
                                </div>
                              ) : (
                                <FaCloudUploadAlt className="text-4xl text-blue-400" />
                              )}
                            </div>
                            <span className="text-xs block text-red-600 mt-2">
                              {
                                form.formState.errors.variants?.[index]?.image
                                  ?.message
                              }
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                setPreviewImages((prev) => ({
                                  ...prev,
                                  [field.id]: "", // Xóa ảnh từ preview
                                }));
                                form.setValue(`variants.${index}.image`, ""); // Xóa ảnh từ form
                              }}
                              className="mt-4"
                            >
                              Xóa ảnh
                            </button>
                          </div>

                          <div className="lg:self-end lg:ml-auto">
                            <label className="block text-lg">
                              Số lượng tồn kho
                            </label>
                            <input
                              type="text"
                              {...form.register(
                                `variants.${index}.countOnStock` as const
                              )}
                            />
                            <span className="text-xs block text-red-600 mt-2">
                              {
                                form.formState.errors.variants?.[index]
                                  ?.countOnStock?.message
                              }
                            </span>
                          </div>
                        </div>

                        <VariationValues
                          form={form}
                          indexValue={index}
                          removeFields={removeFields}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            );
          })}
      </div>

      {/* {form.formState.errors.variants?.message} */}
    </>
  );
};

export default VariationTab;
