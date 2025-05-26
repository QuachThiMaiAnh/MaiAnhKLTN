import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ProductAttributesProps {
  attributes: [string, string[]][];
  attributesChoose: Record<string, string[][]>;
  onAttributeSelect: (type: string, value: string) => void;
  deleted: boolean;
}

const Attributes: React.FC<ProductAttributesProps> = ({
  attributes,
  attributesChoose,
  onAttributeSelect,
  deleted,
}) => {
  return (
    <>
      {attributes.map(([key, value]) => (
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
            disabled={deleted}
          >
            {(value as string[]).map((item: string, idx: number) => {
              const [itemValue, colorOrText] = item.split(":");

              return colorOrText.startsWith("#") ? (
                <ToggleGroupItem
                  onClick={() => onAttributeSelect(key, itemValue)}
                  key={`${itemValue}-${idx}`}
                  className="rounded-none border data-[state=on]:border-2 size-6 p-0 cursor-pointer transition-all"
                  value={itemValue}
                  style={{
                    backgroundColor: colorOrText,
                  }}
                  disabled={
                    key in attributesChoose
                      ? !attributesChoose[key][0].includes(itemValue)
                      : false
                  }
                ></ToggleGroupItem>
              ) : (
                <ToggleGroupItem
                  onClick={() => onAttributeSelect(key, itemValue)}
                  className="rounded-none border data-[state=on]:border-2 data-[state=on]:text-black transition-all uppercase px-3 h-8"
                  value={itemValue}
                  key={itemValue}
                  disabled={
                    key in attributesChoose
                      ? !attributesChoose[key][0].includes(itemValue)
                      : false
                  }
                >
                  {colorOrText}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      ))}
    </>
  );
};

export default Attributes;
