import {Schema, model} from "mongoose";
const messageSchema = new Schema({
    content:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        maxlength:250},
        receiver:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        sender:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },
        isDeleted:{
            type:Boolean,
            default:false,
        }},{
    timestamps:true,
});
const Message = model("Message",messageSchema);
export default Message;