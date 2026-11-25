import { Component } from '@angular/core';
import { FiltroService } from '../../services/filtro.service';
import { TagService } from '../../services/tag.service';

// Abas Todas/Entradas/Saídas, busca e chips de tag.
// Os valores ficam no FiltroService, e a Lista lê de lá.
@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.html',
  styleUrl: './filtros.css',
})
export class Filtros {
  constructor(
    public filtro: FiltroService,
    public tags: TagService,
  ) {}
}
