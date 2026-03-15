# EverFresh

Landing page for **EverFresh Paintworks** — painting services in Southern Ontario (Oakville, Burlington, Mississauga, Hamilton, Waterloo, Guelph, Milton, Stoney Creek, Cambridge, Kitchener).

## Tech stack

- **Build:** [Vite](https://vitejs.dev/) 4.x
- **Templates:** [Handlebars](https://handlebarsjs.com/) (partials in `src/templates/`, `src/sections/`)
- **Styles:** SCSS
- **Scripts:** Vanilla JavaScript (ES modules)
- **Form:** [EmailJS](https://www.emailjs.com/) for quote requests
- **Maps:** Google Maps API (locations)
- **UI:** [Swiper](https://swiperjs.com/), [WOW.js](https://wowjs.uk/), [Animate.css](https://animate.style/)

## Project structure

```
EverFresh/
├── public/           # Static assets (images, favicon)
├── src/
│   ├── index.html    # Main entry
│   ├── sections/     # Handlebars section partials (hero, services, reviews, etc.)
│   ├── templates/    # Header, footer, form modal, callback
│   ├── js/
│   │   └── main.js   # App logic, form, map, modals
│   └── styles/       # SCSS (base, layout, vendors)
├── docs/
│   └── GTM-dataLayer-setup.md   # GTM setup for form_submit_success
├── vite.config.js
└── package.json
```

## Requirements

- [Node.js](https://nodejs.org/) v16+

## Setup

```bash
npm install
npm run dev
```

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start dev server (HMR)      |
| `npm run build`| TypeScript check + build   |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint                 |

## Configuration

- **EmailJS** — Set `EMAILJS_CONFIG` in `src/js/main.js` (serviceId, templateId, publicKey) for the quote form. See comments in file.
- **Google Maps** — API key is in `src/index.html`; replace with your key for production.
- **GTM** — Install the Google Tag Manager snippet on the site to use the `form_submit_success` dataLayer event. See [docs/GTM-dataLayer-setup.md](docs/GTM-dataLayer-setup.md).

## Deployment

Build output is in `dist/`. The Vite `base` is set to `/EverFresh` (see `vite.config.js`). For GitHub Pages on `https://<user>.github.io/<repo>/`, this is correct; for a root domain, change or remove `base`.

## License

MIT
