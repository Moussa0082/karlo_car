import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
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
  isBlankPage:boolean=false;
  libelle!:any;
  isLoginPage:boolean=false;
  isForbiddenPage:boolean=false;
  adminRecup!:User | null;
  private userSubscription!: Subscription;



  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private userService:UserService) { 
    this.userSubscription = this.userService.getUtilisateurConnect().subscribe(user => {
      this.adminRecup = user;
      this.libelle = this.adminRecup?.role.libelle;
      console.log("libelle ", this.libelle);
      // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
    }); 
       this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url.endsWith('login') || event.url === '/login';
      }
      if (event instanceof NavigationEnd) {
        this.isBlankPage = event.url.endsWith('/') || event.url === '/login';
      }
      if (event instanceof NavigationEnd) {
        this.isForbiddenPage = event.url.endsWith('forbidden') || event.url === '/forbidden';
      }
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.getUtilisateurConnect().subscribe(user => {
      this.adminRecup = user;
      // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
      console.log("user recup :" , this.adminRecup)
    });
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url.endsWith('login') || event.url === '/login';
      }
      if (event instanceof NavigationEnd) {
        this.isBlankPage = event.url.endsWith('/') || event.url === '/login';
      }
      if (event instanceof NavigationEnd) {
        this.isForbiddenPage = event.url.endsWith('forbidden') || event.url === '/forbidden';
      }
    });
    
  }

  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    this.userSubscription.unsubscribe();
  }

  transform(value: string): string {
    if (value.length > 10) {
      const words = value.split(' ');
      const initials = words.map(word => word.charAt(0).toUpperCase());
      return initials.join('');
    } else {
      return value;
    }
  }

  

  // Get the user data from localStorage
  
  

  logout(user:User | null):void{
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
      
        this.userService.disconnectUser(user!.idUser).subscribe(
          (response:any) => {
            // Handle success
            this.userService.logout();
          console.log( "user deconnecter", response);
          // Réinitialiser adminRecup
          this.adminRecup = null;
          this.router.navigate(['/login']);
            console.log('User disabled successfully');
          },
          (error:any) => {
            // Handle error
            console.error('Error disabling user', error);
          }
        );
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
      icon: "package",
      menu: "Liste rôles",
    },
    {
      link: "/voituresLouer",
      icon: "car",
      menu: "Liste voitures à louer",
    },
    {
      link: "/voituresVendre",
      icon: "car",
      menu: "Liste voitures à vendre",
    },
    {
      link: "/reservations",
      icon: "calendar",
      menu: "Liste des reservations",
    },
    {
      link: "/ventes",
      icon: "attach_money",
      menu: "Liste des ventes",
    },
    
    {
      link: "/reservoires",
      icon: "dollarSign",
      menu: "Liste reservoirs",
    },
    {
      link: "/typeTransactions",
      icon: "swap_horiz",
      menu: "Liste type transactions",
    },
    {
      link: "/typeVoitures",
      icon: "cars",
      menu: "Liste type voitures",
    },
    {
      link: "/marques",
      icon: "arrowLeftCircle",
      menu: "Liste des marques",
    },
    {
      link: "/transactions",
      icon: "swap_horiz",
      menu: "Liste des transactions",
    },
    {
      link: "/historiques",
      icon: "clock",
      menu: "Liste des historiques",
    },
    {
      link: "/contact",
      icon: "phone",
      menu: "Liste des contact",
    },
  ]


  sidebarMenuPart: sidebarMenu[] = [
    {
      link: "/vlpart",
      icon: "car",
      menu: "Liste voitures à louer",
    },
    {
      link: "/vvpart",
      icon: "car",
      menu: "Liste voitures à vendre",
    },
    // {
    //   link: "/reservations",
    //   icon: "calendar",
    //   menu: "Liste des reservations",
    // },
    // {
    //   link: "/ventes",
    //   icon: "attach_money",
    //   menu: "Liste des ventes",
    // }
  ]
  

}
