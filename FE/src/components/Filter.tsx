import { useSearchParams } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Filter({
  options,
  filterField,
}: {
  options: { label: string; value: string }[];
  filterField: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentFilter =
    searchParams.get(filterField) || options.at(0)?.value || "";

  function handleChange(value: string) {
    searchParams.set(filterField, value);

    if (searchParams.get("page")) searchParams.set("page", "1");

    setSearchParams(searchParams);
  }

  return (
    <Select defaultValue={currentFilter} onValueChange={handleChange}>
      <SelectTrigger className="focus:border-[#b8cd06] rounded-2xl outline-0 ring-0 focus:outline-0 focus:ring-0 focus:ring-offset-0 w-full md:w-[210px] mb-0 mt-0">
        <SelectValue placeholder={filterField.toUpperCase()} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default Filter;
