import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/User';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit{

  search: boolean = false;
  isLoginPage:boolean=false;
  adminRecup!:User;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private userService:UserService) { 
    this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      this.isLoginPage = event.url.endsWith('login') || event.url === '/login';
    }
  });
  }

  ngOnInit(): void {
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url.endsWith('login') || event.url === '/login';
      }
    });
    
  }

  

  logout(user:User):void{
    Swal.fire({
      title: "Etes vous sûr?",
      text: "Voulez - vous , vous decconecter?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:"Non",
      confirmButtonText: "Oui, je veux!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.logout().then(() => {
          this.userService.disableUtilisateur(user.idUser);
          console.log( "user deconnecter");
          this.router.navigate(['/login']);
        });
      }else{
        console.log( "deconnection annuler");

      }
    });

  }

  routerActive: string = "activelink";

  sidebarMenu: sidebarMenu[] = [
    {
      link: "/home",
      icon: "home",
      menu: "Dashboard",
    },
    
    {
      link: "/users",
      icon: "user",
      menu: "Liste utilisateurs",
    },
    
    
    {
      link: "/roles",
      icon: "layers",
      menu: "Listes rôles",
    },
    {
      link: "/reservoires",
      icon: "layers",
      menu: "Listes reservoirs",
    },
    {
      link: "/typeTransactions",
      icon: "layers",
      menu: "Listes type transactions",
    },
    {
      link: "/typeVoitures",
      icon: "layers",
      menu: "Listes type voitures",
    },
    {
      link: "/marques",
      icon: "layers",
      menu: "Listes des marques",
    },
    {
      link: "/transactions",
      icon: "layers",
      menu: "Listes des transactions",
    },
  ]

}
