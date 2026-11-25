import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Movimentacao, NovaMovimentacao } from '../models/movimentacao';

const ERRO_SERVIDOR = 'Não foi possível falar com o servidor.';

// Serviço das movimentações. É o ÚNICO lugar que conversa com a API.
// Também guarda a lista, para todos os componentes enxergarem os mesmos dados
// (igual ao CarrinhoService dos exercícios).
//
// Por que "signal"? No Angular 22, quando a resposta da API chega, a tela só
// atualiza sozinha se o dado estiver num signal.
//   Ler:   this.movimentacoes()
//   Trocar: this.movimentacoes.set(novaLista)
@Injectable({ providedIn: 'root' })
export class MovimentacaoService {
  private url = environment.apiUrl;

  movimentacoes = signal<Movimentacao[]>([]); // na ordem em que vieram da API
  carregando = signal(true);
  salvando = signal(false);
  erro = signal(''); // '' = sem erro
  apagada = signal<Movimentacao | null>(null); // para o aviso "Apagado: ..."

  private timerAviso: number | undefined;

  constructor(private http: HttpClient) {}

  // ---------- Leitura ----------

  // Mais recente primeiro
  listar(): Movimentacao[] {
    return [...this.movimentacoes()].reverse();
  }

  // Os totais são em CENTAVOS (número inteiro) para não dar erro de arredondamento
  totalEntradas(): number {
    return this.somar('receita');
  }

  totalSaidas(): number {
    return this.somar('despesa');
  }

  saldo(): number {
    return this.totalEntradas() - this.totalSaidas();
  }

  // ---------- Chamadas à API ----------

  // GET /api/movimentacoes
  carregar(): void {
    this.carregando.set(true);
    this.http.get<Movimentacao[]>(this.url).subscribe({
      next: (lista) => {
        this.movimentacoes.set(lista);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set(ERRO_SERVIDOR + ' As movimentações não foram carregadas.');
      },
    });
  }

  // POST /api/movimentacoes
  // "depoisDeSalvar" é uma função que o formulário manda para limpar os campos.
  adicionar(nova: NovaMovimentacao, depoisDeSalvar: () => void): void {
    this.salvando.set(true);
    this.http.post<Movimentacao>(this.url, nova).subscribe({
      next: (criada) => {
        this.movimentacoes.set([...this.movimentacoes(), criada]);
        this.erro.set('');
        depoisDeSalvar();
        this.salvando.set(false);
      },
      error: () => {
        this.salvando.set(false);
        this.erro.set(ERRO_SERVIDOR + ' A movimentação não foi salva.');
      },
    });
  }

  // DELETE /api/movimentacoes/:id
  excluir(alvo: Movimentacao): void {
    this.http.delete(`${this.url}/${alvo._id}`).subscribe({
      next: () => {
        this.movimentacoes.set(this.movimentacoes().filter((m) => m._id !== alvo._id));
        this.mostrarAviso(alvo);
      },
      error: () => this.erro.set(ERRO_SERVIDOR + ' A movimentação não foi apagada.'),
    });
  }

  // "Desfazer" = criar de novo a movimentação apagada (a API dá um _id novo)
  desfazer(): void {
    const alvo = this.apagada();
    if (!alvo) return;
    this.fecharAviso();

    const copia: NovaMovimentacao = {
      descricao: alvo.descricao,
      valor: alvo.valor,
      tipo: alvo.tipo,
      categoria: alvo.categoria,
    };
    this.http.post<Movimentacao>(this.url, copia).subscribe({
      next: (criada) => this.movimentacoes.set([...this.movimentacoes(), criada]),
      error: () => this.erro.set(ERRO_SERVIDOR + ' Não deu pra desfazer.'),
    });
  }

  // ---------- Aviso "Apagado" (some sozinho em 6 segundos) ----------

  fecharAviso(): void {
    clearTimeout(this.timerAviso);
    this.apagada.set(null);
  }

  private mostrarAviso(m: Movimentacao): void {
    clearTimeout(this.timerAviso);
    this.apagada.set(m);
    this.timerAviso = setTimeout(() => this.apagada.set(null), 6000);
  }

  private somar(tipo: 'receita' | 'despesa'): number {
    let soma = 0;
    for (const m of this.movimentacoes()) {
      if (m.tipo === tipo) {
        soma += Math.round(m.valor * 100);
      }
    }
    return soma;
  }
}
