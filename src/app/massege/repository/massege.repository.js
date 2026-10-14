import Message  from "../model/massege.model.js";

export async function createMessage(content, receiver, sender) {
  return await Message.create({
    content: content,
    receiver: receiver,
    sender: sender,
  });
}
export async function getAllMessages(userId){
  return  Message.find({receiver:userId},{},{populate:{path:"sender",select:'name'}})

}
