import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantaService, PlantaResponse } from '../../services/planta.service';

@Component({
  selector: 'app-planta-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detalhe-container" *ngIf="planta">
      <div class="detalhe-header">
        <a routerLink="/plantas" class="btn-back">
          <span>←</span> Voltar
        </a>
        <div class="header-info">
          <h1>{{ planta.nome }}</h1>
          <div class="header-meta">
            <span class="meta-item">
              <span class="meta-icon">◈</span>
              {{ planta.larguraTotal / 100 }}m × {{ planta.comprimentoTotal / 100 }}m
            </span>
            <span class="meta-item">
              <span class="meta-icon">◈</span>
              {{ planta.anoConstrucao }}
            </span>
            <span class="meta-badge" [class.valid]="planta.valida" [class.invalid]="!planta.valida">
              {{ planta.valida ? 'Válida HIS' : 'Inválida' }}
            </span>
          </div>
        </div>
        <button class="btn btn-primary" (click)="downloadPdf()" [disabled]="loadingPdf">
          <span class="btn-icon">↓</span>
          {{ loadingPdf ? 'Gerando...' : 'Baixar PDF' }}
        </button>
      </div>

      <div class="detalhe-content">
        <div class="blueprint-section">
          <div class="blueprint-card">
            <div class="card-header">
              <span class="card-icon">◈</span>
              <h2>Planta{{ planta.id ? ' #' + planta.id : '' }}</h2>
            </div>
            
            <div class="blueprint-view">
              <div 
                class="bp-terreno" 
                [style.width.px]="350" 
                [style.height.px]="350 * (planta.comprimentoTotal / planta.larguraTotal)"
              >
                <div class="bp-label-top">{{ planta.larguraTotal / 100 }}m</div>
                <div class="bp-label-left">{{ planta.comprimentoTotal / 100 }}m</div>
                
                <div 
                  class="bp-comodo" 
                  *ngFor="let comodo of planta.comodos; let i = index"
                  [style.width.px]="(comodo.largura / planta.larguraTotal) * 350"
                  [style.height.px]="(comodo.comprimento / planta.comprimentoTotal) * (350 * (planta.comprimentoTotal / planta.larguraTotal))"
                  [style.left.px]="getComodoPosition(i).left"
                  [style.top.px]="getComodoPosition(i).top"
                >
                  <span class="comodo-nome">{{ comodo.nome }}</span>
                  <span class="comodo-dim">{{ comodo.largura }} × {{ comodo.comprimento }}</span>
                  <span class="comodo-area">{{ getComodoArea(comodo).toFixed(2) }}m²</span>
                </div>
              </div>
            </div>

            <div class="area-summary">
              <div class="area-box">
                <span class="area-label">Área Total</span>
                <span class="area-value">{{ planta.areaTotal.toFixed(2) }} m²</span>
              </div>
              <div class="area-box">
                <span class="area-label">Área Construída</span>
                <span class="area-value" [class.danger]="planta.areaConstruida > 50">{{ planta.areaConstruida.toFixed(2) }} m²</span>
              </div>
              <div class="area-box">
                <span class="area-label">Área Livre</span>
                <span class="area-value" [class.success]="planta.areaTotal - planta.areaConstruida > 0">
                  {{ (planta.areaTotal - planta.areaConstruida).toFixed(2) }} m²
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="comodos-section">
          <div class="comodos-card">
            <div class="card-header">
              <span class="card-icon">⊞</span>
              <h2>Ambientes ({{ planta.comodos.length }})</h2>
            </div>

            <div class="comodos-list">
              <div class="comodo-row" *ngFor="let comodo of planta.comodos; let i = index">
                <div class="comodo-num">{{ i + 1 }}</div>
                <div class="comodo-info">
                  <span class="comodo-nome">{{ comodo.nome }}</span>
                  <span class="comodo-dims">{{ comodo.largura }} × {{ comodo.comprimento }} cm</span>
                </div>
                <div class="comodo-area">
                  <span class="area-value">{{ getComodoArea(comodo).toFixed(2) }}</span>
                  <span class="area-unit">m²</span>
                </div>
              </div>
            </div>

            <div class="comodos-total">
              <span>Total Construído</span>
              <span class="total-value">{{ planta.areaConstruida.toFixed(2) }} m²</span>
            </div>
          </div>

          <div class="validacao-card" *ngIf="planta.mensagemValidacao">
            <div class="card-header">
              <span class="card-icon">✓</span>
              <h2>Validação HIS</h2>
            </div>
            <div class="validacao-content" [class.success]="planta.valida" [class.error]="!planta.valida">
              <span class="validacao-icon">{{ planta.valida ? '✓' : '✗' }}</span>
              <p>{{ planta.mensagemValidacao }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detalhe-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .detalhe-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(0, 240, 255, 0.15);
    }

    .btn-back {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #8fa3b0;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s ease;

      &:hover {
        color: #00f0ff;
      }

      span {
        font-size: 1.2rem;
      }
    }

    .header-info {
      flex: 1;
      margin-left: 24px;
    }

    .header-info h1 {
      font-size: 1.5rem;
      margin-bottom: 8px;
    }

    .header-meta {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #8fa3b0;
      font-size: 0.85rem;
    }

    .meta-icon {
      color: #00f0ff;
      font-size: 0.6rem;
    }

    .meta-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-family: 'Orbitron', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.1em;

      &.valid {
        background: rgba(5, 255, 161, 0.15);
        color: #05ffa1;
        border: 1px solid rgba(5, 255, 161, 0.3);
      }

      &.invalid {
        background: rgba(255, 42, 109, 0.15);
        color: #ff2a6d;
        border: 1px solid rgba(255, 42, 109, 0.3);
      }
    }

    .detalhe-content {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 24px;
    }

    .blueprint-card, .comodos-card, .validacao-card {
      background: rgba(13, 20, 33, 0.8);
      border: 1px solid rgba(0, 240, 255, 0.2);
      border-radius: 12px;
      padding: 24px;
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

    .blueprint-view {
      background: rgba(10, 14, 23, 0.9);
      border: 1px solid rgba(0, 240, 255, 0.2);
      border-radius: 8px;
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .bp-terreno {
      background: rgba(0, 240, 255, 0.05);
      border: 2px solid rgba(0, 240, 255, 0.4);
      position: relative;
    }

    .bp-label-top {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Orbitron', sans-serif;
      font-size: 0.75rem;
      color: #00f0ff;
    }

    .bp-label-left {
      position: absolute;
      left: -30px;
      top: 50%;
      transform: translateY(-50%) rotate(-90deg);
      font-family: 'Orbitron', sans-serif;
      font-size: 0.75rem;
      color: #00f0ff;
    }

    .bp-comodo {
      position: absolute;
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid rgba(0, 240, 255, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 8px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 240, 255, 0.25);
      }
    }

    .comodo-nome {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      color: #00f0ff;
      text-transform: uppercase;
    }

    .comodo-dim {
      font-size: 0.65rem;
      color: #8fa3b0;
      margin-top: 2px;
    }

    .comodo-area {
      font-size: 0.7rem;
      color: #05ffa1;
      margin-top: 4px;
    }

    .area-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .area-box {
      background: rgba(0, 240, 255, 0.05);
      border: 1px solid rgba(0, 240, 255, 0.15);
      border-radius: 8px;
      padding: 16px;
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

      &.danger {
        color: #ff2a6d;
      }

      &.success {
        color: #05ffa1;
      }
    }

    .comodos-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
    }

    .comodo-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(17, 24, 39, 0.5);
      border-radius: 8px;
    }

    .comodo-num {
      width: 28px;
      height: 28px;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.75rem;
      color: #00f0ff;
    }

    .comodo-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .comodo-nome {
      font-weight: 600;
      color: #e8f4f8;
    }

    .comodo-dims {
      font-size: 0.8rem;
      color: #8fa3b0;
    }

    .comodo-area {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .area-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: #00f0ff;
    }

    .area-unit {
      font-size: 0.75rem;
      color: #8fa3b0;
    }

    .comodos-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 240, 255, 0.15);
      font-weight: 600;
    }

    .total-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2rem;
      color: #05ffa1;
    }

    .validacao-card {
      margin-top: 24px;
    }

    .validacao-content {
      padding: 16px;
      border-radius: 8px;
      display: flex;
      align-items: flex-start;
      gap: 12px;

      &.success {
        background: rgba(5, 255, 161, 0.1);
        border: 1px solid rgba(5, 255, 161, 0.3);
        color: #05ffa1;
      }

      &.error {
        background: rgba(255, 42, 109, 0.1);
        border: 1px solid rgba(255, 42, 109, 0.3);
        color: #ff2a6d;
      }
    }

    .validacao-icon {
      font-size: 1.2rem;
    }

    .validacao-content p {
      font-size: 0.9rem;
      line-height: 1.5;
    }

    @media (max-width: 1000px) {
      .detalhe-content {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .detalhe-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .header-info {
        margin-left: 0;
      }

      .header-meta {
        justify-content: center;
        flex-wrap: wrap;
      }
    }
  `]
})
export class PlantaDetalheComponent implements OnInit {
  planta: PlantaResponse | null = null;
  loadingPdf = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plantaService: PlantaService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarPlanta(+id);
    }
  }

  carregarPlanta(id: number) {
    this.plantaService.buscarPlanta(id).subscribe({
      next: (planta) => this.planta = planta,
      error: () => this.router.navigate(['/plantas'])
    });
  }

  getComodoArea(comodo: any): number {
    return (comodo.largura * comodo.comprimento) / 10000;
  }

  getComodoPosition(index: number): { left: number; top: number } {
    if (!this.planta) return { left: 0, top: 0 };
    
    const escala = 350 / this.planta.larguraTotal;
    let x = 0;
    let y = 0;
    let maxYInRow = 0;

    for (let i = 0; i <= index; i++) {
      if (i < index) {
        const comodo = this.planta.comodos[i];
        x += comodo.largura;
        maxYInRow = Math.max(maxYInRow, comodo.comprimento);
        if (x >= this.planta.larguraTotal) {
          x = 0;
          y += maxYInRow;
          maxYInRow = 0;
        }
      }
    }

    return { left: x * escala, top: y * escala };
  }

  downloadPdf() {
    if (!this.planta || !this.planta.id) return;
    
    const plantaId = this.planta.id;
    this.loadingPdf = true;
    this.plantaService.downloadPdf(plantaId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `planta-his-${plantaId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.loadingPdf = false;
      },
      error: () => {
        this.loadingPdf = false;
      }
    });
  }
}