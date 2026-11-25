import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FiltroService } from '../../services/filtro.service';
import { MovimentacaoService } from '../../services/movimentacao.service';
import { TagService } from '../../services/tag.service';

// Lista de movimentações (cada linha: descrição, tag colorida, valor e lixeira)
@Component({
  selector: 'app-lista',
  imports: [CurrencyPipe],
  templateUrl: './lista.html',
  styleUrl: './lista.css',
})
export class Lista {
  constructor(
    public mov: MovimentacaoService,
    public filtro: FiltroService,
    public tags: TagService,
  ) {}
}
