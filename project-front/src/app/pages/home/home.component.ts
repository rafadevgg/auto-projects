import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlantaService, PlantaRequest } from '../../services/planta.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <section class="hero">
        <div class="hero-background">
          <div class="grid-lines"></div>
          <div class="glow-orb orb-1"></div>
          <div class="glow-orb orb-2"></div>
        </div>
        
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">◈</span>
            <span>Nova Geração de Habitações</span>
          </div>
          
          <h1 class="hero-title">
            <span class="title-line">Arquite<span class="highlight">ture</span></span>
            <span class="title-line">do <span class="highlight-alt">Futuro</span></span>
          </h1>
          
          <p class="hero-subtitle">
            Transforme suas ideias em plantas habitacionais de interesse social. 
            Gere automaticamente projetos otimizados dentro dos limitesHIS com tecnologia de ponta.
          </p>
          
          <div class="hero-actions">
            <a routerLink="/gerador" class="btn btn-primary btn-lg">
              <span class="btn-icon">⚡</span>
              Iniciar Projeto
            </a>
            <a routerLink="/plantas" class="btn btn-secondary btn-lg">
              <span class="btn-icon">⊞</span>
              Ver Plantas
            </a>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-value">50m²</span>
              <span class="stat-label">Área Máxima HIS</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">4</span>
              <span class="stat-label">Ambientes Mínimos</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">PDF</span>
              <span class="stat-label">Exportação Automática</span>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="blueprint-wrapper">
            <div class="blueprint-frame">
              <div class="blueprint-grid"></div>
              <div class="blueprint-rooms">
                <div class="room room-1">
                  <span class="room-label">Sala/Estar</span>
                  <span class="room-dim">3.00 x 3.50</span>
                </div>
                <div class="room room-2">
                  <span class="room-label">Cozinha</span>
                  <span class="room-dim">2.00 x 2.50</span>
                </div>
                <div class="room room-3">
                  <span class="room-label">Dormitório</span>
                  <span class="room-dim">2.80 x 3.00</span>
                </div>
                <div class="room room-4">
                  <span class="room-label">Banheiro</span>
                  <span class="room-dim">2.00 x 1.50</span>
                </div>
              </div>
              <div class="blueprint-dims">
                <span class="dim-h">6.00m</span>
                <span class="dim-v">7.00m</span>
              </div>
            </div>
            <div class="blueprint-glow"></div>
          </div>
        </div>
      </section>
      
      <section class="features">
        <h2 class="section-title">
          <span class="title-accent">//</span> Recursos <span class="highlight">Inteligentes</span>
        </h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <span>◈</span>
            </div>
            <h3>Geração Automática</h3>
            <p>Our algorithm automatically arranges rooms to maximize space utilization while maintaining accessibility standards.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <span>⚡</span>
            </div>
            <h3>Validação HIS</h3>
            <p>Every project is validated against official HIS (Habitação de Interesse Social) requirements automatically.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <span>⊞</span>
            </div>
            <h3>Exportação PDF</h3>
            <p>Generate technical blueprints in PDF format ready for construction and analysis.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <span>⚛</span>
            </div>
            <h3>Modelos Prontos</h3>
            <p>Choose from pre-configured house models optimized for different family sizes.</p>
          </div>
        </div>
      </section>
      
      <section class="cta">
        <div class="cta-content">
          <h2>Pronto para criar sua <span class="highlight">casa dos sonhos</span>?</h2>
          <p>Comece agora mesmo a planejar sua abittação de interesse social com tecnologia de última geração.</p>
          <a routerLink="/gerador" class="btn btn-success btn-lg">
            <span class="btn-icon">⚡</span>
            Criar Primeiro Projeto
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      min-height: 70vh;
      position: relative;
      padding: 40px 0;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .grid-lines {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: grid-move 20s linear infinite;
    }

    @keyframes grid-move {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
    }

    .glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
    }

    .orb-1 {
      width: 400px;
      height: 400px;
      background: #00f0ff;
      top: -100px;
      right: 10%;
      animation: float 8s ease-in-out infinite;
    }

    .orb-2 {
      width: 300px;
      height: 300px;
      background: #b829f8;
      bottom: -50px;
      left: 10%;
      animation: float 10s ease-in-out infinite reverse;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(30px, -30px); }
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 20px;
      background: rgba(0, 240, 255, 0.08);
      border: 1px solid rgba(0, 240, 255, 0.3);
      border-radius: 30px;
      margin-bottom: 30px;
      animation: fade-in-up 0.8s ease-out;
    }

    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .badge-icon {
      color: #00f0ff;
      font-size: 1rem;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .hero-badge span:last-child {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #00f0ff;
    }

    .hero-title {
      font-size: 4rem;
      line-height: 1.1;
      margin-bottom: 30px;
    }

    .title-line {
      display: block;
      animation: fade-in-up 0.8s ease-out 0.2s both;
    }

    .title-line:last-child {
      animation-delay: 0.4s;
    }

    .highlight {
      color: #00f0ff;
      text-shadow: 0 0 30px rgba(0, 240, 255, 0.5);
    }

    .highlight-alt {
      color: #b829f8;
      text-shadow: 0 0 30px rgba(184, 41, 248, 0.5);
    }

    .hero-subtitle {
      font-size: 1.2rem;
      color: #8fa3b0;
      margin-bottom: 40px;
      max-width: 500px;
      animation: fade-in-up 0.8s ease-out 0.6s both;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      margin-bottom: 50px;
      animation: fade-in-up 0.8s ease-out 0.8s both;
    }

    .btn-lg {
      padding: 16px 32px;
      font-size: 0.9rem;
    }

    .btn-icon {
      font-size: 1.1rem;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: 30px;
      animation: fade-in-up 0.8s ease-out 1s both;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #00f0ff;
      text-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
    }

    .stat-label {
      font-size: 0.75rem;
      color: #5a6b7a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: linear-gradient(180deg, transparent, rgba(0, 240, 255, 0.3), transparent);
    }

    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .blueprint-wrapper {
      position: relative;
    }

    .blueprint-frame {
      width: 400px;
      height: 350px;
      background: rgba(10, 14, 23, 0.9);
      border: 2px solid rgba(0, 240, 255, 0.4);
      border-radius: 8px;
      padding: 30px;
      position: relative;
      overflow: hidden;
    }

    .blueprint-grid {
      position: absolute;
      top: 30px;
      left: 30px;
      right: 30px;
      bottom: 30px;
      background-image: 
        linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px);
      background-size: 20px 20px;
    }

    .blueprint-rooms {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      height: 100%;
      position: relative;
      z-index: 1;
    }

    .room {
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.3);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(0, 240, 255, 0.2);
        border-color: #00f0ff;
        transform: scale(1.02);
      }
    }

    .room-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: #00f0ff;
      text-transform: uppercase;
    }

    .room-dim {
      font-size: 0.7rem;
      color: #8fa3b0;
      margin-top: 4px;
    }

    .blueprint-dims {
      position: absolute;
      bottom: 10px;
      right: 10px;
      display: flex;
      gap: 20px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.7rem;
      color: rgba(0, 240, 255, 0.6);
    }

    .blueprint-glow {
      position: absolute;
      top: -20px;
      left: -20px;
      right: -20px;
      bottom: -20px;
      background: radial-gradient(ellipse, rgba(0, 240, 255, 0.2) 0%, transparent 70%);
      pointer-events: none;
      animation: glow-pulse 3s ease-in-out infinite;
    }

    @keyframes glow-pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    .features {
      padding: 80px 0;
    }

    .section-title {
      font-size: 2rem;
      text-align: center;
      margin-bottom: 50px;
    }

    .title-accent {
      color: #b829f8;
      margin-right: 12px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .feature-card {
      background: rgba(13, 20, 33, 0.8);
      border: 1px solid rgba(0, 240, 255, 0.2);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #00f0ff, #b829f8);
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      &:hover {
        border-color: rgba(0, 240, 255, 0.4);
        transform: translateY(-5px);

        &::before {
          transform: scaleX(1);
        }
      }
    }

    .feature-icon {
      font-size: 2.5rem;
      color: #00f0ff;
      margin-bottom: 20px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 240, 255, 0.1);
      border-radius: 50%;
      width: 60px;
      margin: 0 auto 20px;
    }

    .feature-card h3 {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      color: #e8f4f8;
      margin-bottom: 12px;
      letter-spacing: 0.1em;
    }

    .feature-card p {
      font-size: 0.9rem;
      color: #8fa3b0;
      line-height: 1.6;
    }

    .cta {
      padding: 60px 40px;
      text-align: center;
      position: relative;
      margin-top: -60px;
      background: rgba(13, 20, 33, 0.8);
      border-radius: 16px 16px 0 0;
      border-top: 1px solid rgba(0, 240, 255, 0.15);
      border-left: 1px solid rgba(0, 240, 255, 0.15);
      border-right: 1px solid rgba(0, 240, 255, 0.15);
    }

    .cta::before {
      display: none;
    }

    .cta-content h2 {
      font-size: 1.75rem;
      margin-bottom: 16px;
    }

    .cta-content p {
      font-size: 1.1rem;
      color: #8fa3b0;
      margin-bottom: 30px;
    }

    @media (max-width: 1100px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .hero-content {
        order: 1;
      }

      .hero-visual {
        order: 2;
      }

      .hero-subtitle {
        margin: 0 auto 40px;
      }

      .hero-actions {
        justify-content: center;
      }

      .hero-stats {
        justify-content: center;
      }

      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .blueprint-frame {
        width: 300px;
        height: 260px;
        padding: 20px;
      }

      .stat-divider {
        display: none;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  modelos: PlantaRequest[] = [];
  
  constructor(private plantaService: PlantaService) {}
  
  ngOnInit() {
    this.plantaService.getModelosBasicos().subscribe({
      next: (modelos) => this.modelos = modelos,
      error: () => {}
    });
  }
}