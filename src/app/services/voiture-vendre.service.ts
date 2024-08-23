import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VoitureVendre } from '../models/VoitureVendre';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { apiUrl } from '../constant/constantes';

@Injectable({
  providedIn: 'root'
})
export class VoitureVendreService {

  private baseUrl = 'voitureVendre';

  constructor(private http: HttpClient) { }

  // Méthode pour ajouter une voiture à vendre
  addVoitureVendre(voiture: VoitureVendre, images: File[]): Observable<any> {
    const formData = new FormData();
    
    // Ajouter les données de la voiture au FormData
    formData.append('voiture', JSON.stringify(voiture));

    // Ajouter les fichiers d'images au FormData
    if(images){
  
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i], images[i].name);
      }
      console.log("service formData : " , images);
    }else{
      console.log("image non pris comme tableau ou vide");

    }

    // Envoyer la requête POST
    return this.http.post(`${apiUrl}/${this.baseUrl}/addVoiture`, formData, {
      headers: new HttpHeaders({
        // Vous pouvez ajouter des en-têtes si nécessaire
      })
    });
  }
  

  
  //Modifier voiture à louer
  updateVoitureVendre(voiture: VoitureVendre, images: File[]): Observable<any> {
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
   updateViews(voiture: VoitureVendre): Observable<any> {
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${voiture.idVoiture}`, voiture);
  }

   // lisyte des voiture
   getAllVoituresVendre(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllVoiture`);
  }

   
  // lisyte des voiture à vendre par utilisateur
  getAllVoituresVendreByUSer(idUser:string): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllVoitureVendreByUser/${idUser}`);
  }


   //Activer voiture à vendre 
   enableVoitureVendre(idUser: string) {
    return this.http.put(`${apiUrl}/${this.baseUrl}/activer/${idUser}`, {});
  }

  //Desactiver voiture à vendre 
  disableVoitureVendre(idUser: string | null) : Observable<any> {
    return this.http.put<any>(`${apiUrl}/${this.baseUrl}/desactiver/${idUser}`, {});
  }


  getImageUrl(idVoiture: string, imageName: string): string {
    return `${apiUrl}/${this.baseUrl}/${idVoiture}/images/${imageName}`;
  }

     // Méthode pour supprimer une voiture à vendre
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
