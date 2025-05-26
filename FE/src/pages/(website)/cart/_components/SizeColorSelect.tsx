// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { AiOutlineExclamationCircle } from "react-icons/ai";

// const SizeColorSelector = ({
//   idProduct,
//   idVariant,
//   attribute,
//   onChangeAttribute,
//   idCart,
//   onChangeVariant,
// }: {
//   idProduct: string;
//   idVariant: string;
//   attribute: any;
//   onChangeAttribute: any;
//   idCart: string;
//   onChangeVariant: any;
// }) => {
//   const [selectedValue, setSelectedValue] = useState<{ [key: string]: any }>(
//     {}
//   );

//   const changeAttribute = (idCart: string) => {
//     onChangeAttribute(idCart);
//   };

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["variant_pro", idProduct],
//     queryFn: async () => {
//       const { data } = await axios.get(
//         `http://localhost:8080/api/products/${idProduct}`
//       );
//       return data;
//     },
//   });

//   // console.log('data', data)

//   const { data: attri, isLoading: AttriLoading, isError: AttriError } = useQuery({
//     queryKey: ["attribute", idProduct],
//     queryFn: async () => {
//       const { data } = await axios.get(`http://localhost:8080/api/attributes`);
//       return data;
//     },
//   });

//   const variantOfProduct = data?.variants.find(
//     (variant: any) => variant._id === idVariant
//   );
//   const str = variantOfProduct?.values.flatMap((value: any) => value.name);

//   // console.log(data);
//   // console.log(attri)
//   // console.log(selectedValue)
//   // console.log(idVariant)

//   useEffect(() => {
//     if (data && idVariant) {
//       const selectedVariant = data?.variants.find(
//         (variant: any) => variant._id === idVariant
//       );

//       if (selectedVariant) {
//         let hasFoundProduct = false; // Biến cờ để kiểm tra

//         const findVariantProduct = () => {
//           const variantProduct = attri?.reduce((acc: any, attr: any) => {
//             const uniqueValue = selectedVariant.values.find((value: any) =>
//               attr.values.some((item: any) => item._id == value._id)
//             );

//             if (uniqueValue) {
//               acc[attr._id] = uniqueValue._id;
//             }

//             return acc;
//           }, {});

//           // console.log("Variant Product:", variantProduct);
//           return variantProduct;
//         };

//         // Hàm thử lại nếu variantProduct không tìm thấy

//         const retryFind = (retryCount: number) => {
//           if (retryCount <= 0 || hasFoundProduct) {
//             // console.warn("Dừng retry: đã tìm thấy hoặc hết số lần thử");
//             return;
//           }

//           const variantProduct = findVariantProduct();

//           if (variantProduct && Object.keys(variantProduct).length > 0) {
//             hasFoundProduct = true;
//             // console.log("Tìm thấy variant product sau", 3 - retryCount, "lần thử");
//             setSelectedValue(variantProduct);
//           } else {
//             // console.log("Thử lại lần thứ", retryCount - 1);
//             setTimeout(() => retryFind(retryCount - 1), 100);
//           }
//         };

//         retryFind(3); // Thử lại tối đa 3 lần
//       }
//     }
//   }, [data, idVariant, attri]);

//   // console.log('selectedValue', selectedValue)

//   const handleAttributeChange = (attributeId: any, valueId: any) => {
//     setSelectedValue((prev: any) => {
//       const valueSelected = prev[attributeId] === valueId;

//       if (valueSelected) {
//         // const { [attributeId]: removed, ...rest } = prev;
//         // return rest;
//         return prev
//       }

//       return {
//         ...prev,
//         [attributeId]: valueId,
//       };
//     });
//   };

//   // Mảng mới để chứa các variant
//   const variantProduct = attri?.map((attr: any) => {
//     const seenIds = new Set();

//     const uniqueValues = data?.variants.flatMap((variant: any) => {
//       // console.log('variant', variant)
//       return variant.values.filter(
//         (value: any) =>
//           attr.values.some((attrValue: any) => attrValue._id === value._id) &&
//           !seenIds.has(value._id) &&
//           seenIds.add(value._id)
//       );
//     });

//     // console.log(uniqueValues)
//     return {
//       ...attr,
//       values: uniqueValues,
//     };
//   });

//   // console.log(variantProduct)

//   const getCompatibleAttributeValues = () => {
//     let filterVariants = data?.variants;

//     // Lọc các variant dựa trên các thuộc tính đã chọn
//     selectedValue && Object.keys(selectedValue)?.forEach((attributeId: any) => {
//       const valueVariant = selectedValue[attributeId];
//       filterVariants = filterVariants?.filter((variant: any) =>
//         variant.values.some((value: any) => value._id === valueVariant)
//       );
//     });

//     const filterValues: { [key: string]: string[] } = {};

//     // Tạo danh sách các giá trị thuộc tính tương thích
//     attri?.forEach((attribute: any) => {
//       const valuesSet = new Set();
//       filterVariants?.forEach((variant: any) => {
//         variant.values.forEach((value: any) => {
//           if (attribute.values.some((item: any) => item._id == value._id)) {
//             valuesSet.add(value._id);
//           }
//         });
//       });
//       filterValues[attribute._id] = [...valuesSet] as string[]; // Explicitly cast values to string[]
//     });

