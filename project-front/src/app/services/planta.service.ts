import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comodo {
  id?: number;
  nome: string;
  largura: number;
  comprimento: number;
  posicaoX?: number;
  posicaoY?: number;
}

export interface PlantaRequest {
  nome: string;
  larguraTotal: number;
  comprimentoTotal: number;
  anoConstrucao: number;
  comodos: Comodo[];
}

export interface PlantaResponse {
  id: number;
  nome: string;
  larguraTotal: number;
  comprimentoTotal: number;
  anoConstrucao: number;
  areaTotal: number;
  areaConstruida: number;
  comodos: Comodo[];
  valida: boolean;
  mensagemValidacao: string;
  dimencoesPlanta: number[];
}

export interface ValidacaoResult {
  valida: boolean;
  mensagens: string[];
  areaTotal: number;
  areaConstruida: number;
  areaRestante: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlantaService {
  private apiUrl = 'http://localhost:8080/api/plantas';

  constructor(private http: HttpClient) {}

  criarPlanta(planta: PlantaRequest): Observable<PlantaResponse> {
    return this.http.post<PlantaResponse>(`${this.apiUrl}`, planta);
  }

  validarPlanta(planta: PlantaRequest): Observable<ValidacaoResult> {
    return this.http.post<ValidacaoResult>(`${this.apiUrl}/validar`, planta);
  }

  gerarPlantaAutomatica(planta: PlantaRequest): Observable<PlantaResponse> {
    return this.http.post<PlantaResponse>(`${this.apiUrl}/gerar-automatica`, planta);
  }

  listarPlantas(): Observable<PlantaResponse[]> {
    return this.http.get<PlantaResponse[]>(`${this.apiUrl}`);
  }

  buscarPlanta(id: number): Observable<PlantaResponse> {
    return this.http.get<PlantaResponse>(`${this.apiUrl}/${id}`);
  }

  getModelosBasicos(): Observable<PlantaRequest[]> {
    return this.http.get<PlantaRequest[]>(`${this.apiUrl}/modelos-basicos`);
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
  }
}