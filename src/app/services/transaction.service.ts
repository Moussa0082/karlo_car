import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { apiUrl } from '../constant/constantes';
import { Transaction } from '../models/Transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl = 'transaction';  


  constructor(private http: HttpClient) { }

  


  addTransaction(transaction: Transaction) {
    return this.http.post(`${apiUrl}/${this.baseUrl}/addTransaction`, transaction);
  }


   // Modifier une transaction
   updateTransaction(transaction: Transaction): Observable<any> {
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${transaction.idTransaction}`, transaction);
  }
  


  getAllTransactions(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllTransaction`);
  }

   
  
   // Méthode pour supprimer une transaction
   deleteTransaction(id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<void>) => {
          if (response.status === 200 || response.status === 201 || response.status === 202) {
            console.log('Trnsaction supprimé avec succès.');
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
