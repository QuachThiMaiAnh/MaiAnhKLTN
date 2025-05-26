const ButtonQuantity = ({
  quantity,
  setQuantity,
  countOnStock,
  deleted,
}: {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  countOnStock: number | undefined;
  deleted: boolean;
}) => {
  return (
    /* Quantity */

    <div className="mb-10 flex flex-col md:flex-row md:items-center">
      <span className="uppercase text-[13px] text-[#343434] font-raleway font-black mb-2 w-full md:w-4/12">
        số lượng:
      </span>

      <div className="flex items-center h-[42px] ">
        <button
          className={`cursor-pointer flex justify-center items-center text-5xl font-light w-[50px] h-full text-center border border-r-0 rounded-tl-full rounded-bl-full text-[#333] ${
            deleted ? "bg-gray-100 opacity-35 pointer-events-none" : ""
          }`}
          onClick={() => {
            if (quantity > 1) setQuantity(quantity - 1);
          }}
        >
          -
        </button>
        <input
          className={`border py-2 text-center outline-0 max-w-24 ${
            deleted ? "bg-gray-100 opacity-35 pointer-events-none" : ""
          }`}
          onChange={(e) => {
            const input = e.target.value;

            if (/^\d+$/.test(input) && Number(input) > 0) {
              setQuantity(+e.target.value);
            }
          }}
          value={deleted ? 0 : quantity}
        />
        <button
          className={`cursor-pointer flex justify-center items-center text-3xl font-light w-[50px] h-full text-center border border-l-0 rounded-tr-full rounded-br-full text-[#333] ${
            deleted ? "bg-gray-100 opacity-35 pointer-events-none" : ""
          }`}
          onClick={() => {
            if (quantity < 10) setQuantity(quantity + 1);
          }}
        >
          +
        </button>
        {deleted ? (
          <span className="ml-4 text-xl font-bold text-red-700">Sản phẩm ngừng bán</span>
        ) : (
          <span className="ml-4 text-xs">{countOnStock} sản phẩm có sẵn</span>
        )}
      </div>
    </div>
  );
};

export default ButtonQuantity;
