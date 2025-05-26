// import { useChatStore } from "@/common/context/useChatStore";
import ScrollableFeed from "react-scrollable-feed";
// import Loading from "./Loading";

const Content = ({
  messages,
}: {
  messages: {
    _id: string;
    text: string;
    senderType: string;
    createdAt: string;
    sender: {
      _id: string;
      firstName: string;
      lastName: string;
      role: string;
      imageUrl: string;
    };
  }[];
}) => {
  // const { listMessage, isMessagesLoading } = useChatStore();

  // if (isMessagesLoading) {
  //   return <Loading />;
  // }

  console.log(messages);

  const cleanHTML = (htmlString: string) => {
    return htmlString
      .replace(/```html\n?/g, "") // xóa đoạn mở ```html
      .replace(/```/g, ""); // xóa đoạn đóng ```
  };

  return (
    <ScrollableFeed>
      {messages?.length > 0 ? (
        messages.map((message) => {
          if (message.senderType === "Admin") {
            return (
              <div
                className="flex gap-2 rounded-lg text-sm ml-2 mt-4"
                key={message._id}
              >
                <img
                  className="w-10 h-10 rounded-full object-contain justify-end border"
                  src="https://res.cloudinary.com/do9l1lmcz/image/upload/v1726331293/zfbtxb1rprydlfsgicbt.png"
                  alt={`${message.sender.firstName} ${message.sender.lastName}`}
                />
                <p
                  className="bg-gray-200 max-w-[75%] px-3 py-2 break-words rounded-xl"
                  dangerouslySetInnerHTML={{ __html: cleanHTML(message.text) }}
                ></p>
              </div>
            );
          } else {
            return (
              <div
                className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-[#b8cd06] text-primary-foreground mr-2 mt-4"
                key={message._id}
              >
                {message.text}
              </div>
            );
          }
        })
      ) : (
        <p className="text-center text-gray-500">Xin chào mình là trợ lý AI bạn cần giúp gì?</p>
      )}
    </ScrollableFeed>
  );
};

export default Content;