//     return filterValues;
//   };

//   // Lọc các variant dựa trên các thuộc tính đã chọn
//   const compatibleAttributeValues = getCompatibleAttributeValues();

//   const saveVariant = (selectedValue: any) => {
//     // Tìm variant khớp với tất cả các thuộc tính đã chọn
//     const matchedVariant = data?.variants.find((variant: any) => {
//       if (Object.keys(selectedValue)?.length !== variant.values.length) return;

//       // Kiểm tra xem variant có chứa tất cả các thuộc tính đã chọn không
//       return Object.keys(selectedValue)?.every((attributeId) => {
//         return variant.values.some(
//           (value: any) => value._id === selectedValue[attributeId]
//         );
//       });
//     });

//     if (matchedVariant) {
//       onChangeVariant({
//         productId: idProduct,
//         variantId: idVariant,
//         newVariantId: matchedVariant._id,
//       });
//       // console.log("Đã tìm thấy _id", matchedVariant);
//     } else {
//       console.log("Không tìm được _id Variant");
//     }
//   };

//   if (isLoading) return <div>Is Loading</div>;
//   if (isError) return <div>Is Error</div>;
//   if (AttriLoading) return <div>Is Loading Attribute</div>;
//   if (AttriError) return (
//     <div className="flex items-center justify-center p-[10rem] my-10   ">
//       <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
//       <span className="text-red-600 font-semibold">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</span>
//     </div>
//   );
//   return (
//     <>
//       <div
//         className="flex items-center gap-1 px-2 py-1 border rounded-md cursor-pointer max-sm:text-[14px] select-none"
//         onClick={() =>
//           attribute !== idCart ? changeAttribute(idCart) : changeAttribute("1")
//         }
//       >
//         {str?.join(", ")}
//         <div
//           className={`transition-all duration-500 ${attribute === idCart ? "rotate-180" : ""
//             }`}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="1.2em"
//             height="1.2em"
//             viewBox="0 0 24 24"
//           >
//             <path
//               fill="black"
//               d="m12 13.171l4.95-4.95l1.414 1.415L12 16L5.636 9.636L7.05 8.222z"
//             />
//           </svg>
//         </div>
//       </div>
//       <div
//         className={`absolute flex flex-col gap-3 bg-background py-3 px-4 left-1/2 max-sm:left-[50%] max-[450px]:left-0 -translate-x-1/2 border rounded-md transition-all duration-300 select-none shadow-2xl
//                 ${attribute === idCart
//             ? "opacity-100 top-[130%] z-10"
//             : "opacity-0 top-[90%] z-[-1]"
//           }`}
//       >
//         {variantProduct?.map((item: any) => {
//           if (item.values.length < 1) return;
//           return (
//             <React.Fragment key={item._id}>
//               <div key={item._id} className="flex flex-col gap-2">
//                 <h1 className="font-medium">Chọn {item.name}</h1>
//                 <div className="flex gap-2">
//                   {item.values.map((itemOther: any) => (
//                     <div
//                       key={itemOther._id}
//                       // className={`border-2 px-2 py-1 rounded-md 
//                       //   ${!compatibleAttributeValues[item._id]?.includes(itemOther._id)
//                       //     ? "opacity-50 cursor-not-allowed"
//                       //     : "hover:border-background1 cursor-pointer transition-all"
//                       //   } 
//                       //   ${selectedValue && selectedValue[item._id]?.includes(itemOther._id)
//                       //     ? "border-background1"
//                       //     : ""
//                       //   }
//                       //   `}
//                       className={`border-2 px-2 py-1 rounded-md cursor-pointer
//                         ${selectedValue && selectedValue[item._id]?.includes(itemOther._id)
//                           ? "border-background1 cursor-pointer"
//                           : ""
//                         } 
//                         `}
//                       onClick={() => {
//                         console.log('click')
//                         // if (
//                         //   compatibleAttributeValues[item._id]?.includes(
//                         //     itemOther._id
//                         //   )
//                         // ) {
//                         handleAttributeChange(item._id, itemOther._id);
//                         // }
//                       }}
//                     >
//                       <p className=" text-[14px] font-medium text-nowrap">
//                         {itemOther.name}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <hr className="h-[2px] border-none bg-gray-200" />
//             </React.Fragment>
//           );
//         })}

//         <div className="flex justify-between space-x-8 pt-4">
//           <div
//             className="p-1 hover:text-red-500 cursor-pointer"
//             onClick={() => changeAttribute("1")}
//           >
//             Đóng
//           </div>
//           <button
//             onClick={() => saveVariant(selectedValue)}
//             className="py-1 px-3 bg-background border border-background1 text-background1 rounded-sm hover:bg-background1 hover:text-background transition-all duration-300"
//           >
//             Lưu
//           </button>
//         </div>
//       </div >
//     </>
//   );
// };

// export default SizeColorSelector;
