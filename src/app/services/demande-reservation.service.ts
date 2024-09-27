import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DemandeReservation } from '../models/DemandeReservation';
import { apiUrl } from '../constant/constantes';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeReservationService {

  private baseUrl = 'demandeReservation';  


  constructor(private http: HttpClient) { }


  getAllDemandesReservation(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllDemandeReservation`);
  }


     // valider une demande de reservation
     validerDemandeReservation(demandeReservation: DemandeReservation): Observable<any> {
      return this.http.put(`${apiUrl}/${this.baseUrl}/valider`, demandeReservation);
    }

     // annuler une demande de reservation
     annulerDemandeReservation(demandeReservation: DemandeReservation): Observable<any> {
      return this.http.put(`${apiUrl}/${this.baseUrl}/annuler`, demandeReservation);
    }

  // Méthode pour supprimer une demande de reservation
  deleteDemandeReservation(id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<void>) => {
          if (response.status === 200 || response.status === 201 || response.status === 202) {
            // console.log('Demande de reservation supprimé avec succès.');
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
