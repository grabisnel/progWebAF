import type { Request, Response } from 'express';
import Movimentacao from '../models/Movimentacao.ts';

const arredondar = (valor: number) => Math.round(valor * 100) / 100;

export const listar = async (req: Request, res: Response) => {
  const { tipo, categoria, nome } = req.query;
  const filtro: Record<string, unknown> = {};

  if (typeof tipo === 'string') filtro.tipo = tipo;
  if (typeof categoria === 'string') filtro.categoria = categoria;
  if (typeof nome === 'string') filtro.nome = new RegExp(RegExp.escape(nome), 'i');

  res.json(await Movimentacao.find(filtro).sort({ _id: -1 }));
};

export const kpis = async (_req: Request, res: Response) => {
  const totais = await Movimentacao.aggregate([{ $group: { _id: '$tipo', total: { $sum: '$valor' } } }]);
  const entradas = arredondar(totais.find((t) => t._id === 'receita')?.total ?? 0);
  const saidas = arredondar(totais.find((t) => t._id === 'despesa')?.total ?? 0);

  res.json({ entradas, saidas, saldo: arredondar(entradas - saidas) });
};

export const criar = async (req: Request, res: Response) => {
  const { nome, valor, tipo, categoria } = req.body ?? {};
  res.status(201).json(await Movimentacao.create({ nome, valor, tipo, categoria }));
};

export const excluir = async (req: Request, res: Response) => {
  const movimentacao = await Movimentacao.findByIdAndDelete(req.params.id);

  if (!movimentacao) {
    res.status(404).json({ erro: 'Movimentação não encontrada' });
    return;
  }

  res.sendStatus(204);
};
