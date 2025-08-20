import { ZodError } from 'zod';

const handleZodError = (error: ZodError) => {
  const errorMessages: any = error.issues.map(el => {
    return {
      path: el.path[el.path.length - 1],
      message: el.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages,
  };
};

export default handleZodError;
