import { success } from "zod";
import * as userService from "../service/user.service.js";

export async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export const UploadProfilePic=async(req, res, next) =>{
  try {
   await userService.UploadProfilePic(req.user.id, req.file);
    res.json({message:"Upload Profile Pic successfuly",success:true});
  } catch (error) {
    next(error);
  }
}

