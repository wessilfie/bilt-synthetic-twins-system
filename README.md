# Synthetic Twins: Predicting Product Launch Reactions with AI

An interactive investigative analysis exploring whether AI-generated customer personas — grounded in real Reddit community data — could have predicted the Bilt Rewards 2.0 launch backlash before it happened.

**[View the Live Site](https://bilt-synthetic-twins-system.vercel.app)**

## About the Project

In January 2025, Bilt Rewards overhauled its credit card program: introducing paid tiers, adding a 3% fee on rent payments, and restructuring its rewards. Within 48 hours, the backlash was so severe that CEO Ankur Jain issued a public apology and reversed key changes.

This project asks: **could AI have seen it coming?**

Using thousands of real Reddit posts from credit card communities (r/CreditCards, r/amex, r/bfrugal), I built 30 synthetic customer personas — AI-generated individuals with coherent backstories, financial situations, and values drawn from how real people actually talk about these products. I then "interviewed" these personas about unannounced product changes to see if their reactions would match reality.

### Key Findings

- Synthetic twins predicted Bilt would receive significantly more negative reactions than Amex (2.07 vs 3.27 excitement on a 5-point scale)
- After exposure to Reddit discourse, negativity deepened — Bilt scores dropped to 1.47/5
- The 1.2-point gap between Bilt and Amex correctly differentiated a catastrophic launch from a manageable one
- The AI wasn't perfect (it predicted 0% paid tier interest vs. 83% actual adoption), but it was directionally right on the core question

### Comparison Case: Amex Gold Refresh

To validate the framework, I ran the same pipeline on the 2024 Amex Gold card refresh (annual fee increase from $250 to $325 with added benefits). The synthetic twins predicted mixed but survivable reception — which is exactly what happened. No reversal, no CEO apology.

## How the Site Is Built

This is a single-page scrollytelling website built for desktop, inspired by interactive articles from outlets like NYT, Bloomberg, and The Pudding.

### Tech Stack

- **[Vite](https://vitejs.dev/)** — Build tool and dev server
- **Vanilla JS** — No framework, just clean DOM manipulation
- **[Chart.js](https://www.chartjs.org/)** — Data visualizations (sentiment distributions, before/after comparisons, tier migration, time-to-insights)
- **CSS3** — Custom properties, scroll-triggered animations via Intersection Observer, radial gradient overlays
- **[OpenStreetMap](https://www.openstreetmap.org/) + [maptoposter](https://github.com/originalankur/maptoposter)** — NYC street map background generated from real geographic data

### Interactive Elements

- Multiple-choice quiz asking readers how they'd react to Bilt 2.0 changes
- Filterable persona carousel showing synthetic twin profiles across communities
- Reddit post influence quiz revealing which posts moved sentiment most
- Expandable accordion cards for project learnings
- Scroll-triggered chart animations and stat counters

### Running Locally

```bash
npm install
npm run dev
```

### Deploying

The site is configured for Vercel deployment:

```bash
npm run build   # outputs to dist/
vercel           # deploy
```

## Data Sources

- Reddit communities: r/CreditCards, r/amex, r/bfrugal (via Pushshift/Academic Torrents)
- Bilt Rewards official announcements and product pages
- Amex Gold card refresh details
- Public reporting from Bloomberg, NerdWallet, and other financial media

## Acknowledgments

- **Professor George Gui**, Columbia Business School — for teaching me about synthetic twins research methodology
- **Bryan Catlett** — for collaboration and discussion on the research approach
- OpenStreetMap contributors for the geographic data powering the background map

## Author

**Will Essilfie** — Columbia Business School, MBA 2026
GenAI for Marketing, Spring 2026

[essilfie.com](https://essilfie.com)
