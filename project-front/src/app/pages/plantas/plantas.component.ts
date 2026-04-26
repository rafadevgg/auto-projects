import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlantaService, PlantaResponse } from '../../services/planta.service';

@Component({
  selector: 'app-plantas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="plantas-container">
      <div class="plantas-header">
        <h1>
          <span class="icon">⊞</span>
          Plantas <span class="highlight">Salvas</span>
        </h1>
        <p class="subtitle">Gerencie suas plantas habitacionaisHIS geradas</p>
        <a routerLink="/gerador" class="btn btn-primary">
          <span class="btn-icon">⚡</span>
          Nova Planta
        </a>
      </div>

      <div class="plantas-grid" *ngIf="plantas.length > 0; else emptyState">
        <div class="planta-card" *ngFor="let planta of plantas" [routerLink]="['/planta', planta.id]">
          <div class="planta-preview">
            <div class="mini-blueprint">
              <div 
                class="mini-room" 
                *ngFor="let comodo of planta.comodos.slice(0, 4); let i = index"
                [style.width.%]="(comodo.largura / planta.larguraTotal) * 100"
                [style.height.%]="(comodo.comprimento / planta.comprimentoTotal) * 100"
              ></div>
            </div>
            <div class="planta-status" [class.valid]="planta.valida" [class.invalid]="!planta.valida">
              <span class="status-dot"></span>
              {{ planta.valida ? 'Válida' : 'Inválida' }}
            </div>
          </div>
          
          <div class="planta-info">
            <h3>{{ planta.nome }}</h3>
            <div class="planta-dims">
              <span>{{ planta.larguraTotal / 100 }}m × {{ planta.comprimentoTotal / 100 }}m</span>
              <span class="separator">|</span>
              <span>{{ planta.anoConstrucao }}</span>
            </div>
            <div class="planta-area">
              <div class="area-item">
                <span class="area-label">Total</span>
                <span class="area-value">{{ planta.areaTotal.toFixed(2) }} m²</span>
              </div>
              <div class="area-item">
                <span class="area-label">Construída</span>
                <span class="area-value" [class.danger]="planta.areaConstruida > 50">{{ planta.areaConstruida.toFixed(2) }} m²</span>
              </div>
            </div>
            <div class="planta-comodos">
              <span class="comodo-count">{{ planta.comodos.length }}</span>
              <span class="comodo-label">ambientes</span>
            </div>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <div class="empty-icon">⊞</div>
          <h2>Nenhuma planta salva</h2>
          <p>Comece criando sua primeira planta habitacionalHIS</p>
          <a routerLink="/gerador" class="btn btn-primary">
            <span class="btn-icon">⚡</span>
            Criar Primeira Planta
          </a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .plantas-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .plantas-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(0, 240, 255, 0.15);
    }

    .plantas-header h1 {
      font-size: 1.75rem;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon {
      color: #00f0ff;
    }

    .subtitle {
      color: #8fa3b0;
      flex: 1;
      margin-left: 24px;
    }

    .plantas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .planta-card {
      background: rgba(13, 20, 33, 0.8);
      border: 1px solid rgba(0, 240, 255, 0.2);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: #00f0ff;
        transform: translateY(-5px);
        box-shadow: 0 10px 40px rgba(0, 240, 255, 0.15);
      }
    }

    .planta-preview {
      height: 180px;
      background: rgba(10, 14, 23, 0.9);
      padding: 20px;
      position: relative;
    }

    .mini-blueprint {
      width: 100%;
      height: 100%;
      background: rgba(0, 240, 255, 0.03);
      border: 1px solid rgba(0, 240, 255, 0.2);
      position: relative;
      overflow: hidden;
    }

    .mini-room {
      position: absolute;
      background: rgba(0, 240, 255, 0.2);
      border: 1px solid rgba(0, 240, 255, 0.4);
    }

    .planta-status {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.65rem;
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

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .planta-info {
      padding: 20px;
    }

    .planta-info h3 {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      color: #e8f4f8;
      margin-bottom: 8px;
      letter-spacing: 0.05em;
    }

    .planta-dims {
      font-size: 0.8rem;
      color: #8fa3b0;
      margin-bottom: 16px;
    }

    .separator {
      margin: 0 8px;
      opacity: 0.5;
    }

    .planta-area {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .area-item {
      flex: 1;
    }

    .area-label {
      display: block;
      font-size: 0.65rem;
      color: #5a6b7a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 2px;
    }

    .area-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: #00f0ff;

      &.danger {
        color: #ff2a6d;
      }
    }

    .planta-comodos {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid rgba(0, 240, 255, 0.1);
    }

    .comodo-count {
      width: 28px;
      height: 28px;
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

    .comodo-label {
      font-size: 0.8rem;
      color: #8fa3b0;
    }

    .empty-state {
      text-align: center;
      padding: 80px 40px;
      background: rgba(13, 20, 33, 0.5);
      border: 1px dashed rgba(0, 240, 255, 0.2);
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 4rem;
      color: #5a6b7a;
      opacity: 0.3;
      margin-bottom: 24px;
    }

    .empty-state h2 {
      font-size: 1.5rem;
      color: #e8f4f8;
      margin-bottom: 12px;
    }

    .empty-state p {
      color: #8fa3b0;
      margin-bottom: 30px;
    }

    @media (max-width: 768px) {
      .plantas-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .subtitle {
        margin-left: 0;
      }
    }
  `]
})
export class PlantasComponent implements OnInit {
  plantas: PlantaResponse[] = [];

  constructor(private plantaService: PlantaService) {}

  ngOnInit() {
    this.carregarPlantas();
  }

  carregarPlantas() {
    this.plantaService.listarPlantas().subscribe({
      next: (plantas) => this.plantas = plantas,
      error: () => this.plantas = []
    });
  }
}