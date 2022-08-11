export type HttpResponse = {
  statusCode: number;
  body: any;
};

export function ok<T>(dto?: T): HttpResponse {
  return {
    statusCode: 200,
    body: dto,
  };
}

export function created(): HttpResponse {
  return {
    statusCode: 201,
    body: undefined,
  };
}

export function clientError(error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: {
      statusCode: 400,
      message: error.message,
      error: 'Bad Request',
    },
  };
}

export function unauthorized(error: Error): HttpResponse {
  return {
    statusCode: 401,
    body: {
      statusCode: 401,
      message: error.message,
      error: 'Unauthorized',
    },
  };
}

export function forbidden(error: Error): HttpResponse {
  return {
    statusCode: 403,
    body: {
      statusCode: 403,
      message: error.message,
      error: 'Forbidden',
    },
  };
}

export function notFound(error: Error): HttpResponse {
  return {
    statusCode: 404,
    body: {
      statusCode: 409,
      message: error.message,
      error: 'Not Found',
    },
  };
}

export function conflict(error: Error): HttpResponse {
  return {
    statusCode: 409,
    body: {
      statusCode: 409,
      message: error.message,
      error: 'Conflict',
    },
  };
}

export function tooMany(error: Error): HttpResponse {
  return {
    statusCode: 429,
    body: {
      statusCode: 429,
      message: error.message,
      error: 'Too Many Requests',
    },
  };
}

export function fail(error: Error) {
  console.log(error);

  return {
    statusCode: 500,
    body: {
      statusCode: 500,
      message: error.message,
      error: 'Internal Server Error',
    },
  };
}
