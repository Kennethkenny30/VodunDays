import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middlewares/error.middleware.js";

// ─── Modules existants ────────────────────────────────────────────────────────
import authRoutes                  from "./modules/auth/auth.routes.js";
import sitesRoutes                 from "./modules/sites/sites.routes.js";
import amenitiesRoutes             from "./modules/amenities/amenities.routes.js";
import eventsTypesRoutes           from "./modules/events-types/events-types.routes.js";
import eventsRoutes                from "./modules/events/events.routes.js";
import programsRoutes              from "./modules/programs/programs.routes.js";
import artistsRoutes               from "./modules/artists/artists.routes.js";
import quizRoutes                  from "./modules/quiz/quiz.routes.js";
import questionsTypesRoutes        from "./modules/questions-types/questions-types.routes.js";
import questionsRoutes             from "./modules/questions/questions.routes.js";
import impressionsRoutes           from "./modules/impressions/impressions.routes.js";
import questionsImpressionsRoutes  from "./modules/questions-impressions/questions-impressions.routes.js";
import choicesRoutes               from "./modules/choices/choices.routes.js";
import answersRoutes               from "./modules/answers/answers.routes.js";
import usersRoutes                 from "./modules/users/users.routes.js";

// ─── Nouveaux modules (Phase 3) ───────────────────────────────────────────────
import notificationsRoutes from "./modules/notifications/notifications.routes.js";
import auditRoutes         from "./modules/audit/audit.routes.js";
import surveyRoutes        from "./modules/survey/survey.routes.js";
import urgencesRoutes      from "./modules/urgences/urgences.routes.js";
import platformRoutes      from "./modules/platform/platform.routes.js";

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globaux ──────────────────────────────────────────────────────
app.use(helmet());

// Autorise le domaine de production configuré ET tous les déploiements
// Preview Vercel (URL unique générée à chaque déploiement, ex. vodun-days-xxxx.vercel.app).
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === FRONTEND_URL || /\.vercel\.app$/.test(new URL(origin).hostname)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // indispensable pour les cookies HttpOnly
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser()); // lecture des cookies HttpOnly

// ─── Routes API ───────────────────────────────────────────────────────────────

// Auth
app.use("/api/auth",                   authRoutes);

// Contenu public/admin
app.use("/api/sites",                  sitesRoutes);
app.use("/api/amenities",              amenitiesRoutes);
app.use("/api/events-types",           eventsTypesRoutes);
app.use("/api/events",                 eventsRoutes);
app.use("/api/programs",               programsRoutes);
app.use("/api/artists",                artistsRoutes);
app.use("/api/quiz",                   quizRoutes);
app.use("/api/questions-types",        questionsTypesRoutes);
app.use("/api/questions",              questionsRoutes);
app.use("/api/impressions",            impressionsRoutes);
app.use("/api/questions-impressions",  questionsImpressionsRoutes);
app.use("/api/choices",                choicesRoutes);
app.use("/api/answers",                answersRoutes);

// Utilisateurs (SUPER_ADMIN)
app.use("/api/users",                  usersRoutes);

// Nouveaux modules
app.use("/api/notifications",          notificationsRoutes);
app.use("/api/audit",                  auditRoutes);
app.use("/api/survey",                 surveyRoutes);
app.use("/api/urgences",               urgencesRoutes);
app.use("/api/platform",               platformRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable" });
});

// ─── Gestionnaire d'erreurs global (toujours en dernier) ─────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Serveur Vodun Days démarré sur http://localhost:${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV || "development"}`);
});
