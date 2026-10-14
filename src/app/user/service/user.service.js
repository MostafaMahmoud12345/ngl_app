import * as userRepository from "../repository/user.repository.js";
import { userNotFound } from "../error.js";
import fs from "node:fs";

export async function getAllUsers() {
  return await userRepository.getAllUsers();
}
export const UploadProfilePic = async (userId, file) => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw userNotFound;
  if (user.profilePicPath) {
    fs.unlinkSync(user.profilePicPath);
  }
  await userRepository.UpdateUserByEmail(user.email, {
    profilePicPath: file.path,
  });
};
export async function UploadCoverImages() {}
export async function UploadCv() {}
