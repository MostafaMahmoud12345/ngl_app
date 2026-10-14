import User from "../model/user.model.js";


export async function UpdateUserByEmail(email, updateData) {
  return await User.findOneAndUpdate({ email: email }, updateData, 
    { returnDocument: "after",});
}

export async function getAllUsers() {
  return await User.find();
}

export async function findUserById(id) {
  return await User.findOne({ _id: id ,isDeleted: false},{password: 0});
}

