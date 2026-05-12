export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Erreur Prisma
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Cette valeur existe déjà en base de données",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Ressource introuvable",
    });
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Token invalide" });
  }

  // Erreur générique
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
  });
};
