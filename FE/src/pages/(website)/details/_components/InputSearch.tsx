import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CiSearch } from "react-icons/ci";

const InputSearch = () => {
  return (
    <>
      <div className="relative text-white hidden sm:block">
        <Input
          className="pl-4 rounded-full bg-transparent py-0 sm:w-[250px] md:w-[300px] m-0 lg:w-[300px] xl:w-[400px] text-xs placeholder:text-white outline-none focus:border-none focus:outline-none"
          type="text"
          placeholder="Search product..."
        />
        <CiSearch className="absolute bottom-[11px] right-2 text-xl hidden md:block" />
      </div>

      <Sheet>
        <SheetTrigger asChild className="bg-transparent sm:hidden">
          <Button>
            <CiSearch className="text-xl text-white sm:hidden" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top">
          <Input className="w-[90%]" placeholder="Search product..." />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default InputSearch;
