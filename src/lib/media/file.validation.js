import { fileTypeFromBuffer } from "file-type";
import fs from "node:fs";
import { AppError } from "../error/error.js";
export const allowedFeilds = {
  image: ["image/png", "image/jpg"],
  file: ["application/pdf", "application/msword"],
  vidio: ["vidio/mp4"],
  audio: ["audio/mp3"],
};

// Middleware to validate file type by magic number (file signatures)
export const fileValidation =
  (allowedTypes = allowedFeilds.image) =>
  async (req, res, next) => {
    try {
      if (req.file.size > 6 * 1024 * 1024) {
        throw new AppError("exceeded size allowed", 400);
      }
      const filePath = req.file.path;
      const buffer = fs.readFileSync(filePath);
      const type = await fileTypeFromBuffer(buffer);
      if (!type || !allowedTypes.includes(type.mime)) {
        fs.unlinkSync(filePath);
        return next(new AppError(`Invalid file type`, 400));
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
