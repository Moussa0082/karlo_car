import { Injectable } from '@angular/core';
import { Historique } from '../models/Historique';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { apiUrl } from '../constant/constantes';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {

  private baseUrl = 'historique';
  


  constructor(private http: HttpClient) { }

  getAllHistorique(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllHistorique`);
  }

  deleteHistorique(id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<void>) => {
          if (response.status === 200 || response.status === 201 || response.status === 202) {
            // console.log('historique supprimé avec succès.');
          } else {
            // console.log('Statut de la réponse:', response.status);
          }
        }),
        catchError(this.handleError)
      );
  }

    private handleError(error: HttpErrorResponse) {
      // console.error('Une erreur s\'est produite:', error);
      if (error.error instanceof ErrorEvent) {
        // console.error('Erreur côté client:', error.error.message);
      } else {
        // console.error(`Code d'erreur du backend: ${error.status}, Message: ${error.message}`);
      }
      return throwError('Une erreur est survenue; veuillez réessayer plus tard.');
    }


}
