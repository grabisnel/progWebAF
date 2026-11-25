import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MovimentacaoService } from '../../services/movimentacao.service';

// Saldo grande no topo + cards de Entradas e Saídas
@Component({
  selector: 'app-resumo',
  imports: [CurrencyPipe],
  templateUrl: './resumo.html',
  styleUrl: './resumo.css',
})
export class Resumo {
  constructor(public mov: MovimentacaoService) {}
}
