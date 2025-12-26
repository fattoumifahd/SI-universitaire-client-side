// src/app/components/navbar/navbar.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <span class="logo">🎓</span>
          <span class="brand-text">Student MS</span>
        </div>
        <div class="nav-links">
          <a routerLink="/students" routerLinkActive="active" class="nav-link">
            Students
          </a>
          <a routerLink="/register" routerLinkActive="active" class="nav-link">
            Register
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 24px;
      font-weight: 700;
      color: #667eea;
    }

    .logo {
      font-size: 28px;
    }

    .brand-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      gap: 20px;
    }

    .nav-link {
      text-decoration: none;
      color: #555;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      background-color: #f0f0f0;
      color: #667eea;
    }

    .nav-link.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 15px;
      }

      .nav-links {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class NavbarComponent {}
