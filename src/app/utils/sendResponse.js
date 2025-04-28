const sendResponse = (res, data) => {
  res.status(data.statusCode).send({
    success: true,
    statusCode: data.statusCode,
    message: data.message,
    token: data.token,
    data: data.data,
  });
};

export default sendResponse;
