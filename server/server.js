import { uploadJSON } from "./controllers/pinata.js";
import express from "express";
import helmet from "helmet";

const PORT = process.env.PORT || 3001;

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/pinFile", uploadJSON);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
