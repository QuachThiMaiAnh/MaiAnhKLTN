import jwt from "jsonwebtoken";

export const checkAuth = async (req, res, next) => {
  console.log(req);

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "123456", (error, decode) => {
    if (error.name === "TokenExpireError") console.log("Token het han");
    else if (error.name === "JsonWebTokenError")
      console.log("Token khong hop le");

    console.log("decode", decode);
  });
};
