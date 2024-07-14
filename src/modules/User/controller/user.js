import userModel from "../../../../DB/models/User.js";
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import sendEmail from "../../../utils/sendEmail.js";
export const updateUser = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { email } = req.body;
  if (user.deleted) {
    return next(new Error("Your account is deleted", { cause: 400 }));
  }
  if (email) {
    const email = req.body.email.toLowerCase();
    if (user.email == email) {
      return next(
        new Error("You cannot change your email by the same email", {
          cause: 400,
        })
      );
    }
    const checkUser = await userModel.findOne({
      email
    }).select("email");
    if (checkUser) {
      return next(new Error("Email exist", { cause: 409 }));
    }
    const token = generateToken({
      payload: { email },
      signature: process.env.EMAILTOKEN,
      expiresIn: 60 * 5,
    });
    const refreshToken = generateToken({
      payload: { email },
      signature: process.env.EMAILTOKEN,
      expiresIn: 60 * 60 * 24,
    });
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const rfLink = `${req.protocol}://${req.headers.host}/auth/refreshEmail/${refreshToken}`;
    const message = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="${process.env.logo}">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    <tr>
    <td>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <a href="${rfLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new  email </a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">
  
    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>
  
    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`;
    const info = await sendEmail({
      to: email,
      subject: "Confirmation-Email",
      message,
    });
    if (!info) {
      return next(new Error("Email rejected", { cause: 400 }));
    }
    req.body.email = email;
    req.body.status = "offline";
    req.body.confirmEmail = false;
    req.body.changeTime = Date.now();
  }
  const updateUser = await userModel.findByIdAndUpdate(user._id, req.body);
  if (!updateUser) {
    return next(new Error("Fail to update your account", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done" });
});
export const deleteProfilePic = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (user.deleted) {
    return next(new Error("Your account is deleted", { cause: 400 }));
  }
  if (!user.image) {
    return next(new Error("Already you have not profilePic", { cause: 400 }));
  }
  await cloudinary.uploader.destroy(user.image.public_id);
  user.image = null;
  await user.save();
  return res.status(200).json({ message: "Done" });
});
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await userModel.findById(_id);
  const { oldPassword, password } = req.body;
  const match = compare({ plaintext: oldPassword, hashValue: user.password });
  if (!match) {
    return next(new Error("this password is wrong", { cause: 400 }));
  }
  const hashPassword = hash({ plaintext: password });
  user.password = hashPassword;
  user.changeTime = Date.now();
  await user.save();
  return res.status(200).json({ message: "Done" });
});
export const softDelete = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (user.deleted) {
    user.deleted = false;
  } else {
    user.deleted = true;
  }
  await user.save();
  return res.status(200).json({ message: "Done" });
});
export const blockUser = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  if (user._id == id) {
    return next(new Error("You can't block your self", { cause: 400 }));
  }
  const userBlocked = await userModel.findById(id);
  if (!userBlocked) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  if (userBlocked.role == "Admin") {
    return next(
      new Error("You can just block Client accounts", { cause: 400 })
    );
  }
  if (userBlocked.status == "blocked") {
    userBlocked.status = "offline";
  } else {
    userBlocked.changeTime = Date.now();
    userBlocked.status = "blocked";
  }
  await userBlocked.save();
  return res.status(200).json({ message: "Done" });
});
export const profile = asyncHandler(async (req, res, next) => {
  const { user } = req;
  return res.status(200).json({ message: "Done", user });
});
export const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findOne({ _id: id, status: { $ne: "blocked" } }).select("-password");
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", user });
});
export const users = asyncHandler(async (req, res, next) => {
  const users = await userModel.find({}).select("-password");
  if (!users.length) {
    return next(new Error("In-valid users", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", users });
});
