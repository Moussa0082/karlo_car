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
  addVoitureLouer(voitureLouer: any, images: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('voiture', JSON.stringify(voitureLouer));
  
    if(images){
  
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i], images[i].name);
      }
      console.log("service formData : " , images);
    }else{
      console.log("image non pris comme tableau ou vide");

    }
  
    return this.http.post<any>(`${apiUrl}/${this.baseUrl}/addVoiture`, formData);
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
 


   //Activer voiture à louer 
   enableVoitureLouer(idUser: string) {
    return this.http.put(`${apiUrl}/${this.baseUrl}/activer/${idUser}`, {});
  }

  //Desactiver voiture à louer 
  disableVoitureLouer(idUser: string | null) : Observable<any> {
    return this.http.put<any>(`${apiUrl}/${this.baseUrl}/desactiver/${idUser}`, {});
  }

   // Modifier vue voiture
   updateViews(voiture: VoitureLouer): Observable<any> {
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${voiture.idVoiture}`, voiture);
  }

   // lisyte des voiture
   getAllVoituresLouer(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllVoiture`);
  }

   // lisyte des voiture à louer par utilisateur
   getAllVoituresLouerByUSer(idUser:string): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllVoitureLouerByUser/${idUser}`);
  }

  // Méthode pour obtenir les images d'une voiture spécifique
  // getImages(idVoiture: string, imageName:string): Observable<string[]> {
  //   const url = `${apiUrl}/${this.baseUrl}/${idVoiture}/images/${imageName}`;
  //   return this.http.get<string[]>(url);
  // }
  // getImages(idVoiture: string, imageName: string): Observable<Blob> {
  //   const url = `${apiUrl}/${this.baseUrl}/${idVoiture}/images/${imageName}`;
  //   return this.http.get(url, { responseType: 'blob' });  // Spécifiez que la réponse est un Blob (binaire)
  // }
  getImageUrl(idVoiture: string, imageName: string): string {
    return `${apiUrl}/${this.baseUrl}/${idVoiture}/images/${imageName}`;
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
