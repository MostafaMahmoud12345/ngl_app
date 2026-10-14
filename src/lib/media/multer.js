import multer, { diskStorage } from "multer";
import crypto from "node:crypto";
import { AppError } from "../error/error.js"; 
import { allowedFeilds } from "./file.validation.js";
function multerUpload(allowedTypes = allowedFeilds.image) {
  return multer({
    fileFilter: function (req, file, cb) {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(
          new AppError(`${file.originalname}: invalid file format`, 400),
          false,
        );
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: "uploads",
      filename: function (req, file, cb) {
        cb(null, `${crypto.randomUUID()}--${file.originalname}`);
      },
    }),
  });
}
export function uploadSingle(
  feildName,
  allowedTypes =allowedFeilds.image,
) {
  return multerUpload(allowedTypes).single(feildName);
}
export function uploadFilesArray(feildName, maxCount) {
  return multerUpload().array(feildName, maxCount);
}
export function uploadFeilds(feilds) {
  return multerUpload().fields(feilds);
}
