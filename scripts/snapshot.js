/* Snapshot static HTML for core routes without running the server.
 * Renders EJS views using local JSON data to avoid network calls.
 */
import fs from 'fs/promises';
import path from 'node:path';
import ejs from 'ejs';

const ROOT = path.resolve(process.cwd());
const VIEWS = path.join(ROOT, 'views');
const PUBLIC_INFO = path.join(ROOT, 'public', 'information');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function alternateColors(count) {
  const result = [];
  for (let i = 0; i < count; i++) result.push(i % 2 === 0 ? 'blue' : 'red');
  return result;
}

async function render(viewFile, data) {
  const file = path.join(VIEWS, viewFile);
  const html = await ejs.renderFile(file, data, { async: true, root: VIEWS });
  return html.trim();
}

async function main() {
  const outRoot = path.join(ROOT, 'tests', 'snapshots', process.env.SNAPSHOT_PHASE || 'before');
  await ensureDir(outRoot);

  // Home (/)
  try {
    const articles = JSON.parse(await fs.readFile(path.join(PUBLIC_INFO, 'articles.json'), 'utf-8'));
    const panamaInfo = {
      name: 'Republic of Panama',
      capital: 'Panama City',
      region: 'Americas',
      language: 'Spanish',
      population: 4314768,
      flag: '/assets/panama-flag.jpg',
      alt: 'Panama flag',
    };
    const home = await render('index.ejs', { panamaInfo, articles: articles.articles, stories: [] });
    await fs.writeFile(path.join(outRoot, 'index.html'), home, 'utf-8');
  } catch (e) {
    console.error('Home snapshot failed:', e.message);
  }

  // Timeline (/timeline)
  try {
    const key = JSON.parse(await fs.readFile(path.join(PUBLIC_INFO, 'key_insights.json'), 'utf-8'));
    const time = JSON.parse(await fs.readFile(path.join(PUBLIC_INFO, 'timeline.json'), 'utf-8'));
    const colors = alternateColors(time.timeline.length);
    const timeline = await render('timeline.ejs', { keyInsights: key.keyInsights, timeline: time.timeline, colors });
    await fs.writeFile(path.join(outRoot, 'timeline.html'), timeline, 'utf-8');
  } catch (e) {
    console.error('Timeline snapshot failed:', e.message);
  }

  // Infrastructure (/infrastructure)
  try {
    const infra = JSON.parse(await fs.readFile(path.join(PUBLIC_INFO, 'infrastructure_panama.json'), 'utf-8'));
    const providers = JSON.parse(await fs.readFile(path.join(PUBLIC_INFO, 'providers_panama.json'), 'utf-8'));
    const html = await render('infrastructure.ejs', {
      timeline: infra.timeline,
      seaCables: infra.subsea_cables,
      ixp: infra.ixp[0],
      publicPrograms: infra.public_programs,
      spectrum: infra.spectrum_and_5g,
      providersInfo: providers.providers,
    });
    await fs.writeFile(path.join(outRoot, 'infrastructure.html'), html, 'utf-8');
  } catch (e) {
    console.error('Infrastructure snapshot failed:', e.message);
  }

  // Inclusion (/inclusion)
  try {
    const inclusion = JSON.parse(await fs.readFile(path.join(PUBLIC_INFO, 'inclusion.json'), 'utf-8'));
    const html = await render('inclusion.ejs', {
      programs: inclusion.community_access_programs,
      goverment: inclusion.e_government.institutional_milestones,
      plans: inclusion.strategic_agendas_and_plans,
      platforms: inclusion.e_government.flagship_platforms,
    });
    await fs.writeFile(path.join(outRoot, 'inclusion.html'), html, 'utf-8');
  } catch (e) {
    console.error('Inclusion snapshot failed:', e.message);
  }

  // Economy (/economy)
  try {
    const economy = JSON.parse(await fs.readFile(path.join(PUBLIC_INFO, 'economy.json'), 'utf-8'));
    const html = await render('economy.ejs', {
      meta: {},
      fintech: economy.sections?.online_banking_fintech ?? null,
      ecommerce: economy.sections?.ecommerce_growth ?? null,
      entrepreneurship: economy.sections?.digital_entrepreneurship ?? null,
      futureTrends: economy.sections?.future_trends ?? null,
      metrics: economy.metrics ?? null,
    });
    await fs.writeFile(path.join(outRoot, 'economy.html'), html, 'utf-8');
  } catch (e) {
    console.error('Economy snapshot failed:', e.message);
  }

  // Sources (/sources)
  try {
    const sources = JSON.parse(await fs.readFile(path.join(PUBLIC_INFO, 'combined_sources_v2.json'), 'utf-8'));
    const html = await render('sources.ejs', { sources });
    await fs.writeFile(path.join(outRoot, 'sources.html'), html, 'utf-8');
  } catch (e) {
    console.error('Sources snapshot failed:', e.message);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
