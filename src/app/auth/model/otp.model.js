import {Schema,model} from "mongoose";
const OtpSchema = new Schema({
    code:{
        type:String,
        required:true,
        length:4,},
        email:{
            type:String,
            required:true,
            trim:true,
            lowercase:true},
            expiresIn:{
                type:Date,
                required:true,
                index:{expires:0}},
                createdAt:{
                    type:Date,
                    default:Date.now}
                },{
    timestamps:true,
});
const Otp = model("Otp",OtpSchema);
export default Otp;
