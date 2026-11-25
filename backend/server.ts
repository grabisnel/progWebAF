import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import conectarBanco from './config/db.ts';
import movimentacaoRoutes from './routes/movimentacaoRoutes.ts';
import categoriaRoutes from './routes/categoriaRoutes.ts';

const app = express();
const porta = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/movimentacoes', movimentacaoRoutes);
app.use('/api/categorias', categoriaRoutes);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.type === 'entity.parse.failed') {
    res.status(400).json({ erro: err.message });
    return;
  }
  if (err.code === 11000) {
    res.status(409).json({ erro: 'Já existe uma categoria com esse nome' });
    return;
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

await conectarBanco();
app.listen(porta, () => console.log(`API em http://localhost:${porta}`));
