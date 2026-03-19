import "dotenv/config";
import { buildApp } from "./app.js";

const app = await buildApp();
const port = Number(process.env.PORT || 3000);

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`HTTP server listo en http://localhost:${port}`);
});
