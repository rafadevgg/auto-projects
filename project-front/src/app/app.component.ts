import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="navbar-brand">
          <div class="logo">
            <span class="logo-icon">◈</span>
            <span class="logo-text">HABITA<span class="highlight">40</span></span>
          </div>
          <span class="logo-subtitle">Arquitetura Inteligente HIS</span>
        </div>
        <div class="navbar-links">
          <a routerLink="/home" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">⌂</span>
            Início
          </a>
          <a routerLink="/gerador" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">⚡</span>
            Gerador
          </a>
          <a routerLink="/plantas" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">⊞</span>
            Plantas
          </a>
        </div>
        <div class="navbar-status">
          <span class="status-indicator"></span>
          <span class="status-text">Online</span>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="footer">
        <div class="footer-content">
          <span class="footer-brand">HABITA40</span>
          <span class="footer-separator">|</span>
          <span class="footer-text">Sistema de Geração de Plantas Habitacionais HIS</span>
          <span class="footer-version">v1.0.0</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 40px;
      background: rgba(13, 20, 33, 0.95);
      border-bottom: 1px solid rgba(0, 240, 255, 0.2);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(10px);
      
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, #00f0ff, #b829f8, transparent);
      }
    }

    .navbar-brand {
      display: flex;
      flex-direction: column;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      font-size: 2rem;
      color: #00f0ff;
      animation: pulse-glow 2s ease-in-out infinite;
    }

    @keyframes pulse-glow {
      0%, 100% {
        text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
      }
      50% {
        text-shadow: 0 0 20px #00f0ff, 0 0 40px #00f0ff, 0 0 60px #00f0ff;
      }
    }

    .logo-text {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #e8f4f8;
      
      .highlight {
        color: #00f0ff;
        text-shadow: 0 0 10px #00f0ff;
      }
    }

    .logo-subtitle {
      font-size: 0.7rem;
      color: #5a6b7a;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .navbar-links {
      display: flex;
      gap: 8px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      color: #8fa3b0;
      text-decoration: none;
      text-transform: uppercase;
      border: 1px solid transparent;
      border-radius: 4px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.1), transparent);
        transition: left 0.5s ease;
      }

      &:hover::before {
        left: 100%;
      }

      &:hover, &.active {
        color: #00f0ff;
        border-color: rgba(0, 240, 255, 0.3);
        background: rgba(0, 240, 255, 0.05);
        text-shadow: 0 0 10px #00f0ff;
      }

      &.active {
        border-color: #00f0ff;
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
      }
    }

    .nav-icon {
      font-size: 1rem;
    }

    .navbar-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(0, 240, 255, 0.05);
      border: 1px solid rgba(0, 240, 255, 0.2);
      border-radius: 20px;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #05ffa1;
      box-shadow: 0 0 10px #05ffa1;
      animation: blink 1.5s ease-in-out infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .status-text {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      color: #05ffa1;
      text-transform: uppercase;
    }

    .main-content {
      flex: 1;
      padding: 40px;
    }

    .footer {
      padding: 20px 40px;
      background: rgba(13, 20, 33, 0.9);
      border-top: 1px solid rgba(0, 240, 255, 0.1);
    }

    .footer-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      font-size: 0.75rem;
    }

    .footer-brand {
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      color: #00f0ff;
      letter-spacing: 0.1em;
    }

    .footer-separator {
      color: #5a6b7a;
    }

    .footer-text {
      color: #5a6b7a;
      letter-spacing: 0.05em;
    }

    .footer-version {
      color: #5a6b7a;
      font-family: 'Orbitron', sans-serif;
      letter-spacing: 0.1em;
    }

    @media (max-width: 900px) {
      .navbar {
        flex-direction: column;
        gap: 16px;
        padding: 16px 20px;
      }

      .navbar-links {
        flex-wrap: wrap;
        justify-content: center;
      }

      .main-content {
        padding: 20px;
      }
    }
  `]
})
export class AppComponent {}