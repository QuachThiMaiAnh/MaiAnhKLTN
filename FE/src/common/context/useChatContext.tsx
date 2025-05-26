// import { createContext, useContext, useReducer } from "react";

// // interface UserContextType {
// //   // Define the properties of your context here
// //   _id: string;
// //   clerkId: string;
// //   role: string;
// //   login: (id: string) => void;
// //   logout: () => void;
// // }

// const ChatContext = createContext<UserContextType | null>(null);

// const initialState = {
//   _id: null,
//   clerkId: null,
//   role: null,
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "LOGIN":
//       // console.log("action.payload", action.payload);
//       return {
//         ...state,
//         _id: action.payload._id,
//         clerkId: action.payload.clerkId,
//         role: action.payload.role,
//       };

//     case "LOGOUT":
//       return {
//         ...state,
//         _id: null,
//         clerkId: null,
//         role: null,
//       };

//     default:
//       return state;
//   }
// }

// function UserInfoProvider({ children }: { children: React.ReactNode }) {
//   const [{ _id, role, clerkId }, dispatch] = useReducer(reducer, initialState);

//   function login(id: string) {
//     dispatch({ type: "LOGIN", payload: id });
//   }

//   function logout() {
//     dispatch({ type: "LOGOUT" });
//   }

//   return (
//     <UserContext.Provider
//       value={{
//         _id,
//         role,
//         clerkId,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }

// function useUserContext() {
//   const context = useContext(UserContext);

//   if (context === null)
//     throw new Error("UserContext was outside the UserProvider");

//   return context;
// }

// export { UserInfoProvider, useUserContext };
