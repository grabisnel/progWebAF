import { Injectable, signal } from '@angular/core';
import { FiltroTipo, Movimentacao } from '../models/movimentacao';
import { MovimentacaoService } from './movimentacao.service';

// Guarda os filtros escolhidos. O componente Filtros muda os valores
// e o componente Lista usa o resultado (igual ao TemaService dos exercícios).
@Injectable({ providedIn: 'root' })
export class FiltroService {
  tipo = signal<FiltroTipo>('todas');
  busca = signal('');
  tagsSelecionadas = signal<string[]>([]);

  constructor(private mov: MovimentacaoService) {}

  // Lista que aparece na tela, já filtrada
  resultado(): Movimentacao[] {
    let lista = this.mov.listar();

    if (this.tipo() !== 'todas') {
      lista = lista.filter((m) => m.tipo === this.tipo());
    }
    if (this.tagsSelecionadas().length > 0) {
      lista = lista.filter((m) => this.tagsSelecionadas().includes(m.categoria));
    }
    const texto = this.busca().trim().toLowerCase();
    if (texto !== '') {
      lista = lista.filter((m) => m.descricao.toLowerCase().includes(texto));
    }
    return lista;
  }

  temFiltro(): boolean {
    return this.tipo() !== 'todas' || this.busca() !== '' || this.tagsSelecionadas().length > 0;
  }

  estaSelecionada(nome: string): boolean {
    return this.tagsSelecionadas().includes(nome);
  }

  // Clicou no chip: se já estava marcado, desmarca; senão, marca
  alternarTag(nome: string): void {
    if (this.estaSelecionada(nome)) {
      this.tagsSelecionadas.set(this.tagsSelecionadas().filter((n) => n !== nome));
    } else {
      this.tagsSelecionadas.set([...this.tagsSelecionadas(), nome]);
    }
  }

  limpar(): void {
    this.tipo.set('todas');
    this.busca.set('');
    this.tagsSelecionadas.set([]);
  }
}
