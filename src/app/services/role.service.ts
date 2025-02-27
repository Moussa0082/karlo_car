import { Injectable } from '@angular/core';
import { Role } from '../models/role';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import {  Subject, tap } from 'rxjs';
import { apiUrl } from '../constant/constantes';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private baseUrl = 'role';
  
  private role:Role|undefined;
  public isAuthAg:boolean = false;
   
  private updateEvent = new Subject<void>();
  update$ = this.updateEvent.asObservable();


  constructor(private http: HttpClient) { }

  triggerUpdate() {
    this.updateEvent.next();
  }


  //Creer role
  createRole(role: Role) {
    return this.http.post(`${apiUrl}/${this.baseUrl}/addRole`, role);
  }

  // Modifier une role
  updateRole(role: Role): Observable<any> {
    return this.http.put(`${apiUrl}/${this.baseUrl}/update/${role.idRole}`, role);
  }
    
  

  getAllRole(): Observable<any> {
    return this.http.get(`${apiUrl}/${this.baseUrl}/getAllRole`);
  }


  //Activer role 
  enableRole(idRole: string) {
    return this.http.put(`http://localhost:9000/user/activer/${idRole}`, {});
  }

  //Desactiver role 
  disableRole(idRole: string) {
    return this.http.put(`http://localhost:9000/user/desactiver/${idRole}`, {});
  }

  
  
   // Méthode pour supprimer un role
   deleteRole(id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${apiUrl}/${this.baseUrl}/delete/${id}`, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<void>) => {
          if (response.status === 200 || response.status === 201 || response.status === 202) {
            console.log('role supprimé avec succès.');
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