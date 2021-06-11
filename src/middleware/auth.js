// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// const auth = async (req, res, next) => {
//   try {
//     let token;
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     )
//       token = req.headers.authorization.split(" ")[1];
//     else if (req.cookies.jwt) token = req.cookies.jwt;

//     if (!token)
//       throw new Error("You are not logged in! Please log in to get access.");

//     // const token = req.header("Authorization").replace("Bearer ", "");
//     const decoded = jwt.verify(token, "thisismycourse");
//     const user = await User.findOne({
//       _id: decoded._id,
//       "tokens.token": token,
//     });

//     console.log(user);

//     if (!user) throw new Error("Invalid user");

//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(401).json({
//       status: "fail",
//       message: `${err}`,
//     });
//   }
// };

// module.exports = auth;
