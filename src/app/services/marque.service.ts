import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { apiUrl } from '../constant/constantes';
import { Marque } from '../models/Marque';

@Injectable({
  providedIn: 'root'
})
export class MarqueService {

  private baseUrl = 'marque';


  constructor(private http: HttpClient) { }


  createMarque(marque: any, image?: File): Observable<any> {
    const formData = new FormData();
    formData.append('marque', JSON.stringify(marque));
    if (image) formData.append('image', image);
    return this.http.post(`${apiUrl}/${this.baseUrl}/addMarque`, formData);
  }

  updateMarque(id: number, marque: Marque, image?: File) {
    const formData = new FormData();

    formData.append('marque', JSON.stringify(marque));
    if (image) {
      formData.append('image', image);
    }

    return this.http.put<Marque>(`${apiUrl}/${this.baseUrl}/update/${id}`, formData);
   }

   getAllMarque(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllMarque`);
  }

  
  
   // Méthode pour supprimer marque
   deleteMarque(id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<void>) => {
          if (response.status === 200 || response.status === 201 || response.status === 202) {
            // console.log('marque supprimé avec succès.');
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
