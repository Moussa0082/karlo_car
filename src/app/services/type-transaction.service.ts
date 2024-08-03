import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import {  Subject, tap } from 'rxjs';
import { apiUrl } from '../constant/constantes';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { TypeTransaction } from '../models/TypeTransaction';
@Injectable({
  providedIn: 'root'
})
export class TypeTransactionService {

 
 
  private baseUrl = 'typeTransaction';


  constructor(private http: HttpClient) { }


  //Creer type transaction
  createTypeTransaction(typeTransaction: TypeTransaction) {
    return this.http.post(`${apiUrl}/${this.baseUrl}/addTypeTransaction`, typeTransaction);
  }

  // Modifier un typeTransaction
  updateTypeTransaction(typeTransaction: TypeTransaction): Observable<any> {
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${typeTransaction.idTypeTransaction}`, typeTransaction);
  }
    
  

  getAllTypeTransaction(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllTypeTransaction`);
  }

  
  
   // Méthode pour supprimer un typeTransaction
   deleteTypeTransaction(id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<void>) => {
          if (response.status === 200 || response.status === 201 || response.status === 202) {
            console.log('type transaction supprimé avec succès.');
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
