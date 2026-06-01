import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import walletRoutes from './routes/walletRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Wallet service setup is successful!' });
});

app.use('/api/users', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);

app.use(errorHandler); 

app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});