import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { appConfig } from './app.config';
import { environment } from '../environments/environment';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [...appConfig.providers, provideHttpClientTesting()],
    }).compileComponents();
  });

  it('mostra o saldo calculado a partir da API', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(environment.apiUrl).flush([
      { _id: '1', descricao: 'Salário', valor: 1000, tipo: 'receita', categoria: 'Trabalho' },
      { _id: '2', descricao: 'Mercado', valor: 125.9, tipo: 'despesa', categoria: 'Sem tag' },
    ]);
    await fixture.whenStable();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('.valor-saldo')?.textContent).toContain('874,10');
    expect(html.querySelectorAll('.lista li').length).toBe(2);
  });

  it('mostra o estado vazio', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne(environment.apiUrl).flush([]);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Nenhuma movimentação ainda. Registre a primeira no formulário.',
    );
  });

  it('adiciona, limpa o formulário, exclui e desfaz', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(environment.apiUrl).flush([]);
    await fixture.whenStable();

    const html = fixture.nativeElement as HTMLElement;
    const valor = html.querySelector<HTMLInputElement>('#campo-valor')!;
    const descricao = html.querySelector<HTMLInputElement>('#campo-descricao')!;

    // Preenche e envia
    valor.value = '1.250,90';
    valor.dispatchEvent(new Event('input'));
    descricao.value = 'Aluguel';
    descricao.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    html.querySelector('form')!.dispatchEvent(new Event('submit'));

    const post = http.expectOne((r) => r.method === 'POST');
    expect(post.request.body).toEqual({
      tipo: 'despesa',
      valor: 1250.9,
      descricao: 'Aluguel',
      categoria: 'Sem tag',
    });
    post.flush({ _id: 'x1', ...post.request.body });
    await fixture.whenStable();

    expect(valor.value).toBe('');
    expect(descricao.value).toBe('');
    expect(html.querySelector('.valor-saldo')?.textContent).toContain('1.250,90');
    expect(html.querySelectorAll('.lista li.linha').length).toBe(1);

    // Exclui
    html.querySelector<HTMLButtonElement>('.lista .botao-icone')!.click();
    http.expectOne((r) => r.method === 'DELETE' && r.url.endsWith('/x1')).flush(null);
    await fixture.whenStable();
    expect(html.querySelectorAll('.lista li.linha').length).toBe(0);
    expect(html.querySelector('.toast')?.textContent).toContain('Apagado: Aluguel');

    // Desfaz (novo POST)
    html.querySelector<HTMLButtonElement>('.toast .desfazer')!.click();
    const repost = http.expectOne((r) => r.method === 'POST');
    repost.flush({ _id: 'x2', ...repost.request.body });
    await fixture.whenStable();
    expect(html.querySelectorAll('.lista li.linha').length).toBe(1);
    expect(html.querySelector('.toast')).toBeNull();
  });

  it('mostra erro de validação sem chamar a API', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(environment.apiUrl).flush([]);
    await fixture.whenStable();

    const html = fixture.nativeElement as HTMLElement;
    html.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(html.textContent).toContain('Informe um valor maior que zero, ex.: 125,90');
    expect(html.textContent).toContain('Dê uma descrição curta pra movimentação.');
    http.expectNone((r) => r.method === 'POST');
  });
});
