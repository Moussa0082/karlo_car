import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import {  Subject, tap } from 'rxjs';
import { apiUrl } from '../constant/constantes';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'user';
  
  private user:User|undefined;
  public isAuthAg:boolean = false;
   
  private updateEvent = new Subject<void>();
  update$ = this.updateEvent.asObservable();


  constructor(private http: HttpClient) { }

  triggerUpdate() {
    this.updateEvent.next();
  }


  addUser(user: User) {
    return this.http.post("http://localhost:9000/user/addUser", user);
  }


   // Modifier une user
   updateUser(user: User): Observable<any> {
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${user.idUser}`, user);
  }
    

  // createUtilisateur(utilisateur: any, image?: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('utilisateur', JSON.stringify(utilisateur));
  //   if (image) formData.append('image', image);
  //   return this.http.post(`http://localhost:8080/utilisateur/create`, formData);
  // }


  getAllUsers(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllUser`);
  }


  //Activer utilisateur 
  enableUtilisateur(idUser: string) {
    return this.http.put(`${apiUrl}/${this.baseUrl}/activer/${idUser}`, {});
  }

  //Desactiver utilisateur 
  disableUtilisateur(idUser: string) {
    return this.http.put(`${apiUrl}/${this.baseUrl}/desactiver/${idUser}`, {});
  }

  loginUtilisateur(email: string, motDePasse: string, userType: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('motDePasse', motDePasse)
      .set('userType', userType);
  
    return this.http.get<any>(`${this.baseUrl}/login`, { params }).pipe(
      tap(response => {
        // Stocker les informations de l'utilisateur dans le localStorage
        localStorage.setItem('userData', JSON.stringify(response));
      })
    );
  }
  // loginutilisateur(email: string, motDePasse: string): Observable<any> {
  //   const body = {
  //    email: email,
  //    motdepasse: motDePasse,
  //   };
 
  //   return this.http.get(`${this.baseUrl}/login?email=${email}&motDePasse=${motDePasse}`);
  //  }

   
  
   // Méthode pour supprimer un utilisateur
   deleteUser(id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<void>) => {
          if (response.status === 200 || response.status === 201 || response.status === 202) {
            console.log('Utilisateur supprimé avec succès.');
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

  setutilisateurConnect(utilisateur : User) {
    this.user = utilisateur;
    this.isAuthAg = true;
  }
  getutilisateurConnect():User |undefined { 
    return this.user;
  }

}
