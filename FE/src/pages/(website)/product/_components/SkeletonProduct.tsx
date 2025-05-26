import { Skeleton } from "@/components/ui/skeleton";

const SkeletonProduct = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 my-10">
      <div className="mx-auto">
        <Skeleton className="size-[360px] md:size-[420px]" />
        <div className="flex gap-2 mt-4 justify-center">
          <Skeleton className="size-14" />
          <Skeleton className="size-14" />
          <Skeleton className="size-14" />
          <Skeleton className="size-14" />
        </div>
      </div>

      <div>
        <Skeleton className="h-6 w-2/3 mt-[25px] md:mt-0" />
        <div className="block md:flex justify-between my-[25px]">
          <Skeleton className="h-7 md:h-6 w-full md:w-1/3 mb-4" />
          <Skeleton className="h-6 w-full md:w-1/3" />
        </div>

        <Skeleton className="h-14 w-full" />

        <div className="block md:flex gap-10 mt-[40px]">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-10 w-2/3" />
        </div>

        <div className="block md:flex gap-10 mt-[40px]">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-10 w-2/3" />
        </div>

        <div className="block md:flex gap-10 mt-[40px]">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-10 w-2/3" />
        </div>

        <div className="block md:flex gap-10 mt-[40px]">
          <Skeleton className="h-14 w-full md:w-1/2 mb-4" />
          <Skeleton className="h-14 w-full md:w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonProduct;
