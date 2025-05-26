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
  id: boolean;
  form: FormTypeProductVariation;
  filteredData: Attribute[];
  attributeValue: Data[][];
  duplicate: number[];
}> = ({ id, form, filteredData, attributeValue, duplicate }) => {
  const [valuetab, setValueTab] = useState("attributes");
  const { attributes } = useGetAtributes();
  const [openAccordionItem, setOpenAccordionItem] = useState<
    string | undefined
  >("item-1");

  const [previewImages, setPreviewImages] = useState<{
    [key: string]: string | "";
  }>({});

  useEffect(() => {
    const hasErrorInVariations =
      Boolean(form.formState.errors.variants) || Boolean(duplicate.length);

    if (hasErrorInVariations) {
      setOpenAccordionItem("item-1");
      setValueTab("variations");
    }
  }, [form.formState.errors]);

  const value = form.watch("descriptionDetail");

  const handleChange = (content: string) => {
    form.setValue("descriptionDetail", content); // Ghi giá trị vào React Hook Form
  };

  const initialState: State = {
    attributesChoose: filteredData,
    valuesChoose: attributeValue, // valuesChoose là mảng chứa mảng Data[]
    valuesMix: [], // valuesMix là mảng chứa mảng Data[]
  };
  const [stateAttribute, dispatch] = useReducer(reducer, initialState);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedValues, setSelectedValues] = useState<Record<string, any>>(
    getSelectedValues(attributeValue, attributes)
  );

  const handleAttributeValueChange = (
    attributeId: string,
    selectedOptions: {
      value: string;
      label: string;
      _id: string;
      attribute: string;
    }
  ) => {
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [attributeId]: selectedOptions,
    }));
  };

  // Variant:
  const { fields, replace, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  useEffect(() => {
    const initialImages = fields.reduce((acc, field) => {
      if (field.image) {
        acc[field.id] = field.image; // Use the existing image URL
      }
      return acc;
    }, {} as { [key: string]: string | "" });
    setPreviewImages(initialImages);
  }, [fields]);

  const typeFields: string[] = getUniqueTypesFromFields(fields) as string[];

  // console.log("attributeValue", getSelectedValues(attributeValue, attributes));

  return (
    <div className="w-full xl:w-3/4">
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

      <div className="border relative">
        <Accordion
          className="bg-white"
          type="single"
          collapsible
          value={openAccordionItem}
          onValueChange={(value) => setOpenAccordionItem(value)}
          orientation="vertical"
        >
          <AccordionItem className="border-none" value="item-1">
            <AccordionTrigger className="border-b p-5 hover:no-underline">
              Thông tin sản phẩm
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <Tabs
                value={valuetab}
                onValueChange={(value) => setValueTab(value)}
                className="flex flex-col md:flex-row"
              >
                <TabsList className="flex flex-col justify-start gap-2 h-auto bg-white border-b md:border-r border-black md:border-inherit rounded-none pb-3 md:p-0">
                  {tabProductData.map((tab) => (
                    <TabsTrigger
                      onClick={() => {
                        if (tab.value === "variations") {
                          if (stateAttribute.valuesMix.length !== 0) {
                            const newFields = formatDataLikeFields(
                              stateAttribute.valuesMix
                            );

                            replace(newFields);
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
                      key={tab.value}
                      className="py-3 w-full data-[state=active]:bg-slate-200 hover:bg-slate-100 data-[state=active]:rounded-none"
                      value={tab.value}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Tab Content */}

                <TabsContent
                  className="px-3 pt-2 flex-1 min-h-[500px]"
                  value="attributes"
                >
                  <AttributeTab
                    attributes={attributes}
                    stateAttribute={stateAttribute}
                    dispatch={dispatch}
                    selectedValues={selectedValues}
                    setSelectedValues={setSelectedValues}
                    handleAttributeValueChange={handleAttributeValueChange}
                    replaceFields={replace}
                  />
                </TabsContent>
                <TabsContent
                  className="px-3 pt-2 w-full min-h-[300px]"
                  value="variations"
                >
                  <VariationTab
                    fields={fields}
                    stateAttribute={stateAttribute}
                    typeFields={typeFields}
                    form={form}
                    attributes={attributes}
                    replaceFields={replace}
                    removeFields={remove}
                    duplicate={duplicate}
                    previewImages={previewImages}
                    setPreviewImages={setPreviewImages}
                  />
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <span className="block mt-3 text-red-700">
        {form.formState.errors.variants?.message ||
          form.formState.errors.variants?.root?.message}
      </span>

      <div className="mt-9 w-full">
        <Label className="text-lg font-medium-">Mô tả chi tiết</Label>

        <ReactQuill
          className="bg-white mt-4"
          placeholder="Viết mô tả chi tiết sản phẩm"
          theme="snow"
          value={value}
          onChange={handleChange} // Sử dụng handleChange
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                // { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
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
