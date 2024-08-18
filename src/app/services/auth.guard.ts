// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };

// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//  providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   // inject the router service to allow navigation.
//  constructor(private router: Router) { }

//  canActivate(
//  route: ActivatedRouteSnapshot,
//  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
//   //  const { role } = loggedInUser;
   
//    // provides the route configuration options.
//    const { routeConfig } = route; 
   
//    // provides the path of the route.
//    const { path } = routeConfig as Route; 
   
//    if (path?.includes('admin')) {
//    // if user is administrator and is trying to access admin routes, allow access.
//      return true;
//    }
   
//   //  if (path?.includes('customer') && role === 'customer') {
//   //  // if user is customer and is accessing customer route, allow access.

//   //    return true;
//   //  }
    
//   //  if ((path?.includes('guest') || path?.includes('home')) && (role === 'customer' || role === 'administrator')) {
//   //  // if a logged in user goes to Guest or Home, navigate to their respective dashboard.

//   //      this.router.navigateByUrl(role === 'customer' ? '/customer' : '/admin');
//   //      return false;
//   //  }
   
//    // for any other condition, navigate to the forbidden route.

//    this.router.navigateByUrl('/forbidden'); 
//    return false;
//  }
// }



import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: UserService, private router: Router) { }

  // canActivate(): boolean {
  //   if (this.authService.isLoggedIn()) {
  //     return true;  // Allow access
  //   } else {
  //     this.router.navigate(['/login']);  // Redirect to login page
  //     return false;  // Deny access
  //   }
  // }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.getUtilisateurConnect().pipe(
      map(user => {
        if (user && user.role.libelle.toLowerCase() === 'admin') {
          return true;  // Allow access
        } else {
          this.router.navigate(['/home']); // Redirect to a forbidden page
          return false;  // Deny access
        }
      }),
      catchError(() => {
        this.router.navigate(['/home']);
        return of(false);
      })
    );
  }
  
}
