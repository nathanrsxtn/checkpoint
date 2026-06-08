import app from "./index.js";

export default function express() {
  return {
    name: "express",
    configureServer(vite) {
      vite.middlewares.use(app);
    },
  };
}
