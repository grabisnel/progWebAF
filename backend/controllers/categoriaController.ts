import type { Request, Response } from 'express';
import Categoria from '../models/Categoria.ts';

export const listar = async (_req: Request, res: Response) => {
  res.json(await Categoria.find().sort({ nome: 1 }).collation({ locale: 'pt' }));
};

export const criar = async (req: Request, res: Response) => {
  const { nome, cor } = req.body ?? {};
  res.status(201).json(await Categoria.create({ nome, cor }));
};
