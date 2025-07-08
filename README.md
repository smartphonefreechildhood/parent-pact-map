# 🤝 🗺️ Parent Pact Map 🗺️ 🤝

This project is a React + TypeScript + Vite app deployed via GitHub Pages.  
It is designed to be embedded into WordPress (e.g., Elementor) as a widget using the generated JavaScript and CSS files.

---

## 🔧 Getting Started

To run the project locally:

```bash
git clone https://github.com/your-org/parent-pact-map.git
cd parent-pact-map
npm install
npm run dev
```

## 📦 Deployment

To publish changes to GitHub Pages:

```bash
npm run build
npm run deploy
```

This will build the project and push the contents of the dist/ folder to the GitHub Pages branch.
The live app will be available at:
👉[https://smartphonefreechildhood.github.io/parent-pact-map](https://smartphonefreechildhood.github.io/parent-pact-map)

> **Note:** The Vite config (`vite.config.ts`) is customized to output static filenames (`index.js`, `index.css`) to ensure the embed code stays stable across deployments.

## 💡 Embedding in WordPress

To embed the widget into a WordPress page (e.g., using an Elementor HTML widget), paste the following code:

```html
<link
  rel="stylesheet"
  href="https://smartphonefreechildhood.github.io/parent-pact-map/assets/index.css"
/>
<div id="react-widget" style="width: 100%; height: 84vh;">
  <div id="react-pact-map"></div>
</div>
<script src="https://smartphonefreechildhood.github.io/parent-pact-map/assets/index.js"></script>
```

### Embed Notes:

- `#react-widget`: optional outer wrapper that controls height/width (can be styled in Elementor).
- `#react-pact-map`: the element the React app mounts into (see `main.tsx`).
- The app will stretch to fill the height and width of the parent container.
- The static filenames (`index.js`, `index.css`) allow editors to embed once and avoid updates after every deploy.

## 🧩 React App Mount Point

In `main.tsx`, the app is mounted to the inner container:

```ts
ReactDOM.createRoot(document.getElementById("react-pact-map")!).render(<App />);
```

## 🚀 Cache Busting (Optional)

To force browsers to reload the latest version, you can append a version query:

```html
<script src="https://smartphonefreechildhood.github.io/parent-pact-map/assets/index.js?v=1.0.3"></script>
```

## 🧰 General React + TypeScript + Vite info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 🧠 Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
