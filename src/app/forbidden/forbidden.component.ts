import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent implements OnInit{


  adminRecup!: User  | null;
  userSubscription!: Subscription;

  constructor(
    private userService:UserService
  ){}

  ngOnInit(): void {
    // this.userSubscription = this.userService.getUtilisateurConnect().subscribe(user => {
    //   this.adminRecup = user;
    //   // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
    // });
  }

}
