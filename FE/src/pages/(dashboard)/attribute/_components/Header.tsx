import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgePlus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentLayout = searchParams.get("status") || "display";

  function handleChange(layout: string) {
    searchParams.set("status", layout);

    setSearchParams(searchParams);
  }

  return (
    <div className="sm:flex justify-between items-center">
      <h4 className="text-xl font-semibold">Danh sách thuộc tính</h4>

      <div className=" md:flex gap-10">
        <Tabs
          className="mb-4 md:mb-0"
          defaultValue={currentLayout}
          onValueChange={(layout) => handleChange(layout)}
        >
          <div className="flex items-center">
            <TabsList className="border">
              <TabsTrigger value="display">Danh sách hiển thị</TabsTrigger>
              <TabsTrigger value="hidden">Danh sách ẩn</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        <Link to="add">
          <Button className="text-lg font-light flex gap-3 px-4 bg-orange-500 hover:bg-orange-400">
            <BadgePlus />{" "}
            <span className="hidden lg:block">Thêm thuộc tính</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
