import { Router } from "express";
import * as userController from "./controller/user.controller.js";
import { withCache } from "../../lib/cache/withCache.js";
import { guard } from "../../lib/auth/guard.js";
import {
  uploadFilesArray,
  uploadSingle,
  uploadFeilds,
} from "../../lib/media/multer.js";
import { allowedFeilds } from "../../lib/media/file.validation.js";
import { fileValidation } from "../../lib/media/file.validation.js";




const userRouter = Router();
userRouter.get("/get-all-users", withCache(3600), userController.getAllUsers);

userRouter.post(
  "/upload-profile-picture",guard,
  uploadSingle("pp"),
  fileValidation(allowedFeilds.image),
  userController.UploadProfilePic,
);

userRouter.post(
  "/upload-cover-images",
  uploadFilesArray("cover", 3),
  fileValidation(allowedFeilds.image),
);

userRouter.post(
  "/upload-cv",
  uploadSingle("cv", allowedFeilds.file),
  fileValidation(allowedFeilds.file),
);
export default userRouter;
