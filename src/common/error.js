 export class AppError extends Error {
  constructor(message, statusCode,isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor); 
  }
}
const err=new AppError("not found", 404);

