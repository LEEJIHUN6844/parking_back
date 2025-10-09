const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRouter = require('./src/routes/auth');
const seoulApiRouter = require('./src/routes/seoulApi');
const corsOptions = require('./configs/corsOptions'); // ◀◀◀ CORS 설정 파일 불러오기

const app = express();

app.use(cors(corsOptions)); // ◀◀◀ 불러온 설정을 여기에 적용
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/seoul", seoulApiRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));