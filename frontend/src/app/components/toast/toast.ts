import { Component } from '@angular/core';
import { MovimentacaoService } from '../../services/movimentacao.service';

// Aviso "Apagado: ..." com o botão Desfazer (só aparece depois de excluir algo)
@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  constructor(public mov: MovimentacaoService) {}
}
