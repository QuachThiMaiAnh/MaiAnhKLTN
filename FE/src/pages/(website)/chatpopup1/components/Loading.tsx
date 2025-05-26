import { Skeleton } from "@/components/ui/skeleton";
import ScrollableFeed from "react-scrollable-feed";

const Loading = () => {
  const skeletonContacts = Array(5).fill(null);

  return (
    <div className="pt-4 px-4 border-r max-h-[310px]">
      <ScrollableFeed>
        {skeletonContacts.map((_, index) => (
          <div
            className={`flex gap-2 items-center mb-5 ${
              index % 2 == 0 ? "justify-end mr-4" : "justify-start"
            }`}
            key={index}
          >
            {index % 2 !== 0 && <Skeleton className="size-10 rounded-full" />}
            <div className="flex flex-col gap-4">
              <Skeleton className="w-[180px] h-[45px] rounded-lg" />
            </div>
          </div>
        ))}
      </ScrollableFeed>
    </div>
  );
};

export default Loading;
