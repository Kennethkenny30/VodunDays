import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import sitesRoutes from "./modules/sites/sites.routes.js";
import amenitiesRoutes from "./modules/amenities/amenities.routes.js";
import eventsTypesRoutes from "./modules/events-types/events-types.routes.js";
import eventsRoutes from "./modules/events/events.routes.js";
import programsRoutes from "./modules/programs/programs.routes.js";
import artistsRoutes from "./modules/artists/artists.routes.js";
import quizRoutes from "./modules/quiz/quiz.routes.js";
import questionsTypesRoutes from "./modules/questions-types/questions-types.routes.js";
import questionsRoutes from "./modules/questions/questions.routes.js";
import impressionsRoutes from "./modules/impressions/impressions.routes.js";
import questionsImpressionsRoutes from "./modules/questions-impressions/questions-impressions.routes.js";
import choicesRoutes from "./modules/choices/choices.routes.js";
import answersRoutes from "./modules/answers/answers.routes.js";
import usersRoutes from "./modules/users/users.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sites", sitesRoutes);
app.use("/api/amenities", amenitiesRoutes);
app.use("/api/events-types", eventsTypesRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/programs", programsRoutes);
app.use("/api/artists", artistsRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/questions-types", questionsTypesRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/impressions", impressionsRoutes);
app.use("/api/questions-impressions", questionsImpressionsRoutes);
app.use("/api/choices", choicesRoutes);
app.use("/api/answers", answersRoutes);
app.use("/api/users", usersRoutes);

// Route 404 (sans path = tout ce qui n'a pas été géré par les routes ci-dessus)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable" });
});

// Gestionnaire d'erreurs global (toujours en dernier)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
