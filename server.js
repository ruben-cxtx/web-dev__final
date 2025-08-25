import express from "express";
import path from "node:path";
import dotenv from "dotenv";
import { urlencoded } from "express";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(urlencoded({ extended: true }));
app.use(express.static('public'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
})
