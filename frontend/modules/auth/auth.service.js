import bcrypt from "bcryptjs";
import prisma from "../../prisma/prisma.client.js";
import { generateToken } from "../../utils/jwt.js";
import { sendEmail } from "../../utils/email.js";
import { adminWelcomeTemplate } from "../../utils/templates/adminWelcome.js";

export const register = async ({
  email,
  password,
  firstname,
  lastname,
  phone,
  role,
  createdBy,
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
      phone: phone || null,
      role: role || "ADMIN",
      createdBy: createdBy || null,
    },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      role: true,
      active: true,
      phone: true,
      createdBy: true,
      createdAt: true,
    },
  });

  const dashboardUrl = `${process.env.FRONTEND_URL}/auth/login`;
  sendEmail({
    to: user.email,
    subject: "Vodun Days - Acces administrateur",
    html: adminWelcomeTemplate({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password,
      dashboardUrl,
    }),
  }).catch((err) => console.error("[email] Echec envoi email admin :", err.message));

  return { user };
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

export const updateMe = async ({ userId, firstname, lastname, phone, email, currentPassword, newPassword }) => {
  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user) throw { status: 404, message: "Utilisateur introuvable" };

  if (newPassword) {
    if (!currentPassword) throw { status: 400, message: "Le mot de passe actuel est requis" };
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw { status: 401, message: "Mot de passe actuel incorrect" };
  }

  if (email && email !== user.email) {
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) throw { status: 409, message: "Cet email est déjà utilisé" };
  }

  const data = {};
  if (firstname) data.firstname = firstname;
  if (lastname) data.lastname = lastname;
  if (phone !== undefined) data.phone = phone || null;
  if (email) data.email = email;
  if (newPassword) data.password = await bcrypt.hash(newPassword, 12);

  const updated = await prisma.users.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      role: true,
      active: true,
      phone: true,
    },
  });

  return { user: updated };
};

export const getMe = async (userId) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      role: true,
      active: true,
      phone: true,
      lastLoging: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw { status: 404, message: "Utilisateur introuvable" };
  }

  if (!user.active) {
    throw { status: 403, message: "Compte désactivé" };
  }

  return user;
};
