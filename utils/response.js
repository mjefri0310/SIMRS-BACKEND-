const isProduction = process.env.NODE_ENV === 'production';

/**
 * Standard Success Response
 */
const success = (
  res,
  {
    code = 200,
    message = 'Success',
    data = null,
    pagination = null,
    requestId = null,
  } = {}
) => {

  const result = {
    metadata: {
      code,
      message,
      timestamp: new Date().toISOString(),
    },
  };

  if (requestId) {
    result.metadata.request_id = requestId;
  }

  if (pagination) {
    result.pagination = pagination;
  }

  // hanya tampil jika ada data
  if (data !== null) {
    result.response = data;
  }

  return res.status(code).json(result);
};

/**
 * Standard Error Response
 */
const error = (
  res,
  {
    code = 500,
    message = 'Internal Server Error',
    response = null,
    err = null,
    requestId = null,
  } = {}
) => {

  const result = {
    metadata: {
      code,
      message,
      timestamp: new Date().toISOString(),
    },
  };

  if (response !== null) {
    result.response = response;
  }

  if (requestId) {
    result.metadata.request_id = requestId;
  }

  if (!isProduction && err) {
    result.debug = {
      message: err.message,
      stack: err.stack,
    };
  }

  return res.status(code).json(result);
};

/**
 * Validation Error Response
 */
const validation = (
  res,
  {
    code = 422,
    message = 'Validation Error',
    errors = {},
    requestId = null,
  } = {}
) => {

  const result = {
    metadata: {
      code,
      message,
      timestamp: new Date().toISOString(),
    },
    errors,
  };

  if (requestId) {
    result.metadata.request_id = requestId;
  }

  return res.status(code).json(result);
};

module.exports = {
  success,
  error,
  validation,
};