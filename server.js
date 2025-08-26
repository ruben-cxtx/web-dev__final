import express from "express";
import path from "node:path";
import fs from 'fs/promises';
import dotenv from "dotenv";
import axios from "axios";
import { urlencoded } from "express";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import generateName from 'sillyname';
import { createAvatar } from '@dicebear/core';
import * as funEmoji from '@dicebear/fun-emoji';
// import helmet from "helmet";
import { randomUUID } from "node:crypto";
// import rateLimit from "express-rate-limit";


dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(urlencoded({ extended: true }));
// app.use(express.json({ limit: "10kb" }));
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.static(path.join(__dirname, 'public')));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const stories = new Map();

async function loadStories() {
  try {
    const storiesRaw = await fs.readFile('./public/information/stories.json', 'utf-8');
    const data = JSON.parse(storiesRaw);

    stories.clear();
    const list = Array.isArray(data.stories) ? data.stories : [];

    for (const s of list) {
      const id = randomUUID();
      const user = generateName();
      const avatarSVG =
        s.avatar ?? createAvatar(funEmoji, { seed: user, size: 64, radius: 50 }).toString();

      stories.set(id, {
        user,
        avatar: avatarSVG,
        title: s.title ?? '',
        story: s.story ?? ''
      });
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Failed to load stories.json:', err.message);
    }
  }
}



app.get("/", async (req, res) => {
  let panamaInfo = null;
  let articles = { articles: [] };


  try {
    const { data } = await axios.get('https://restcountries.com/v3.1/name/panama'); // using object destructuring to get the object from the api
    const panama = data[0]; // assigning the data to a variable for better readability

    panamaInfo = {
      name: panama.name.official,
      capital: panama.capital[0],
      region: panama.region,
      language: panama.languages.spa,
      population: panama.population,
      flag: panama.flags.png,
      alt: panama.flags.alt,
    };

    const raw = await fs.readFile('./public/information/articles.json', 'utf-8');
    articles = JSON.parse(raw);


  } catch (err) {
    console.error('Failed to fetch Panama data:', err.message);
  }

  res.render('index', { panamaInfo, articles: articles.articles, stories: [...stories.values()] });
});

app.post("/submit", async (req, res) => {

    try {
    const { title, story } = req.body;
    const id = randomUUID();
    const user = generateName();
    console.log(user);
    const avatar = createAvatar(funEmoji, {
    seed: user,
    size: 64,
    radius: 50
});
    const avatarSVG = avatar.toString();

    stories.set(id, { user, avatar: avatarSVG, title, story })
    res.redirect("/");

        await (async function saveStories() {
            const list = [...stories.values()].map(s => ({
                user: s.user,
                avatar: s.avatar,
                title: s.title,
                story: s.story
            }));
            await fs.mkdir(path.join(__dirname, 'public', 'information'), { recursive: true });
            await fs.writeFile(path.join(__dirname, 'public', 'information', 'stories.json'), JSON.stringify({ stories: list }, null, 2), 'utf-8');
        })();


    } catch (err) {
         console.error("couldn't post story, error:", err.message);
            res.status(500).send("Could not save story");
    }
})


app.listen(PORT, async () => {
    await loadStories();

    console.log(`App running on port ${PORT}`);
})
