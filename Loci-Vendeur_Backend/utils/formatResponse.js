export const formatResponse = ({ success = true, message = "", data = null }) => {
  return { success, message, data };
};
