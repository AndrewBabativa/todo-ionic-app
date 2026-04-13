import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProductApi {
  id: string;
  name: string;
  stock: number;
}

export interface BranchApi {
  id: string;
  name: string;
  products: ProductApi[];
}

export interface FranchiseApi {
  id: string;
  name: string;
  branches: BranchApi[];
}

export interface TopProductApi {
  branchId: string;
  branchName: string;
  productId: string;
  productName: string;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class FranchiseApiService {

  // inject() en lugar de constructor — evita la dependencia circular
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1';

  getAllFranchises(): Observable<FranchiseApi[]> {
    return this.http.get<FranchiseApi[]>(`${this.baseUrl}/franchises`)
      .pipe(catchError(this.handleError));
  }

  createFranchise(name: string): Observable<ApiResponse<FranchiseApi>> {
    return this.http.post<ApiResponse<FranchiseApi>>(
      `${this.baseUrl}/franchises`, { name }
    ).pipe(catchError(this.handleError));
  }

  getTopProducts(franchiseId: string): Observable<ApiResponse<TopProductApi[]>> {
    return this.http.get<ApiResponse<TopProductApi[]>>(
      `${this.baseUrl}/franchises/${franchiseId}/top-products`
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error desconocido';
    if (error.status === 0) message = 'No se puede conectar al servidor. ¿Está corriendo el backend?';
    else if (error.status === 404) message = 'Recurso no encontrado';
    else if (error.status === 400) message = error.error?.message ?? 'Datos inválidos';
    else if (error.status >= 500) message = 'Error interno del servidor';
    return throwError(() => new Error(message));
  }
}