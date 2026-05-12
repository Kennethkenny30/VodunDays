import prisma from "../../prisma/prisma.client.js";

export const findAll = async (role, active) => {
  const where = {};
  if (role) where.role = role;
  if (active !== undefined) where.active = active === "true";
  return prisma.users.findMany({
    where,
    select: {
      id: true,
      email: true,
      role: true,
      active: true,
      firstname: true,
      lastname: true,
      phone: true,
      lastLoging: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const user = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      active: true,
      firstname: true,
      lastname: true,
      phone: true,
      lastLoging: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw { status: 404, message: "Utilisateur non trouvé" };
  }
  return user;
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.users.update({
    where: { id },
    data: {
      ...(data.email !== undefined && { email: data.email }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.active !== undefined && { active: data.active }),
      ...(data.firstname !== undefined && { firstname: data.firstname }),
      ...(data.lastname !== undefined && { lastname: data.lastname }),
      ...(data.phone !== undefined && { phone: data.phone }),
    },
    select: {
      id: true,
      email: true,
      role: true,
      active: true,
      firstname: true,
      lastname: true,
      phone: true,
      lastLoging: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.users.delete({ where: { id } });
};
