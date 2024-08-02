import { Injectable } from '@angular/core';
import { TypeReservoir } from '../models/TypeReservoir';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import {  Subject, tap } from 'rxjs';
import { apiUrl } from '../constant/constantes';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservoirService {

  private baseUrl = 'typeReservoire';
  
  private role:TypeReservoir|undefined;



  constructor(private http: HttpClient) { }


  //Creer typeReservoire
  createTypeReservoire(typeReservoire: TypeReservoir) {
    return this.http.post(`${apiUrl}/${this.baseUrl}/addTypeReservoir`, typeReservoire);
  }

  // Modifier  typeReservoire
  updateTypeReservoire(typeReservoire: TypeReservoir): Observable<any> {
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${typeReservoire.idTypeReservoir}`, typeReservoire);
  }
    
  

  getAllTypeReservoir(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllTypeReservoir`);
  }

  
  
   // Méthode pour supprimer type reservoir
   deleteTypeReservoire(id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<void>) => {
          if (response.status === 200 || response.status === 201 || response.status === 202) {
            console.log('type reservoir supprimé avec succès.');
          } else {
            console.log('Statut de la réponse:', response.status);
          }
        }),
        catchError(this.handleError)
      );
  }

    private handleError(error: HttpErrorResponse) {
      console.error('Une erreur s\'est produite:', error);
      if (error.error instanceof ErrorEvent) {
        console.error('Erreur côté client:', error.error.message);
      } else {
        console.error(`Code d'erreur du backend: ${error.status}, Message: ${error.message}`);
      }
      return throwError('Une erreur est survenue; veuillez réessayer plus tard.');
    }

 
}