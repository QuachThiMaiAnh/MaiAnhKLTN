import { Skeleton } from "@/components/ui/skeleton";

const SkeletonProduct = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 mt-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <div className="px-5 border-x border-[#f7f7f7] mb-6" key={index}>
          <Skeleton className="h-4 w-2/3 custom-pulse mb-4" />
          <Skeleton className="size-[200px] w-full custom-pulse mb-8" />
          <Skeleton className="h-3 w-full custom-pulse mb-4" />
          <Skeleton className="h-8 w-full custom-pulse mb-4" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonProduct;
