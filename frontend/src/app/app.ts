import { Component } from '@angular/core';
import { Filtros } from './components/filtros/filtros';
import { Formulario } from './components/formulario/formulario';
import { Lista } from './components/lista/lista';
import { Resumo } from './components/resumo/resumo';
import { Toast } from './components/toast/toast';
import { MovimentacaoService } from './services/movimentacao.service';

// Componente principal: só monta a página com os outros componentes
@Component({
  selector: 'app-root',
  imports: [Resumo, Formulario, Filtros, Lista, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(public mov: MovimentacaoService) {
    this.mov.carregar(); // busca as movimentações na API quando a página abre
  }
}
