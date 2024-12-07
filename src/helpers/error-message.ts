export const errorMessage = (error: any) => {
  return (
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    "Unable to process request"
  );
};
