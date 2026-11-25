import { Schema, model } from 'mongoose';

const movimentacaoSchema = new Schema(
  {
    nome: { type: String, required: true, trim: true },
    valor: { type: Number, required: true, min: 0.01 },
    tipo: { type: String, required: true, enum: ['receita', 'despesa'] },
    categoria: { type: String, default: null, trim: true },
  },
  { versionKey: false },
);

export default model('Movimentacao', movimentacaoSchema, 'movimentacoes');
