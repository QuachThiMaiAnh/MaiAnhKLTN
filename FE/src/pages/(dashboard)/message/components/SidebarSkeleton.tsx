import { Skeleton } from "@/components/ui/skeleton";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <div className="pt-4 px-4 border-r">
      {skeletonContacts.map((_, index) => (
        <div className="flex gap-2 items-center mb-6" key={index}>
          <Skeleton className="size-12 rounded-full" />
          <div className="hidden lg:flex flex-col gap-4">
            <Skeleton className="w-[120px] lg:w-[190px] h-[20px] rounded-full" />
            <Skeleton className="w-[120px] lg:w-[190px] h-[20px] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarSkeleton;
