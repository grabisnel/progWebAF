/** 'receita' = Entrada, 'despesa' = Saída. */
export type TipoMovimentacao = 'receita' | 'despesa';

/** Formato exato que a API devolve. */
export interface Movimentacao {
  _id: string;
  descricao: string;
  /** Sempre positivo, em reais. O sinal vem do tipo. */
  valor: number;
  tipo: TipoMovimentacao;
  categoria: string;
}

/** Payload do POST (a API gera o _id). */
export type NovaMovimentacao = Omit<Movimentacao, '_id'>;

export interface Tag {
  nome: string;
  cor: string;
}

export type FiltroTipo = 'todas' | TipoMovimentacao;
