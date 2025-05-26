export interface IListMessage {
  _id: string;
  user: string;
  admin: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  createdAt: Date;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    role: "Admin" | "User";
  };
  senderType: "User" | "Admin";
  text: string;
  _id: string;
}

// sender: {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   imageUrl: string;
//   role: "Admin" | "User";
// };
// senderType: "User" | "Admin";
// text: string;

export interface IMessageData {
  text: string;
  adminId: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export interface IUserNested {
  user: IUser;
}

export interface IConversation {
  _id: string;
  user: IUser;
  updatedAt: Date;
}

export interface IChatStoreState {
  listMessage: IListMessage | [];
  newMessage: string;
  conversations: IConversation[];
  selectedUser: string | null;
  selectedConversation: string | null;
  isConversationsLoading: boolean;
  isMessagesLoading: boolean;
}

export interface ChatStoreActions {
  getConversations: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (adminId: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: string) => void;
  setSelectedConversation: (selectedConversation: string) => void;
  setNewMessage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearNewMessage: () => void;
}
