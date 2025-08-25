import express from "express";
import path from "node:path";
import fs from 'fs/promises';
import dotenv from "dotenv";
import axios from "axios";
import { urlencoded } from "express";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";


dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
    try {
        const { data } = await axios.get('https://restcountries.com/v3.1/name/panama'); // using object destructuring to get the object from the api
        const panama = data[0]; //assigning the data to a variable for better redeability

        const panamaInfo = {
            name: panama.name.official,
            capital: panama.capital[0],
            region: panama.region,
            language: panama.languages.spa,
            population: panama.population,
            flag: panama.flags.png,
            alt: panama.flags.alt,
        }

        const raw = await fs.readFile('./public/information/articles.json', 'utf-8');
        const articles = JSON.parse(raw);


        console.log(panamaInfo, articles)

        res.render('index', { panamaInfo, articles: articles.articles });
    } catch (err) {
        console.error('Failed to fetch Panama data:', err.message);
        res.render('index', { panamaInfo: null });
    }
});




app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
})
