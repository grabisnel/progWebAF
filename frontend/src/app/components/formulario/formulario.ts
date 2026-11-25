import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TipoMovimentacao } from '../../models/movimentacao';
import { MovimentacaoService } from '../../services/movimentacao.service';
import { CORES, SEM_TAG, TagService } from '../../services/tag.service';

// Formulário "Nova movimentação" (com o bloquinho de criar tag)
@Component({
  selector: 'app-formulario',
  imports: [FormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css',
})
export class Formulario {
  cores = CORES;

  // Campos do formulário (ligados com [(ngModel)])
  tipo: TipoMovimentacao = 'despesa';
  valor = '';
  descricao = '';
  tag = ''; // '' quer dizer "Sem tag"

  // Mensagens de erro ('' = sem erro)
  erroValor = '';
  erroDescricao = '';

  // Bloco "Nova tag"
  mostrandoNovaTag = false;
  nomeNovaTag = '';
  corNovaTag = '';
  erroNovaTag = '';

  constructor(
    public mov: MovimentacaoService,
    public tags: TagService,
  ) {}

  // Botão "Adicionar"
  adicionar(): void {
    const valorEmReais = this.converterValor(this.valor);
    const descricao = this.descricao.trim();

    this.erroValor = valorEmReais > 0 ? '' : 'Informe um valor maior que zero, ex.: 125,90';
    this.erroDescricao = descricao !== '' ? '' : 'Dê uma descrição curta pra movimentação.';

    if (this.erroValor) {
      this.focar('campo-valor');
      return;
    }
    if (this.erroDescricao) {
      this.focar('campo-descricao');
      return;
    }

    const nova = {
      tipo: this.tipo,
      valor: valorEmReais,
      descricao: descricao,
      categoria: this.tag || SEM_TAG,
    };
    // Quando a API confirmar, limpa os campos (tipo e tag continuam como estavam)
    this.mov.adicionar(nova, () => {
      this.valor = '';
      this.descricao = '';
      this.focar('campo-valor');
    });
  }

  // "1.250,90" -> 1250.9   |   "125,90" -> 125.9   |   texto inválido -> 0
  converterValor(texto: string): number {
    const numero = Number(texto.trim().replace(/\./g, '').replace(',', '.'));
    if (isNaN(numero)) return 0;
    return Math.round(numero * 100) / 100;
  }

  // ---------- Nova tag ----------

  abrirNovaTag(): void {
    this.nomeNovaTag = '';
    this.corNovaTag = this.tags.corSugerida();
    this.erroNovaTag = '';
    this.mostrandoNovaTag = true;
    this.focar('campo-nova-tag');
  }

  criarTag(): void {
    const nome = this.nomeNovaTag.trim();
    if (nome === '') {
      this.erroNovaTag = 'Dê um nome pra tag.';
      return;
    }
    if (nome.toLowerCase() === SEM_TAG.toLowerCase()) {
      this.tag = '';
    } else {
      this.tag = this.tags.criar(nome, this.corNovaTag);
    }
    this.mostrandoNovaTag = false;
  }

  // Coloca o cursor num campo (o setTimeout espera o campo aparecer na tela)
  private focar(id: string): void {
    setTimeout(() => document.getElementById(id)?.focus());
  }
}
