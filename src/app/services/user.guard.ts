
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
providedIn: 'root'
})

export class UserGuard implements CanActivate {

  constructor(private authService: UserService, private router: Router) { }

   canActivate(): Observable<boolean> | Promise<boolean> | boolean {
  return this.authService.getUtilisateurConnect().pipe(
    map(user => {
      if (user && user.role.libelle.toLowerCase() === 'user') {
        return true;  // Allow access
      } else {
        this.router.navigate(['/vlpart']); // Redirect to a forbidden page
        return false;  // Deny access
      }
    }),
    catchError(() => {
      this.router.navigate(['/vlpart']);
      return of(false);
    })
  );
}

}