import jwt from "jsonwebtoken";
import {toMs} from "../../../common/utlities/time.js";

export  function generateToken (payload)  {
return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: toMs(1, "h"),
  });
};

