
export const errorHandler = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    msg: message,
    errors: errors.length > 0 ? errors : undefined,
  });
};

export const serverHandlerError = (res, err) => {
    console.error(err);
    return res.status(500).json({
        msg: "Server Error",
        error: err.message,
    })
}