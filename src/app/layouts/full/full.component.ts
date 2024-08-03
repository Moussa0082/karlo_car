import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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
export class FullComponent {

  search: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

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
  ]

}
