import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "react-quill/dist/quill.snow.css";
import CommentUser from "./CommentUser";

interface IUser {
  _id: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
}

const SeeMore = ({
  comments,
  descriptionDetail,
}: {
  comments: {
    _id: string;
    userId: IUser;
    content: string;
    rating: number;
    createdAt: Date;
  }[];
  descriptionDetail: string;
}) => {
  return (
    <div className="md:px-6 list-disc">
      <Tabs defaultValue="comment">
        <TabsList className="flex w-full grid-cols-2 justify-center bg-transparent">
          <div className="pr-4 border-r">
            <TabsTrigger
              className="py-2 px-8 text-[11px] data-[state=active]:rounded-full data-[state=active]:bg-[#b8cd06] data-[state=active]:text-white uppercase font-raleway"
              value="description"
            >
              mô tả
            </TabsTrigger>
          </div>
          <div className="pl-4">
            <TabsTrigger
              className="py-2 px-8 text-[11px] data-[state=active]:rounded-full data-[state=active]:bg-[#b8cd06] data-[state=active]:text-white uppercase font-raleway"
              value="comment"
            >
              đánh giá
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="description">
          {descriptionDetail !== "<p><br></p>" && (
            <div
              className="detail mt-[30px] md:mt-[60px] bg-slate-100 p-4"
              dangerouslySetInnerHTML={{ __html: descriptionDetail }}
            />
          )}
        </TabsContent>
        <TabsContent value="comment">
          <div className="h-[30px] md:h-[60px]"></div>

          {comments.map((comment) => (
            <CommentUser key={comment._id} comment={comment} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeeMore;
