import bcrypt from "bcryptjs";
import prisma from "../../prisma/prisma.client.js";
import { generateToken } from "../../utils/jwt.js";


export const register = async ({
  email,
  password,
  firstname,
  lastname,
  phone,
  role,
}) => {
  const existingUser = await prisma.users.findUnique({ where: { email } });

  if (existingUser) {
    throw { status: 409, message: "Cet email est déjà utilisé" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      firstname,
      lastname,
      phone,
      role: role || "AGENT",
    },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      role: true,
    },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

export const login = async ({ email, password }) => {
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user || !user.active) {
    throw { status: 401, message: "Email ou mot de passe incorrect" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw { status: 401, message: "Email ou mot de passe incorrect" };
  }

  await prisma.users.update({
    where: { id: user.id },
    data: { lastLoging: new Date() },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};
