import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PaymentMethod = () => {

  return (
    <>
      <Select required>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Payment methods" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="pineapple">COD</SelectItem>
            <SelectItem value="Vnay">Vnay</SelectItem>
            <SelectItem value="MOMO">MOMO</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default PaymentMethod;
