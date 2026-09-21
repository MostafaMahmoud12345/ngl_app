import otp from "../../auth/model/otp.model.js";

export async function createOtp(otpData) {
    return await otp.create(otpData);
}

export async function findOtpByEmail(email) {
    return await otp.findOne({ email: email });
}
 export async function deleteOtpByEmail(email) {
    return await otp.deleteMany({ email: email });
}