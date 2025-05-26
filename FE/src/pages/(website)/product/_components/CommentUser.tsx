import { TiStarFullOutline } from "react-icons/ti";
import { format } from "date-fns";

interface IUser {
  _id: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
}

interface CommentProps {
  comment: {
    _id: string;
    userId: IUser;
    content: string;
    rating: number;
    createdAt: Date;
    infoProductBuy?: string;
  };
}

const CommentUser: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="border-b mt-[25px]">
      <div className="flex justify-between mb-3">
        <div className="flex gap-3">
          <img
            className="size-12 rounded-full"
            src={comment.userId.imageUrl}
            alt="Ảnh người dùng"
          />

          <div>
            <span className="text-base leading-[18px] block mb-1">
              {comment.userId.firstName} {comment.userId.lastName}
            </span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <TiStarFullOutline
                  key={index}
                  className={`${
                    index < comment?.rating ? "text-[#b8cd06]" : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <span className="text-sm">
              Phân loại hàng: {comment.infoProductBuy}
            </span>

            <div
              className="text-[#888] leading-5 detail mt-5"
              dangerouslySetInnerHTML={{ __html: comment?.content }}
            />
          </div>
        </div>

        <span>{format(comment.createdAt, "HH:mm dd/M/yyyy")}</span>
      </div>

      {/* Content Comment */}

      {/* {comment?.content} */}
      {/* </div> */}
    </div>
  );
};

export default CommentUser;

// format(date, "HH:mm MMM dd / yy")
// dangerouslySetInnerHTML={{ __html: descriptionDetail }}
