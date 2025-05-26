import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAttributeValue } from "../actions/useCreateAttributeValue";
import { Action } from "@/common/types/Orders";

export function AddNewValue({
  attributeId,
  type,
  dispatch,
}: {
  attributeId: string;
  type: string;
  dispatch: React.Dispatch<Action>;
}) {
  const { createAttributeValue, isCreating } = useCreateAttributeValue(
    attributeId,
    dispatch
  );

  // State để lưu giá trị từ form
  const [name, setName] = useState<string>("");
  const [valueAttribute, setValueAttribute] = useState<string>("");

  const [nameError, setNameError] = useState<boolean>(false);
  const [valueAttributeError, setValueAttributeError] =
    useState<boolean>(false);

  const [typeValue, setTypeValue] = useState<string>("text");

  // Xử lý khi submit form
  const handleSubmit = async () => {
    let hasError = false;

    if (!name) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (!valueAttribute) {
      setValueAttributeError(true);
      hasError = true;
    } else {
      setValueAttributeError(false);
    }

    if (!hasError) {
      try {
        await createAttributeValue({
          name,
          type,
          value: valueAttribute,
        });
        setName("");
        setValueAttribute("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Thêm giá trị</Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Thêm</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <Label htmlFor="name" className="text-right">
              Tên giá trị thuộc tính
            </Label>
            <Input
              className="mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
            />
            {nameError && (
              <span className="text-red-600">
                Tên giá trị không được để trống
              </span>
            )}
          </div>
          <div className="">
            <Label htmlFor="name" className="text-right">
              Giá trị thuộc tính
            </Label>
            <div className="flex gap-2">
              <div className="w-full">
                <Input
                  type={typeValue}
                  className="mb-2"
                  value={valueAttribute}
                  onChange={(e) => setValueAttribute(e.target.value)}
                  disabled={isCreating}
                />

                {valueAttributeError && (
                  <span className="text-red-600">
                    Giá trị không được để trống
                  </span>
                )}
              </div>

              <Button
                className="w-1/4 bg-blue-500 hover:bg-blue-600"
                type="button"
                onClick={() => {
                  setTypeValue(typeValue === "text" ? "color" : "text");
                }}
              >
                {typeValue === "text" ? "Đổi sang màu" : "Đổi sang chữ"}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? "Đang tạo giá trị..." : "Tạo giá trị"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
