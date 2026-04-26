import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlantaService, PlantaRequest, Comodo, ValidacaoResult } from '../../services/planta.service';

@Component({
  selector: 'app-gerador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gerador-container">
      <div class="gerador-header">
        <h1>
          <span class="icon">⚡</span>
          Gerador de <span class="highlight">Plantas HIS</span>
        </h1>
        <p class="subtitle">Configure os parâmetros da sua habitação de interesse social</p>
      </div>

      <div class="gerador-content">
        <div class="gerador-form">
          <div class="form-card">
            <div class="card-header">
              <span class="card-icon">◈</span>
              <h2>Parâmetros do Terreno</h2>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Nome do Projeto</label>
                <input 
                  type="text" 
                  [(ngModel)]="planta.nome" 
                  name="nome"
                  placeholder="Minha Casa HIS"
                >
              </div>
              <div class="form-group">
                <label>Ano de Construção</label>
                <input 
                  type="number" 
                  [(ngModel)]="planta.anoConstrucao" 
                  name="anoConstrucao"
                  [min]="2024"
                  placeholder="2026"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Largura Total (cm)</label>
                <input 
                  type="number" 
                  [(ngModel)]="planta.larguraTotal" 
                  name="larguraTotal"
                  [min]="500"
                  [max]="1500"
                  placeholder="600"
                  (input)="onDimensionsChange()"
                >
                <span class="hint">{{ planta.larguraTotal ? (planta.larguraTotal / 100).toFixed(2) + 'm' : '' }}</span>
              </div>
              <div class="form-group">
                <label>Comprimento Total (cm)</label>
                <input 
                  type="number" 
                  [(ngModel)]="planta.comprimentoTotal" 
                  name="comprimentoTotal"
                  [min]="500"
                  [max]="1500"
                  placeholder="700"
                  (input)="onDimensionsChange()"
                >
                <span class="hint">{{ planta.comprimentoTotal ? (planta.comprimentoTotal / 100).toFixed(2) + 'm' : '' }}</span>
              </div>
            </div>

            <div class="area-info">
              <div class="area-item">
                <span class="area-label">Área Total</span>
                <span class="area-value">{{ areaTotal.toFixed(2) }} m²</span>
              </div>
              <div class="area-item">
                <span class="area-label">Área Construída</span>
                <span class="area-value" [class.danger]="areaConstruida > 50">{{ areaConstruida.toFixed(2) }} m²</span>
              </div>
              <div class="area-item">
                <span class="area-label">Área Restante</span>
                <span class="area-value" [class.success]="areaRestante > 0" [class.danger]="areaRestante <= 0">{{ areaRestante.toFixed(2) }} m²</span>
              </div>
            </div>

            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="(areaConstruida / 50) * 100"></div>
              <div class="progress-limit" [style.left.%]="100"></div>
            </div>
            <div class="progress-label">
              <span>{{ ((areaConstruida / 50) * 100).toFixed(0) }}% usado</span>
              <span class="limit-text">Limite: 50m² (HIS)</span>
            </div>
          </div>

          <div class="form-card">
            <div class="card-header">
              <span class="card-icon">⊞</span>
              <h2>Ambientes</h2>
              <button class="btn-add" (click)="adicionarComodo()">
                <span>+</span> Adicionar
              </button>
            </div>

            <div class="comodos-list" *ngIf="planta.comodos.length > 0">
              <div class="comodo-item" *ngFor="let comodo of planta.comodos; let i = index">
                <div class="comodo-number">{{ i + 1 }}</div>
                <div class="comodo-fields">
                  <input 
                    type="text" 
                    [(ngModel)]="comodo.nome" 
                    [name]="'nome' + i"
                    placeholder="Nome do cômodo"
                    class="comodo-nome"
                  >
                  <div class="comodo-dims">
                    <input 
                      type="number" 
                      [(ngModel)]="comodo.largura" 
                      [name]="'largura' + i"
                      placeholder="Largura"
                      class="comodo-dim"
                      (input)="onDimensionsChange()"
                    >
                    <span class="dim-separator">×</span>
                    <input 
                      type="number" 
                      [(ngModel)]="comodo.comprimento" 
                      [name]="'comprimento' + i"
                      placeholder="Compr."
                      class="comodo-dim"
                      (input)="onDimensionsChange()"
                    >
                    <span class="dim-unit">cm</span>
                  </div>
                  <span class="comodo-area">{{ getComodoArea(comodo).toFixed(2) }} m²</span>
                </div>
                <button class="btn-remove" (click)="removerComodo(i)" *ngIf="planta.comodos.length > 1">
                  <span>×</span>
                </button>
              </div>
            </div>

            <div class="empty-state" *ngIf="planta.comodos.length === 0">
              <span class="empty-icon">⊞</span>
              <p>Nenhum ambiente adicionado</p>
              <button class="btn btn-secondary" (click)="adicionarComodo()">Adicionar Primeiro Ambiente</button>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary" (click)="validarPlanta()" [disabled]="loading">
              <span class="btn-icon">✓</span>
              Validar
            </button>
            <button class="btn btn-primary" (click)="gerarAutomatica()" [disabled]="loading">
              <span class="btn-icon">⚡</span>
              Gerar Automaticamente
            </button>
            <button class="btn btn-success" (click)="criarPlanta()" [disabled]="loading">
              <span class="btn-icon">◈</span>
              Salvar Planta
            </button>
          </div>

          <div class="validacao-result" *ngIf="validacao">
            <div class="result-header" [class.success]="validacao.valida" [class.error]="!validacao.valida">
              <span class="result-icon">{{ validacao.valida ? '✓' : '✗' }}</span>
              <span class="result-title">{{ validacao.valida ? 'Planta Válida' : 'Atenção aos Erros' }}</span>
            </div>
            <ul class="result-messages">
              <li *ngFor="let msg of validacao.mensagens" [class.success]="validacao.valida">
                {{ msg }}
              </li>
            </ul>
          </div>
        </div>

        <div class="gerador-preview">
          <div class="preview-card">
            <div class="card-header">
              <span class="card-icon">◈</span>
              <h2>Pré-visualização</h2>
            </div>
            
            <div class="blueprint-preview">
              <div class="bp-container" [style.width.px]="previewSize" [style.height.px]="previewSize * (planta.comprimentoTotal / planta.larguraTotal)">
                <div 
                  class="bp-room" 
                  *ngFor="let comodo of planta.comodos; let i = index"
                  [style.width.%]="(comodo.largura / planta.larguraTotal) * 100"
                  [style.height.%]="(comodo.comprimento / planta.comprimentoTotal) * 100"
                  [style.left.%]="getRoomPosition(i).left"
                  [style.top.%]="getRoomPosition(i).top"
                  [class.has-position]="comodo.posicaoX !== undefined"
                >
                  <span class="bp-room-label">{{ comodo.nome }}</span>
                  <span class="bp-room-area">{{ getComodoArea(comodo).toFixed(1) }}m²</span>
                </div>
              </div>
            </div>

            <div class="preview-info" *ngIf="planta.comodos.length > 0">
              <h4>Legenda</h4>
              <div class="legend-list">
                <div class="legend-item" *ngFor="let comodo of planta.comodos; let i = index">
                  <span class="legend-num">{{ i + 1 }}</span>
                  <span class="legend-name">{{ comodo.nome || 'Sem nome' }}</span>
                  <span class="legend-dim">{{ comodo.largura }} × {{ comodo.comprimento }}</span>
                  <span class="legend-area">{{ getComodoArea(comodo).toFixed(2) }}m²</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gerador-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .gerador-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .gerador-header h1 {
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .icon {
      color: #00f0ff;
    }

    .subtitle {
      color: #8fa3b0;
      margin-top: 8px;
    }

    .gerador-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 30px;
    }

    .form-card {
      background: rgba(13, 20, 33, 0.8);
      border: 1px solid rgba(0, 240, 255, 0.2);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(0, 240, 255, 0.15);
    }

    .card-icon {
      font-size: 1.2rem;
      color: #00f0ff;
    }

    .card-header h2 {
      font-size: 1rem;
      flex: 1;
    }

    .btn-add {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.3);
      border-radius: 4px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.7rem;
      color: #00f0ff;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 240, 255, 0.2);
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
      }

      span:first-child {
        font-size: 1.2rem;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 0;

      label {
        display: block;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #00f0ff;
        margin-bottom: 8px;
      }

      input {
        width: 100%;
        background: rgba(17, 24, 39, 0.8);
        border: 1px solid rgba(0, 240, 255, 0.2);
        color: #e8f4f8;
        padding: 12px 16px;
        border-radius: 4px;
        font-size: 1rem;

        &:focus {
          border-color: #00f0ff;
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
          outline: none;
        }
      }

      .hint {
        font-size: 0.75rem;
        color: #5a6b7a;
        margin-top: 4px;
        display: block;
      }
    }

    .area-info {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }

    .area-item {
      background: rgba(0, 240, 255, 0.05);
      border: 1px solid rgba(0, 240, 255, 0.15);
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }

    .area-label {
      display: block;
      font-size: 0.65rem;
      color: #5a6b7a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }

    .area-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: #00f0ff;

      &.success {
        color: #05ffa1;
      }

      &.danger {
        color: #ff2a6d;
      }
    }

    .progress-bar {
      height: 8px;
      background: rgba(0, 240, 255, 0.1);
      border-radius: 4px;
      position: relative;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00f0ff, #b829f8);
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .progress-limit {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #ff2a6d;
    }

    .progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: #8fa3b0;
      margin-top: 8px;
    }

    .limit-text {
      color: #ff2a6d;
    }

    .comodos-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .comodo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(17, 24, 39, 0.5);
      border: 1px solid rgba(0, 240, 255, 0.15);
      border-radius: 8px;
      padding: 12px;
    }

    .comodo-number {
      width: 32px;
      height: 32px;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.8rem;
      font-weight: 600;
      color: #00f0ff;
    }

    .comodo-fields {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .comodo-nome {
      flex: 1;
      background: transparent !important;
      border: 1px solid rgba(0, 240, 255, 0.2) !important;
      padding: 8px 12px !important;
    }

    .comodo-dims {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .comodo-dim {
      width: 70px;
      background: transparent !important;
      border: 1px solid rgba(0, 240, 255, 0.2) !important;
      padding: 8px !important;
      text-align: center;
    }

    .dim-separator, .dim-unit {
      color: #5a6b7a;
      font-size: 0.9rem;
    }

    .comodo-area {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.8rem;
      color: #05ffa1;
      min-width: 60px;
      text-align: right;
    }

    .btn-remove {
      width: 32px;
      height: 32px;
      background: rgba(255, 42, 109, 0.1);
      border: 1px solid rgba(255, 42, 109, 0.3);
      border-radius: 4px;
      color: #ff2a6d;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 42, 109, 0.2);
        box-shadow: 0 0 15px rgba(255, 42, 109, 0.3);
      }
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #5a6b7a;
    }

    .empty-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 16px;
      opacity: 0.3;
    }

    .empty-state p {
      margin-bottom: 20px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .btn {
      padding: 14px 28px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-icon {
      margin-right: 8px;
    }

    .validacao-result {
      margin-top: 24px;
      border-radius: 8px;
      overflow: hidden;
    }

    .result-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.1em;

      &.success {
        background: rgba(5, 255, 161, 0.15);
        color: #05ffa1;
        border-bottom: 1px solid rgba(5, 255, 161, 0.3);
      }

      &.error {
        background: rgba(255, 42, 109, 0.15);
        color: #ff2a6d;
        border-bottom: 1px solid rgba(255, 42, 109, 0.3);
      }
    }

    .result-icon {
      font-size: 1.2rem;
    }

    .result-messages {
      list-style: none;
      padding: 16px;
      background: rgba(17, 24, 39, 0.8);

      li {
        padding: 8px 0;
        color: #8fa3b0;
        border-bottom: 1px solid rgba(0, 240, 255, 0.1);

        &:last-child {
          border-bottom: none;
        }

        &.success {
          color: #05ffa1;
        }
      }
    }

    .gerador-preview {
      position: sticky;
      top: 100px;
    }

    .preview-card {
      background: rgba(13, 20, 33, 0.8);
      border: 1px solid rgba(0, 240, 255, 0.2);
      border-radius: 12px;
      padding: 24px;
    }

    .blueprint-preview {
      background: rgba(10, 14, 23, 0.9);
      border: 1px solid rgba(0, 240, 255, 0.2);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      min-height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .bp-container {
      background: rgba(0, 240, 255, 0.03);
      border: 1px solid rgba(0, 240, 255, 0.3);
      position: relative;
    }

    .bp-room {
      position: absolute;
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid rgba(0, 240, 255, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4px;
      min-width: 40px;
      min-height: 30px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 240, 255, 0.25);
      }

      &.has-position {
        border-color: #05ffa1;
        background: rgba(5, 255, 161, 0.1);
      }
    }

    .bp-room-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.5rem;
      color: #00f0ff;
      text-transform: uppercase;
    }

    .bp-room-area {
      font-size: 0.5rem;
      color: #8fa3b0;
    }

    .preview-info h4 {
      font-size: 0.75rem;
      color: #5a6b7a;
      margin-bottom: 12px;
      letter-spacing: 0.1em;
    }

    .legend-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .legend-item {
      display: grid;
      grid-template-columns: 24px 1fr 80px 60px;
      gap: 8px;
      align-items: center;
      font-size: 0.8rem;
      padding: 6px 10px;
      background: rgba(17, 24, 39, 0.5);
      border-radius: 4px;
    }

    .legend-num {
      width: 20px;
      height: 20px;
      background: rgba(0, 240, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      color: #00f0ff;
    }

    .legend-name {
      color: #e8f4f8;
    }

    .legend-dim {
      color: #8fa3b0;
      text-align: right;
    }

    .legend-area {
      color: #05ffa1;
      text-align: right;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.75rem;
    }

    @media (max-width: 1100px) {
      .gerador-content {
        grid-template-columns: 1fr;
      }

      .gerador-preview {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .comodo-fields {
        flex-direction: column;
        align-items: stretch;
      }

      .comodo-area {
        text-align: left;
      }
    }
  `]
})
export class GeradorComponent implements OnInit {
  planta: PlantaRequest = {
    nome: '',
    larguraTotal: 600,
    comprimentoTotal: 700,
    anoConstrucao: 2026,
    comodos: []
  };

  validacao: ValidacaoResult | null = null;
  loading = false;
  previewSize = 300;
  roomPositions: { left: number; top: number }[] = [];

  get areaTotal(): number {
    return (this.planta.larguraTotal * this.planta.comprimentoTotal) / 10000;
  }

  get areaConstruida(): number {
    return this.planta.comodos.reduce((sum, c) => sum + (c.largura * c.comprimento) / 10000, 0);
  }

  get areaRestante(): number {
    return 50 - this.areaConstruida;
  }

  constructor(
    private plantaService: PlantaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.adicionarComodo();
  }

  adicionarComodo() {
    this.planta.comodos.push({
      nome: '',
      largura: 200,
      comprimento: 200
    });
    this.calcularPosicoes();
  }

  removerComodo(index: number) {
    this.planta.comodos.splice(index, 1);
    this.calcularPosicoes();
  }

  getComodoArea(comodo: Comodo): number {
    return (comodo.largura * comodo.comprimento) / 10000;
  }

  onDimensionsChange() {
    this.calcularPosicoes();
  }

  calcularPosicoes() {
    this.roomPositions = [];
    let x = 0;
    let y = 0;
    let maxYInRow = 0;

    for (const comodo of this.planta.comodos) {
      const posLeft = (x / this.planta.larguraTotal) * 100;
      const posTop = (y / this.planta.comprimentoTotal) * 100;

      this.roomPositions.push({ left: posLeft, top: posTop });

      x += comodo.largura;
      maxYInRow = Math.max(maxYInRow, comodo.comprimento);

      if (x >= this.planta.larguraTotal) {
        x = 0;
        y += maxYInRow;
        maxYInRow = 0;
      }
    }
  }

  getRoomPosition(index: number): { left: number; top: number } {
    return this.roomPositions[index] || { left: 0, top: 0 };
  }

  validarPlanta() {
    this.loading = true;
    this.plantaService.validarPlanta(this.planta).subscribe({
      next: (result) => {
        this.validacao = result;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  gerarAutomatica() {
    this.loading = true;
    this.plantaService.gerarPlantaAutomatica(this.planta).subscribe({
      next: (planta) => {
        this.router.navigate(['/planta', planta.id]);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  criarPlanta() {
    this.loading = true;
    this.plantaService.criarPlanta(this.planta).subscribe({
      next: (planta) => {
        this.router.navigate(['/planta', planta.id]);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}