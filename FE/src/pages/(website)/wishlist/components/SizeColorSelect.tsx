import { VariantItem, VariantValue } from "@/common/types/Products";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";

const SizeColorSelector = ({
  idProduct,
  idVariant,
  attribute,
  onChangeAttribute,
  idCart,
  onChangeVariant,
}: {
  idProduct: string;
  idVariant: string;
  attribute: string;
  onChangeAttribute: (idCart: string) => void;
  idCart: string;
  onChangeVariant:  (params: { productId: string; variantId: string; newVariantId: string }) => void;
}) => {
  const [selectedValue, setSelectedValue] = useState<{ [key: string]: string }>(
    {}
  );

  const changeAttribute = (idCart: string) => {
    onChangeAttribute(idCart);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["variant_pro", idProduct],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:8080/api/products/${idProduct}`
      );
      return data;
    },
  });

  // console.log('data', data)

  const {
    data: attri,
    isLoading: AttriLoading,
    isError: AttriError,
  } = useQuery({
    queryKey: ["attribute", idProduct],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:8080/api/attributes`);
      return data;
    },
  });

  const variantOfProduct = data?.variants.find(
    (variant: VariantItem) => variant._id === idVariant
  );
  const str = variantOfProduct?.values.flatMap((value: VariantItem) => value.name);

  // console.log(data);
  // console.log(attri);
  // console.log(selectedValue)
  // console.log(idVariant)

  useEffect(() => {
    if (data && idVariant) {
      const selectedVariant = data?.variants.find(
        (variant: VariantItem) => variant._id === idVariant
      );

      if (selectedVariant) {
        const variantProduct = attri?.reduce((acc: { [key: string]: string }, attr: VariantItem) => {
          // console.log('attr', attr)
          const uniqueValue = selectedVariant.values.find((value: VariantItem) =>
            attr.values.some((item: VariantValue) => item._id == value._id)
          );

          if (uniqueValue) {
            acc[attr._id] = uniqueValue._id;
          }

          return acc;
        }, {});

        setSelectedValue(variantProduct);
      }
      // console.log(selectedVariant)
    }
  }, [data, idVariant]);

  const handleAttributeChange = (attributeId: string, valueId: string) => {
    setSelectedValue((prev) => {
      const valueSelected = prev[attributeId] === valueId;

      if (valueSelected) {
        const { [attributeId]: removed, ...rest } = prev;
        console.log(removed)
        return rest;
      }

      return {
        ...prev,
        [attributeId]: valueId,
      };
    });
  };
  // Mảng mới để chứa các variant
  const variantProduct = attri?.map((attr: VariantItem) => {
    const seenIds = new Set();

    const uniqueValues = data?.variants.flatMap((variant: VariantItem) => {
      // console.log('variant', variant)
      return variant.values.filter(
        (value: VariantValue) =>
          attr.values.some((attrValue: VariantValue) => attrValue._id === value._id) &&
          !seenIds.has(value._id) &&
          seenIds.add(value._id)
      );
    });

    // console.log(uniqueValues)
    return {
      ...attr,
      values: uniqueValues,
    };
  });

  // console.log(variantProduct)

  const getCompatibleAttributeValues = () => {
    let filterVariants = data?.variants;

    // Lọc các variant dựa trên các thuộc tính đã chọn
    selectedValue &&
      Object.keys(selectedValue)?.forEach((attributeId) => {
        const valueVariant = selectedValue[attributeId];
        filterVariants = filterVariants?.filter((variant: VariantItem) =>
          variant.values.some((value: VariantValue) => value._id === valueVariant)
        );
      });

    const filterValues: { [key: string]: string[] } = {};

    // Tạo danh sách các giá trị thuộc tính tương thích
    attri?.forEach((attribute: VariantItem) => {
      const valuesSet = new Set();
      filterVariants?.forEach((variant: VariantItem) => {
        variant.values.forEach((value: VariantValue) => {
          if (attribute.values.some((item: VariantValue) => item._id == value._id)) {
            valuesSet.add(value._id);
          }
        });
      });
      filterValues[attribute._id] = [...valuesSet] as string[]; // Explicitly cast values to string[]
    });

    return filterValues;
  };

  const compatibleAttributeValues = getCompatibleAttributeValues();

  const saveVariant = (selectedValue: { [key: string]: string }) => {
    // Tìm variant khớp với tất cả các thuộc tính đã chọn
    const matchedVariant = data?.variants.find((variant: VariantItem) => {
      if (Object.keys(selectedValue)?.length !== variant.values.length) return;

      // Kiểm tra xem variant có chứa tất cả các thuộc tính đã chọn không
      return Object.keys(selectedValue)?.every((attributeId) => {
        return variant.values.some(
          (value: VariantValue) => value._id === selectedValue[attributeId]
        );
      });
    });

    if (matchedVariant) {
      onChangeVariant({
        productId: idProduct,
        variantId: idVariant,
        newVariantId: matchedVariant._id,
      });
      // console.log("Đã tìm thấy _id", matchedVariant);
    } else {
      console.log("Không tìm được _id Variant");
    }
  };

  // console.log(variantProduct);

  if (isLoading) return <div>Is Loading</div>;
  if (isError) return <div>Is Error</div>;
  if (AttriLoading) return <div>Is Loading Attribute</div>;
  if (AttriError) return <div>Is Error Attribute</div>;
  return (
    <>
      <div
        className="flex items-center gap-1 px-2 py-1 border rounded-md cursor-pointer max-sm:text-[14px] select-none"
        onClick={() =>
          attribute !== idCart ? changeAttribute(idCart) : changeAttribute("1")
        }
      >
        {str?.join(", ")}
        <div
          className={`transition-all duration-500 ${
            attribute === idCart ? "rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="black"
              d="m12 13.171l4.95-4.95l1.414 1.415L12 16L5.636 9.636L7.05 8.222z"
            />
          </svg>
        </div>
      </div>
      <div
        className={`absolute flex flex-col gap-3 bg-background py-3 px-4 -translate-x-2/3 border rounded-md transition-all duration-300 select-none shadow-2xl
                ${
                  attribute === idCart
                    ? "opacity-100 top-[130%] z-10"
                    : "opacity-0 top-[90%] z-[-1]"
                }`}
      >
        {variantProduct?.map((item: VariantItem) => {
          if (item.values.length < 1) return;
          return (
            <React.Fragment key={item._id}>
              <div key={item._id} className="flex flex-col gap-2">
                <h1 className="font-medium">Select {item.name}</h1>
                <div className="flex gap-2">
                  {item.values.map((itemOther: VariantValue) => (
                    <div
                      key={itemOther._id}
                      className={`relative border-2 px-5 py-4 rounded-md 
                                            ${
                                              !compatibleAttributeValues[
                                                item._id
                                              ]?.includes(itemOther._id)
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:border-background1 cursor-pointer transition-all"
                                            } 
                                            ${
                                              selectedValue &&
                                              selectedValue[item._id]?.includes(
                                                itemOther._id
                                              )
                                                ? "border-background1"
                                                : ""
                                            }`}
                      onClick={() => {
                        if (
                          compatibleAttributeValues[item._id]?.includes(
                            itemOther._id
                          )
                        ) {
                          handleAttributeChange(item._id, itemOther._id);
                        }
                      }}
                    >
                      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] font-medium">
                        {itemOther.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="h-[2px] border-none bg-gray-200" />
            </React.Fragment>
          );
        })}

        <div className="flex justify-between space-x-8 pt-4">
          <div
            className="p-1 hover:text-red-500 cursor-pointer"
            onClick={() => changeAttribute("1")}
          >
            Cancel
          </div>
          <button
            onClick={() => saveVariant(selectedValue)}
            className="py-1 px-3 bg-background border border-background1 text-background1 rounded-sm hover:bg-background1 hover:text-background transition-all duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default SizeColorSelector;
