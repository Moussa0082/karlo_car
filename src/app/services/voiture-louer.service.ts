import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VoitureLouer } from '../models/VoitureLouer';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { apiUrl } from '../constant/constantes';

@Injectable({
  providedIn: 'root'
})
export class VoitureLouerService {

  private baseUrl = 'voitureLouer';

  constructor(private http: HttpClient) { }

  // Méthode pour ajouter une voiture à louer
  addVoitureLouer(voiture: VoitureLouer, images: File[]): Observable<any> {
    const formData = new FormData();
    
    // Ajouter les données de la voiture au FormData
    formData.append('voiture', JSON.stringify(voiture));

    // Ajouter les fichiers d'images au FormData
    images.forEach((image, index) => {
      formData.append('images', image, image.name);
    });

    // Envoyer la requête POST
    return this.http.post(`${apiUrl}/${this.baseUrl}/addVoiture`, formData, {
      headers: new HttpHeaders({
        // Vous pouvez ajouter des en-têtes si nécessaire
      })
    });
  }
  

  
  //Modifier voiture à louer
  updateVoitureLouer(voiture: VoitureLouer, images: File[]): Observable<any> {
    const formData = new FormData();
    
    // Ajouter les données de la voiture au FormData
    formData.append('voiture', JSON.stringify(voiture));
    
    // Ajouter les fichiers d'images au FormData
    images.forEach((image, index) => {
      formData.append('images', image, image.name);
    });

    // Envoye la requête PUT
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${voiture.idVoiture}`, formData, {
      headers: new HttpHeaders({
        // Vous pouvez ajouter des en-têtes si nécessaire
      })
    });
  }

   // Modifier vue voiture
   updateViews(voiture: VoitureLouer): Observable<any> {
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${voiture.idVoiture}`, voiture);
  }

   // lisyte des voiture
   getAllVoitures(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllVoiture`);
  }


     // Méthode pour supprimer une voiture à louer
     deleteVoiture(id: string): Observable<HttpResponse<void>> {
      return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
        .pipe(
          tap((response: HttpResponse<void>) => {
            if (response.status === 200 || response.status === 201 || response.status === 202) {
              console.log('Voiture à  louer supprimé avec succès.');
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
