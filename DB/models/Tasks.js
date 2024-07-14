import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "minimum length 2 char"],
      max: [50, "max length 50 char"],
    },
    shared: {
      type: Boolean,
      default: true,
    },
    Content_type: {
      type: String,
      default: "Text",
      enum: ["List", "Text"],
    },
    textBody: String,
    deadline: Date,
    listBody: [String],
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "categoryId is required"],
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
  },
  {
    timestamps: true,
  }
);
const taskModel = model("Task", taskSchema);
export default taskModel;
