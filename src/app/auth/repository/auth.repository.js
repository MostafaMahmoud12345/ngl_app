
import User from "../../user/model/user.model.js";
export const findUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

export  async function createUser  (userData)  {
    return await User.create(userData);
};