import slugify from "slugify";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js";
import categoryModel from "../../../../DB/models/Category.js";
import paginate from "../../../utils/paginate.js";
import ApiFeatures from "../../../utils/apiFeatures.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  const { user } = req;
  req.body.name = req.body.name.toLowerCase();
  const { name } = req.body;
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  const checkName = await categoryModel.findOne({ name }).select("name");
  if (checkName) {
    return next(new Error("Dupplicate name", { cause: 409 }));
  }
  req.body.slug = slugify(req.body.name, {
    replacement: "-",
    lower: true,
    trim: true,
  });
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.PROJECTNAME}/category/${name}`,
    }
  );
  req.body.image = { secure_url, public_id };
  req.body.createdBy = user._id;
  const category = await categoryModel.create(req.body);
  if (!category) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("Fail to create a new category", { cause: 400 }));
  }
  return res.status(201).json({ message: "Done", category });
});
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const { name } = req.body;
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  const category = await categoryModel.findOne({
    _id: id
  });
  if (!category) {
    return next(new Error("In-valid category", { cause: 404 }));
  }
  if (name) {
    req.body.name = req.body.name.toLowerCase();
    if (req.body.name == category.name) {
      return next(
        new Error("Sory, you cannot update the name by the same name", {
          cause: 400,
        })
      );
    }
    const checkName = await categoryModel.findOne({
      name: req.body.name
    }).select("name");
    if (checkName) {
      return next(new Error("Dupplicate name", { cause: 409 }));
    }
    req.body.slug = slugify(req.body.name, {
      replacement: "-",
      lower: true,
      trim: true,
    });
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.PROJECTNAME}/category/${req.body.name.toLowerCase()}`,
      }
    );
    req.body.image = { secure_url, public_id };
  }
  req.body.updatedBy = user._id
  const updateCategory = await categoryModel.findOneAndUpdate({ _id: category._id }, req.body, {
    new: true
  });
  if (!updateCategory) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.body.image.public_id);
    }
    return next(new Error("In-valid category", { cause: 404 }));
  }
  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
  }
  return res.status(200).json({ message: "Done" });
});
// I didn't populate tasks here because I don't wanna get unshared tasks
export const categories = asyncHandler(async (req, res, next) => {
  const populate = [
    {
      path: "createdBy",
      select: "userName email image",
    },
    {
      path: "updatedBy",
      select: "userName email image",
    },
  ];
  const apiFeature = new ApiFeatures(
    req.query,
    categoryModel.find({}).populate(populate)
  )
    .paginate()
    .sort()
    .search()
  const categories = await apiFeature.mongooseQuery;
  if (!categories.length) {
    return next(new Error("In-valid categories", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", categories });
});
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const populate = [
    {
      path: "createdBy",
      select: "userName email image",
    },
    {
      path: "updatedBy",
      select: "userName email image",
    },
  ];
  const category = await categoryModel.findById(id).populate(populate);
  if (!category) {
    return next(new Error("In-valid category", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", category });
});