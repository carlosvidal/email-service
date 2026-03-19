import Fastify from "fastify";
import { sendEmail } from "./mailer.js";

const app = Fastify();

app.post("/send", async (req) => {
  const result = await sendEmail(req.body);
  return result;
});

const port = Number(process.env.PORT || 3000);
app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`HTTP server listo en http://localhost:${port}`);
});
