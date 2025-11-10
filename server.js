const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const { fetchAndSaveSeoulData } = require("./src/utils/fetchAndSaveData");

dotenv.config();

const authRouter = require("./src/routes/auth");
const seoulApiRouter = require("./src/routes/seoulApi");
const favoritesRouter = require("./src/routes/favorites");
const corsOptions = require("./configs/corsOptions");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/seoul", seoulApiRouter);
app.use("/api/favorites", favoritesRouter);

// 서버 시작 시 즉시 1회 실행
fetchAndSaveSeoulData();

// 이후 매 3분마다 실행
cron.schedule("*/3 * * * *", () => {
  fetchAndSaveSeoulData();
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
