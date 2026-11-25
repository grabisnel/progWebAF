import { Injectable, signal } from '@angular/core';
import { Tag } from '../models/movimentacao';
import { MovimentacaoService } from './movimentacao.service';

export const SEM_TAG = 'Sem tag';
export const COR_SEM_TAG = '#4a4f57';

// As 8 cores que o usuário pode escolher para uma tag
export const CORES = [
  { cor: '#7a1e2c', nome: 'Vinho' },
  { cor: '#2f6b45', nome: 'Verde' },
  { cor: '#1f5c66', nome: 'Petróleo' },
  { cor: '#2b3d6e', nome: 'Azul' },
  { cor: '#5e2a5c', nome: 'Ameixa' },
  { cor: '#9a3f24', nome: 'Telha' },
  { cor: '#93385a', nome: 'Rosa' },
  { cor: '#4a4f57', nome: 'Grafite' },
];

const CHAVE_NAVEGADOR = 'fin-tags';

// A API só guarda o NOME da categoria. A cor de cada tag fica aqui no frontend,
// salva no localStorage do navegador.
@Injectable({ providedIn: 'root' })
export class TagService {
  private tagsSalvas = signal<Tag[]>(this.lerDoNavegador());

  constructor(private mov: MovimentacaoService) {}

  // Tags salvas + categorias que vieram da API (essas ganham uma cor pela ordem)
  listar(): Tag[] {
    const lista = [...this.tagsSalvas()];
    let indice = 0;

    for (const m of this.mov.movimentacoes()) {
      if (m.categoria !== SEM_TAG && !this.buscar(m.categoria, lista)) {
        lista.push({ nome: m.categoria, cor: CORES[indice % CORES.length].cor });
        indice++;
      }
    }
    return lista;
  }

  // Tags que aparecem como chips no filtro ("Sem tag" só se alguma movimentação não tiver tag)
  listarParaFiltro(): Tag[] {
    const lista = this.listar();
    if (this.mov.movimentacoes().some((m) => m.categoria === SEM_TAG)) {
      lista.push({ nome: SEM_TAG, cor: COR_SEM_TAG });
    }
    return lista;
  }

  corDe(nome: string): string {
    const tag = this.buscar(nome, this.listar());
    return tag ? tag.cor : COR_SEM_TAG;
  }

  // Primeira cor da paleta que nenhuma tag está usando
  corSugerida(): string {
    const tags = this.listar();
    const livre = CORES.find((c) => !tags.some((t) => t.cor === c.cor));
    return livre ? livre.cor : CORES[0].cor;
  }

  // Cria a tag e devolve o nome dela.
  // Se já existir uma com o mesmo nome (maiúscula ou minúscula), só devolve a existente.
  criar(nome: string, cor: string): string {
    const existente = this.buscar(nome, this.listar());
    if (existente) {
      return existente.nome;
    }
    this.tagsSalvas.set([...this.tagsSalvas(), { nome: nome, cor: cor }]);
    localStorage.setItem(CHAVE_NAVEGADOR, JSON.stringify(this.tagsSalvas()));
    return nome;
  }

  private buscar(nome: string, lista: Tag[]): Tag | undefined {
    return lista.find((t) => t.nome.toLowerCase() === nome.toLowerCase());
  }

  private lerDoNavegador(): Tag[] {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_NAVEGADOR) ?? '[]') as Tag[];
    } catch {
      return [];
    }
  }
}
