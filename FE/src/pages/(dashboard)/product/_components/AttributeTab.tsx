import { Action, Attribute, Data, State, Variant } from "@/common/types/Orders";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import Select from "react-select";
import { AddNewValue } from "./AddNewValue";
import { toast } from "@/components/ui/use-toast";

const AttributeTab = ({
  attributes, // Danh sách tất cả các thuộc tính có thể chọn (dạng array: Màu sắc, Kích thước, v.v.)
  stateAttribute, // State lưu các thuộc tính đã chọn (dạng object: { attributesChoose: [], valuesChoose: [], valuesMix: [] })
  dispatch, // Hàm dispatch reducer để xử lý hành động (thêm/xoá thuộc tính, giá trị, v.v.)
  selectedValues, // Giá trị đã chọn cho từng thuộc tính (dạng object: { attributeId: [{ _id, type, value, label }] })
  setSelectedValues, // Hàm cập nhật selectedValues
  handleAttributeValueChange, // Hàm xử lý khi chọn giá trị trong dropdown
  replaceFields, // Hàm thay thế danh sách biến thể
}: {
  attributes: Attribute[];
  stateAttribute: State;
  dispatch: React.Dispatch<Action>;
  selectedValues: {
    [key: string]: {
      value: string;
      label: string;
      _id: string;
      type: string;
    }[];
  };
  setSelectedValues: React.Dispatch<
    React.SetStateAction<{
      [key: string]: {
        _id: string;
        type: string;
        value: string;
        label: string;
      }[];
    }>
  >;
  handleAttributeValueChange: (
    attributeId: string, // ID của thuộc tính
    selectedOptions: {
      _id: string;
      type: string;
      value: string;
      label: string;
    }[]
  ) => void;
  replaceFields: (fields: Variant[]) => void;
}) => {
  // Giá trị chọn trong dropdown (dùng cho react-select)
  const [valueOptions, setValueOptions] = useState<{
    value: string | undefined; // ID của thuộc tính
    label: string; // Tên hiển thị của thuộc tính
  } | null>(null);

  // Thuộc tính được chọn từ dropdown
  const [chooseAttribute, setChooseAttribute] = useState<Attribute | undefined>(
    undefined
  );

  // Trạng thái hiển thị lỗi khi chưa chọn thuộc tính mà bấm "Chọn"
  const [selectError, setSelectError] = useState(false);

  // Hàm xử lý khi người dùng bấm nút "Chọn"
  function handleAdd() {
    if (!chooseAttribute) {
      setSelectError(true); // Hiển thị cảnh báo nếu không chọn gì
      return;
    }
    setSelectError(false);

    // Gửi action để thêm thuộc tính vào danh sách đã chọn
    dispatch({ type: "ADD_ATTRIBUTE", payload: chooseAttribute });
  }

  // console.log(selectedValues, "selectedValues");
  // console.log(stateAttribute, "stateAttribute");
  return (
    <>
      {/* Vùng chọn thuộc tính */}
      <div className="flex gap-10 py-5">
        <Select
          placeholder="Chọn thuộc tính"
          value={valueOptions}
          noOptionsMessage={() => "Không có giá trị nào"}
          className="w-2/3"
          isDisabled={stateAttribute.attributesChoose.length === 2} // Giới hạn 2 thuộc tính
          options={
            attributes
              .map((item) => ({
                value: item._id, // ID của thuộc tính
                label: item.name, // Tên hiển thị của thuộc tính
              }))
              .filter(
                // Lọc ra những thuộc tính chưa được chọn
                (item) =>
                  !stateAttribute.attributesChoose.find(
                    (value) => value._id === item.value
                  )
              ) || []
          }
          onChange={(value) => {
            // Khi chọn thuộc tính
            const attribute = attributes.find(
              (item) => item._id === value?.value
            );
            setChooseAttribute(attribute); // Gán thuộc tính đã chọn
            setValueOptions(value); // Hiển thị tên trong select
            setSelectError(false); // Reset lỗi
          }}
        />

        {/* Nút "Chọn" */}
        <Button
          type="button"
          className="w-1/4"
          onClick={() => {
            handleAdd(); // Thêm thuộc tính vào danh sách (stateAttribute.attributesChoose)
            setValueOptions(null); // Reset dropdown
          }}
        >
          Chọn
        </Button>

        {/* Hiển thị lỗi nếu chưa chọn thuộc tính */}
        {selectError && (
          <span className="text-red-500">Bạn phải chọn một giá trị!</span>
        )}
      </div>

      {/* Danh sách thuộc tính đã chọn */}
      {stateAttribute.attributesChoose.map((value) => (
        // Hiển thị từng thuộc tính đã chọn
        <Collapsible key={value._id} className="py-3 border-b">
          {/* Hiển thị tên thuộc tính */}
          <CollapsibleTrigger className="flex justify-between items-center w-full">
            <p className="text-lg font-medium text-gray-500">{value.name}</p>{" "}
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3">
            <div className="flex justify-between">
              {/* Dropdown chọn nhiều giá trị cho thuộc tính này */}
              <Select<Data, true>
                isMulti // Cho phép chọn nhiều giá trị
                className="w-2/3"
                options={value?.values.map((val) => ({
                  value: val.value, // Giá trị của Giá trị thuộc tính
                  label: val.name, // Tên hiển thị của Giá trị thuộc tính
                  _id: val._id as string,
                  type: value.name, // Tên thuộc tính
                }))}
                value={selectedValues[value._id]} // Giá trị đã chọn cho thuộc tính này
                // Xử lý khi người dùng chọn giá trị
                onChange={(selectedOptions) => {
                  const mappedOptions = (selectedOptions as Data[]).map(
                    (option) => ({
                      _id: option._id,
                      type: option.type,
                      value: option.value,
                      label: option.label,
                    })
                  );
                  handleAttributeValueChange(value._id, mappedOptions);
                }}
              />

              {/* Nút thêm giá trị mới + xoá thuộc tính */}
              <div className="flex gap-2">
                <AddNewValue
                  attributeId={value._id}
                  type={value.name}
                  dispatch={dispatch}
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    dispatch({
                      type: "DELETE_ONE_VALUE",
                      payload: value._id as string, // Xoá thuộc tính khỏi danh sách đã chọn
                    });
                    // Xoá giá trị đã chọn cho thuộc tính này
                    setSelectedValues((current) => {
                      const { [value._id]: _, ...rest } = current;
                      return rest;
                    });
                  }}
                >
                  Xóa thuộc tính
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* Nút tạo biến thể từ tổ hợp giá trị đã chọn */}
      <div className="flex gap-3 mt-10">
        <Button
          type="button"
          onClick={() => {
            dispatch({ type: "CLEAR_VALUES" }); // Xoá tổ hợp cũ
            replaceFields([]); // Reset biến thể đã sinh
            dispatch({
              type: "ADD_VALUE",
              payload: Object.values(selectedValues).flatMap((val) => [val]), // Thêm các giá trị đã chọn vào danh sách để trộn
              //(2)[Array(1), Array(2)]
            });

            // Kiểm tra có chọn giá trị chưa
            if (
              Object.values(selectedValues).length === 0 || // Không có thuộc tính nào được chọn
              Object.values(selectedValues)[0].length === 0 // Không có giá trị nào được chọn cho thuộc tính đầu tiên
            ) {
              toast({
                variant: "destructive",
                title: "Bạn chưa chọn giá trị cho biến thể",
              });
            } else {
              toast({
                variant: "success",
                title: "Đã tạo biến thể thành công",
              });
            }

            dispatch({ type: "MIX_VALUES" }); // Trộn các giá trị → sinh biến thể
          }}
        >
          Tạo biến thể
        </Button>
      </div>
    </>
  );
};

export default AttributeTab;
