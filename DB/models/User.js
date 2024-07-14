import { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
      lowercase: true,
    },
    email: {
      type: String,
      unique: [true, "email must be unique value"],
      lowercase: true,
    },
    password: String,
    role: {
      type: String,
      default: "Client",
      enum: ["Client", "Admin"],
    },

    status: {
      type: String,
      default: "offline",
      enum: ["offline", "online", "blocked"],
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    code: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = model("User", userSchema);
export default userModel;
