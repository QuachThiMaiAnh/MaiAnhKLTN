import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";

// ✅ Kiểu dữ liệu của trạng thái người dùng
interface UserState {
  _id: string | null;
  clerkId: string | null;
  role: string | null;
}

// ✅ Kiểu payload cho hành động đăng nhập
interface LoginPayload {
  _id: string;
  clerkId: string;
  role: string;
}

// ✅ Kiểu hành động được hỗ trợ
type UserAction = { type: "LOGIN"; payload: LoginPayload } | { type: "LOGOUT" };

// ✅ Kiểu dữ liệu cho context
interface UserContextType extends UserState {
  login: (userData: LoginPayload) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

// ✅ Giá trị khởi tạo ban đầu
const initialState: UserState = {
  _id: null,
  clerkId: null,
  role: null,
};

// ✅ Hàm reducer xử lý hành động
function reducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        _id: action.payload._id,
        clerkId: action.payload.clerkId,
        role: action.payload.role,
      };

    case "LOGOUT":
      return {
        _id: null,
        clerkId: null,
        role: null,
      };

    default:
      return state;
  }
}

// ✅ Provider bao bọc ứng dụng
function UserInfoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hàm đăng nhập → nhận toàn bộ thông tin user
  const login = (userData: LoginPayload) => {
    dispatch({ type: "LOGIN", payload: userData });
  };

  // Hàm đăng xuất → reset lại context
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// ✅ Hook custom sử dụng context
function useUserContext() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUserContext must be used within a UserInfoProvider");
  }
  return context;
}

export { UserInfoProvider, useUserContext };
