import { Schema, model } from 'mongoose';

const categoriaSchema = new Schema(
  {
    nome: { type: String, required: true, unique: true, trim: true },
    cor: { type: String, required: true, match: /^#[0-9a-fA-F]{6}$/ },
  },
  { versionKey: false },
);

export default model('Categoria', categoriaSchema, 'categorias');
