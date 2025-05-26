import {
  Action,
  Attribute,
  Data,
  State,
  Variant,
} from "@/common/types/Orders";
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
  attributes,
  stateAttribute,
  dispatch,
  selectedValues,
  setSelectedValues,
  handleAttributeValueChange,
  replaceFields,
}: {
  attributes: Attribute[];
  stateAttribute: State;
  dispatch: React.Dispatch<Action>;
  selectedValues: {
    [key: string]: { value: string; label: string; _id: string; type: string };
  };
  setSelectedValues: React.Dispatch<
    React.SetStateAction<{
      [key: string]: {
        _id: string;
        attribute: string;
        value: string;
        label: string;
      };
    }>
  >;
  handleAttributeValueChange: (
    attributeId: string,
    selectedOptions: {
      _id: string;
      attribute: string;
      value: string;
      label: string;
    }
  ) => void;
  replaceFields: (fields: Variant[]) => void;
}) => {
  // State
  const [valueOptions, setValueOptions] = useState<{
    value: string | undefined;
    label: string;
  } | null>(null);

  const [chooseAttribute, setChooseAttribute] = useState<Attribute | undefined>(
    undefined
  );
  const [selectError, setSelectError] = useState(false);

  function handleAdd() {
    if (!chooseAttribute) {
      setSelectError(true);
      return;
    }
    setSelectError(false);

    dispatch({ type: "ADD_ATTRIBUTE", payload: chooseAttribute });
  }

  // console.log("valueOptions: ", stateAttribute.attributesChoose);
  // console.log("selectedValues: ", selectedValues);

  return (
    <>
      <div className="flex gap-10 py-5">
        <Select
          placeholder="Chọn thuộc tính"
          value={valueOptions}
          noOptionsMessage={() => "Không có giá trị nào"}
          className="w-2/3"
          isDisabled={stateAttribute.attributesChoose.length === 2}
          options={
            attributes
              .map((item) => ({
                value: item._id,
                label: item.name,
              }))
              .filter(
                (item) =>
                  !stateAttribute.attributesChoose.find(
                    (value) => value._id === item.value
                  )
              ) || []
          }
          onChange={(value) => {
            const attribute = attributes.find(
              (item) => item._id === value?.value
            );
            setChooseAttribute(attribute);
            setValueOptions(value);
            setSelectError(false);
          }}
        />

        <Button
          type="button"
          className="w-1/4"
          onClick={() => {
            handleAdd();
            setValueOptions(null);
          }}
        >
          Chọn
        </Button>
        {selectError && (
          <span className="text-red-500">Bạn phải chọn một giá trị!</span>
        )}
      </div>

      {stateAttribute.attributesChoose.map((value) => (
        // console.log("VALUE: ", value),
        <Collapsible key={value._id} className="py-3 border-b">
          <CollapsibleTrigger className="flex justify-between items-center w-full">
            <p className="text-lg font-medium text-gray-500">{value.name}</p>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="flex justify-between">
              <Select<Data, true>
                isMulti
                className="w-2/3"
                options={value?.values.map((val) => ({
                  value: val.value,
                  label: val.name,
                  _id: val._id as string,
                  type: value.name,
                }))}
                value={selectedValues[value._id]}
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
                      payload: value._id as string,
                    });
                    setSelectedValues((current) => {
                      const { [value._id]: _, ...rest } = current;
                      return rest;
                    });
                  }}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      <div className="flex gap-3 mt-10">
        <Button
          type="button"
          onClick={() => {
            dispatch({ type: "CLEAR_VALUES" });
            replaceFields([]);
            dispatch({
              type: "ADD_VALUE",
              payload: Object.values(selectedValues).flatMap((val) => [val]),
            });
            if (
              Object.values(selectedValues).length === 0 ||
              Object.values(selectedValues)[0].length === 0
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
            dispatch({ type: "MIX_VALUES" });
          }}
        >
          Tạo biến thể
        </Button>
      </div>
    </>
  );
};

export default AttributeTab;
