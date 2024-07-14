import { asyncHandler } from "../../../utils/errorHandling.js";
import categoryModel from "../../../../DB/models/Category.js";
import paginate from "../../../utils/paginate.js";
import taskModel from "../../../../DB/models/Tasks.js";
import ApiFeatures from "../../../utils/apiFeatures.js";

export const addTask = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { Content_type, listBody, textBody } = req.body;
  const { categoryId } = req.params
  if (Content_type == "Text" || !Content_type) {
    if (listBody) {
      delete req.body.listBody
    }
    if (!textBody) {
      return next(new Error("textBody is required", { cause: 400 }));
    }
  } else if (Content_type == "List") {
    if (textBody) {
      delete req.body.textBody
    }
    if (!listBody) {
      return next(new Error("listBody is required", { cause: 400 }));
    }
  }
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  const category = await categoryModel.findById(categoryId)
  if (!category) {
    return next(new Error("categoryId is not valid", { cause: 404 }));
  }
  req.body.userId = user._id;
  req.body.categoryId = categoryId
  const task = await taskModel.create(req.body);
  if (!task) {
    return next(new Error("Fail to create a new task", { cause: 400 }));
  }
  return res.status(201).json({ message: "Done", task });
});
export const updateTask = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { categoryId, id } = req.params;
  const { textBody, listBody } = req.body;
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  const task = await taskModel.findOne({ _id: id, categoryId, userId: user._id });
  if (!task) {
    return next(new Error("Task is undefined", { cause: 404 }));
  }
  if (task.Content_type == "Text") {
    if (listBody) {
      delete req.body.listBody
    }
  } else {
    if (textBody) {
      delete req.body.textBody
    }
  }
  const updatetask = await taskModel.findOneAndUpdate({ _id: task._id }, req.body, { new: true });
  if (!updatetask) {
    return next(new Error("Fail to updateTask", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done" });
});
export const deleteTask = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  const task = await taskModel.findOneAndDelete({ _id: id, userId: user._id });
  if (!task) {
    return next(new Error("Fail to delete task", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done" });
});
export const tasks = asyncHandler(async (req, res, next) => {
  const populate = [
    {
      path: "userId",
      select: "userName email",
    },
    {
      path: "categoryId",
      select: "name image",
    },
  ];
  let apiFeature;
  apiFeature = new ApiFeatures(
    req.query,
    taskModel.find({ shared: true }).populate(populate)
  )
    .paginate()
    .sort()
    .search()
  const tasks = await apiFeature.mongooseQuery;
  if (!tasks.length) {
    return next(new Error("In-valid tasks", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", tasks });
});
export const myTasks = asyncHandler(async (req, res, next) => {
  const { user } = req
  const { shared } = req.query
  const populate = [
    {
      path: "userId",
      select: "userName email",
    },
    {
      path: "categoryId",
      select: "name image",
    },
  ];
  let apiFeature;
  if (shared) {
    apiFeature = new ApiFeatures(
      req.query,
      taskModel.find({ shared, userId: user._id }).populate(populate)
    )
      .paginate()
      .sort()
      .search()
  } else {
    apiFeature = new ApiFeatures(
      req.query,
      taskModel.find({ userId: user._id }).populate(populate)
    )
      .paginate()
      .sort()
      .search()
  }

  const tasks = await apiFeature.mongooseQuery;
  if (!tasks.length) {
    return next(new Error("In-valid tasks", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", tasks });
});
export const getTaskById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const populate = [
    {
      path: "userId",
      select: "userName email",
    },
    {
      path: "categoryId",
      select: "name image",
    },
  ];
  const task = await taskModel.findOne({ _id: id, shared: true }).populate(populate);
  if (!task) {
    return next(new Error("In-valid task", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", task });
});
export const getMyTaskById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { user } = req
  const populate = [
    {
      path: "userId",
      select: "userName email",
    },
    {
      path: "categoryId",
      select: "name image",
    },
  ];
  const task = await taskModel.findOne({ _id: id, userId: user._id }).populate(populate);
  if (!task) {
    return next(new Error("In-valid task", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", task });
}); 
export const getTasksOfSpecificCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const populate = [
    {
      path: "userId",
      select: "userName email",
    },
    {
      path: "categoryId",
      select: "name image",
    },
  ];
  const task = await taskModel.findOne({ categoryId,shared:true }).populate(populate);
  if (!task) {
    return next(new Error("In-valid task", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", task });
}); 