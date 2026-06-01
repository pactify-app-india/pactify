import express from 'express';
import cors from 'cors';
import onboardingRouter from './onboarding.js';

const app = express();
const PORT = process.env.PORT || 3001;
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: APP_BASE_URL,
    credentials: false,
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(onboardingRouter);

app.listen(PORT, () => {
  console.log(`Onboarding API listening on port ${PORT}`);
});
