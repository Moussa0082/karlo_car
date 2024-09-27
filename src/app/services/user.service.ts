import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import {  BehaviorSubject, Subject, tap } from 'rxjs';
import { apiUrl } from '../constant/constantes';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'user';
  
  private user: User | null = null;
  
  public isAuthAdmin:boolean = false;
  
  private userKey = 'userData';  // Key used to store user data in localStorage


  constructor(private http: HttpClient) { 
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser).userData);
    }
  }






  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem(this.userKey) !== null;
  }

  
  // Get the user data from localStorage
  getUser(): any {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Logout and clear user data
 
  logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Example: Simulate an async operation
      // setTimeout(() => {
        // Perform logout logic here
        localStorage.removeItem(this.userKey);
        resolve();  // Resolve the promise when logout is successful
    //   }
    //   , 100
    // );
    });
  }
  


  addUser(user: User) {
    return this.http.post(`${apiUrl}/${this.baseUrl}/addUser`, user);
  }

  disconnectUser(idUser: string): any {
    return this.http.put<any>(`${apiUrl}/${this.baseUrl}/logout/${idUser}`, idUser);
  }


   // Modifier une user
   updateUser(user: User): Observable<any> {
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${user.idUser}`, user);
  }


  getAllUsers(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllUser`);
  }


  //Activer utilisateur 
  enableUtilisateur(idUser: string) {
    return this.http.put(`${apiUrl}/${this.baseUrl}/activer/${idUser}`, {});
  }

  //Desactiver utilisateur 
  disableUtilisateur(idUser: string | null) : Observable<any> {
    return this.http.put<any>(`${apiUrl}/${this.baseUrl}/desactiver/${idUser}`, {});
  }

  loginUtilisateur(email: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password)
    return this.http.get<any>(`${this.baseUrl}/login`, { params }).pipe(
      tap(response => {
        // Stocker les informations de l'utilisateur dans le localStorage
        localStorage.setItem('userData', JSON.stringify(response));
      })
    );
  }
 

  login(email: string, password: string): Observable<User> {

    return this.http.get<User>(`${apiUrl}/${this.baseUrl}/login?email=${email}&password=${password}`).pipe(
      catchError(this.handleError)
    );
  }

  // Method to save user data to localStorage
  saveUserToLocalStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Method to get user data from localStorage
  getUserFromLocalStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Method to remove user data from localStorage
  removeUserFromLocalStorage(): void {
    localStorage.removeItem('user');
  }

  private handleErrorLogin(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

   
  
   // Méthode pour supprimer un utilisateur
   deleteUser(id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<void>) => {
          if (response.status === 200 || response.status === 201 || response.status === 202) {
            // console.log('Utilisateur supprimé avec succès.');
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

    getUtilisateurConnect(): Observable<User | null> {
      return this.user$;
    }
    // setutilisateurConnect(utilisateur: User) {
    //   this.user = utilisateur;
    //   this.isAuthAdmin = true;
    //   // Also update localStorage to persist data across page refreshes
    //   localStorage.setItem('userData', JSON.stringify({ userData: utilisateur }));
    // }
    setutilisateurConnect(user: User) {
      // Mettre à jour l'utilisateur dans le service et le stocker dans localStorage
      this.userSubject.next(user);
      localStorage.setItem('userData', JSON.stringify({ userData: user }));
  }

  
    // getUtilisateurConnect(): User | null {
    //   if (this.user) {
    //     return this.user;
    //   }
  
    //   // Try to get user from localStorage if `user` is not set
    //   const storedUserData = localStorage.getItem('userData');
    //   if (storedUserData) {
    //     return JSON.parse(storedUserData).userData as User;
    //   }
  
    //   return null; // Return null if no user data is available
    // }

}
