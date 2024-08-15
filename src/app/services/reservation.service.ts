import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { apiUrl } from '../constant/constantes';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl = 'reservation';

  constructor(private http: HttpClient) { }

  // Méthode pour ajouter une reservation
  addReservation(reservation: any, images: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('reservation', JSON.stringify(reservation));
  
    if(images){
  
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i], images[i].name);
      }
      console.log("service formData : " , images);
    }else{
      console.log("image non pris comme tableau ou vide");

    }
  
    return this.http.post<any>(`${apiUrl}/${this.baseUrl}/addReservation`, formData);
  }

  //Modifier ue reservation
  updateReservation(reservation: Reservation, images: File[]): Observable<any> {
    const formData = new FormData();
    
    // Ajouter les données de la reservation au FormData
    formData.append('reservation', JSON.stringify(reservation));
    
    // Ajouter les fichiers d'images au FormData
    images.forEach((image, index) => {
      formData.append('images', image, image.name);
    });

    // Envoye la requête PUT
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${reservation.idReservation}`, formData, {

    });
  }



   // lisyte des voiture
   getAllReservation(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllReservation`);
  }


     // Méthode pour supprimer une reservation
     deleteReservation(id: string): Observable<HttpResponse<void>> {
      return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
        .pipe(
          tap((response: HttpResponse<void>) => {
            if (response.status === 200 || response.status === 201 || response.status === 202) {
              console.log('Reservation supprimé avec succès.');
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
        return throwError('Une erreur est survenue, veuillez réessayer plus tard.');
      }

}
