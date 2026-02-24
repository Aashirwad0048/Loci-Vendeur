import bcrypt from "bcryptjs";

export const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, 10);
};
