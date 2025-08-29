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

function alternateColors(num1, num2, count) {
    let result = [];
    for (let i = 0; i < count; i++) {
        result.push(i % 2 === 0 ? "blue" : "red");
    }
    return result;
}

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
      const avatarSVG = createAvatar(funEmoji, { seed: user, size: 64, radius: 50 }).toString();

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

app.get('/timeline', async (req, res) => {
    let insights = { insights: [] };
    let timelineData = { timeline: [] };



    try {
        const raw_insights = await fs.readFile('./public/information/key_insights.json', 'utf-8');
        const raw_time = await fs.readFile('./public/information/timeline.json', 'utf-8');

        insights = JSON.parse(raw_insights);
        const keyInsights = insights.keyInsights;
        timelineData = JSON.parse(raw_time);
        const timeline = timelineData.timeline;


        const colors = alternateColors(1, 2, timeline.length);
        console.log(colors)
        res.render('timeline', {keyInsights, timeline, colors});

    } catch(err) {
        console.log("Couldn't fetch data for insights and timeline. Error: ", err.message);
        res.status(404).send("Couldn't Load files");
    }

});

app.get('/infrastructure', async (req, res) => {
    let infrastructure = null;
    let providers = null;

    try {
        const infraRaw = await fs.readFile(path.join(__dirname, 'public', 'information', 'infrastructure_panama.json'), 'utf-8');
        const providersRaw = await fs.readFile(path.join(__dirname, 'public', 'information', 'providers_panama.json'), 'utf-8');

        infrastructure = JSON.parse(infraRaw);
        providers = JSON.parse(providersRaw);

        const timeline = infrastructure.timeline;
        const seaCables = infrastructure.subsea_cables;
        const ixp = infrastructure.ixp[0];
        const publicPrograms = infrastructure.public_programs;
        const spectrum = infrastructure.spectrum_and_5g;

        const providersInfo = providers.providers;

        console.log(ixp)

        res.render('infrastructure', {
            timeline,
            seaCables,
            ixp,
            publicPrograms,
            spectrum,
            providersInfo
        });


    } catch (err) {
        console.error('Failed to load infrastructure/providers data:', err.message);
    }

});

app.get('/inclusion', async (req, res) => {
  let inclusion = null;
  let programs = null;
  let goverment = null;
  let plans = null;
  let platforms = null;
  let governmentPlatform = null;

  try {
    const inclusionRaw = await fs.readFile(path.join(__dirname, 'public', 'information', 'inclusion.json'), 'utf-8');
    inclusion = JSON.parse(inclusionRaw);

    programs = inclusion.community_access_programs;
    goverment = inclusion.e_government.institutional_milestones;
    plans = inclusion.strategic_agendas_and_plans;
    platforms = inclusion.e_government.flagship_platforms


  } catch (err) {
    console.error('Failed to load inclusion data:', err.message);
  }
  res.render('inclusion', { programs, goverment, plans, platforms });
});

app.get('/economy', async (req, res) => {
  let economy = null;
  try {
    const economyRaw = await fs.readFile(path.join(__dirname, 'public', 'information', 'economy.json'), 'utf-8');
    economy = JSON.parse(economyRaw);

    const meta = economy.meta || {};
    const obf = economy.sections ? economy.sections.online_banking_fintech : null;
    const ec = economy.sections ? economy.sections.ecommerce_growth : null;
    const de = economy.sections ? economy.sections.digital_entrepreneurship : null;
    const future = economy.sections ? economy.sections.future_trends : null;
    const metrics = economy.metrics || null;

    res.render('economy', {
      meta,
      obf,
      ec,
      de,
      future,
      metrics
    });
  } catch (err) {
    console.error('Failed to load economy data:', err.message);
    res.render('economy', { meta: {}, obf: null, ec: null, de: null, future: null, metrics: null });
  }
});

app.get('/sources', async (req, res) => {
  let sources = null;
  try {
    const sourcesRaw = await fs.readFile(path.join(__dirname, 'public', 'information', 'sources.json'), 'utf-8');
    sources = JSON.parse(sourcesRaw);
  } catch (err) {
    console.error('Failed to load sources catalog:', err.message);
  }
  res.render('sources', { sources });
});


app.listen(PORT, async () => {
    await loadStories();

    console.log(`App running on port ${PORT}`);
})



