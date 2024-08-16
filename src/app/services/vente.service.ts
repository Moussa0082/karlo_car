import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { apiUrl } from '../constant/constantes';
import { Vente } from '../models/Vente';

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  private baseUrl = 'vente';

  constructor(private http: HttpClient) { }

  // Méthode pour ajouter une vente
  addVente(vente: any, images: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('vente', JSON.stringify(vente));
  
    if(images){
  
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i], images[i].name);
      }
      console.log("service formData : " , images);
    }else{
      console.log("image non pris comme tableau ou vide");

    }
  
    return this.http.post<any>(`${apiUrl}/${this.baseUrl}/addVente`, formData);
  }

  // Method to get the total sales amount by month
  getTotalSalesByMonth(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${apiUrl}/${this.baseUrl}/totalVenteParMoi`);
  }

    // Method to get the total amount for voiture vendu
    getTotalVoitureVendu(): Observable<number> {
      return this.http.get<number>(`${apiUrl}/${this.baseUrl}/totalVoitureVendu`);
    } 

  //Modifier ue vente
  updateVente(vente: Vente, images: File[]): Observable<any> {
    const formData = new FormData();
    
    // Ajouter les données de la reservation au FormData
    formData.append('vente', JSON.stringify(vente));
    
    // Ajouter les fichiers d'images au FormData
    images.forEach((image, index) => {
      formData.append('images', image, image.name);
    });

    // Envoye la requête PUT
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${vente.idVente}`, formData, {

    });
  }



   // lisyte des voiture
   getAllVente(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllVente`);
  }


     // Méthode pour supprimer une vente
     deleteVente(id: string): Observable<HttpResponse<void>> {
      return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
        .pipe(
          tap((response: HttpResponse<void>) => {
            if (response.status === 200 || response.status === 201 || response.status === 202) {
              console.log('Vente supprimé avec succès.');
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
