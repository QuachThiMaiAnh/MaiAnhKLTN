import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

import { DOTS, usePagination } from "@/common/hooks/usePagination";
import { useSearchParams } from "react-router-dom";

const Pagination = function ({
  totalCount,
  siblingCount = 1,
  pageSize,
}: {
  totalCount: number;
  siblingCount?: number;
  pageSize?: number | undefined;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = +(searchParams.get("page") ?? 1);

  const pageCount = Math.ceil(totalCount / pageSize);

  const paginationRange = usePagination({
    totalCount,
    pageSize,
    currentPage,
  });

  // console.log(paginationRange);

  if (currentPage === 0 || !paginationRange || paginationRange.length < 2) {
    return null;
  }

  const onPrevious = () => {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;

    searchParams.set("page", prev!.toString());
    setSearchParams(searchParams);
  };

  const onNext = () => {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;

    searchParams.set("page", next!.toString());
    setSearchParams(searchParams);
  };

  if (pageCount <= 1) return null;

  return (
    <div className="flex justify-center gap-3">
      <button
        className="p-3 rounded-md border text-[#888] hover:shadow-custom transition-all hidden md:block"
        onClick={onPrevious}
        disabled={currentPage === 1 ? true : false}
        key="prev"
      >
        <HiChevronLeft />
      </button>

      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return (
            <li
              key={pageNumber}
              className="list-none"
              // onClick={() => setSearchParams(index)}
            >
              &#8230;
            </li>
          );
        }

        return (
          <button
            key={pageNumber}
            className={`${
              currentPage === pageNumber
                ? "bg-[#b8cd06] text-white"
                : "bg-white text-[#888]"
            } px-4 py-3 text-xs rounded-md border hover:shadow-custom transition-all`}
            onClick={() => {
              searchParams.set("page", pageNumber!.toString());
              setSearchParams(searchParams);
            }}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        className="p-3 rounded-md border text-[#888] hover:shadow-custom transition-all hidden md:block"
        onClick={onNext}
        disabled={currentPage === pageCount ? true : false}
        key="next"
      >
        <HiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
