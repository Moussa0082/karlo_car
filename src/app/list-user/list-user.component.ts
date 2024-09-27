import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { AddUpUserComponent } from '../add-up-user/add-up-user.component';
import { RoleService } from '../services/role.service';
import { Role } from '../models/Role';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';




@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent  implements OnInit{
  
  
  
  displayedColumns: string[] = ['nomUser', 'email', 'adresse', 'telephone' ,'dateAjout', 'role' , 'statut', 'action'];

  dataSource = new MatTableDataSource<User>();
  users: User[] = [];
  loading: boolean = true;
  tempStatus!: boolean; // Variable temporaire pour stocker l'état
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, private userService: UserService) { }

 
  ngOnInit(): void {
    // Déclencher le chargement des données après un délai de 4 secondes
    // setTimeout(() => {
      this.userService.getAllUsers().subscribe(data => {
        this.users = data;
        this.dataSource = new MatTableDataSource(this.users);
        this.loading = false; // Fin du chargement
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // console.log("liste user: ", this.users);
      },
      (error) => {
        // console.error('Erreur lors du chargement de la liste des utilisateurs:', error);
        this.loading = false; // Fin du chargement même en cas d'erreur
      });
  //   }, 1000
  // ); // Délai de 4 secondes
 
  }

  chargerDonner(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
      this.dataSource.data = this.users; // Assurez-vous que MatTableDataSource est mis à jour
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log("liste user charger: ", this.users);
    },
    (error) => {
      // console.error('Erreur lors du chargement de la liste des utilisateurs:', error);
    });
  }
  

  


  onDesActivate(element: User) {
  // Sauvegardez l'état initial du switch
  this.tempStatus = element.statut;
  
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir désactiver cette personne?',
    text: 'Il ne pourra plus accéder à la plateforme!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, désactive-le!',
    cancelButtonText: 'Non, garde-le'
  }).then((result) => {
    if (result.isConfirmed) {
      this.userService.disableUtilisateur(element.idUser).subscribe(
        () => {
          Swal.fire(
            'Désactivation!',
            `${element.nomUser} a été désactivé.`,
            'success'
          );
          // Mettre à jour l'état dans le composant ou le tableau
          this.chargerDonner(); // Recharger les données si nécessaire
        },
        (error) => {
          console.error('Erreur lors de la désactivation : ', error);
          element.statut = this.tempStatus; // Réinitialiser l'état en cas d'erreur
          Swal.fire(
            'Erreur!',
            'Une erreur est survenue lors de la désactivation.',
            'error'
          );
          this.chargerDonner(); // Recharger les données si nécessaire
        }
      );
    } else if (result.isDismissed) {
      element.statut = this.tempStatus; // Réinitialisez l'état si l'action est annulée
      Swal.fire(
        'Annulé',
        'Désactivation annulée',
        'error'
      );
      this.chargerDonner(); // Recharger les données si nécessaire
    }
  });
}

onActivate(element: User) {
  // Sauvegardez l'état initial du switch
  this.tempStatus = element.statut;

  Swal.fire({
    title: 'Êtes-vous sûr de vouloir activer cette personne?',
    text: 'Il pourra accéder à la plateforme!',
    icon: 'success',
    showCancelButton: true,
    confirmButtonText: 'Oui, active-le!',
    cancelButtonText: 'Non, garde-le'
  }).then((result) => {
    if (result.isConfirmed) {
      this.userService.enableUtilisateur(element.idUser).subscribe(
        () => {
          Swal.fire(
            'Activation!',
            `${element.nomUser} a été activé.`,
            'success'
          );
          // Mettre à jour l'état dans le composant ou le tableau
          this.chargerDonner(); // Recharger les données si nécessaire
        },
        (error) => {
          console.error('Erreur lors de l\'activation : ', error);
          element.statut = this.tempStatus; // Réinitialiser l'état en cas d'erreur
          Swal.fire(
            'Erreur!',
            'Une erreur est survenue lors de l\'activation.',
            'error'
          );
          this.chargerDonner(); // Recharger les données si nécessaire
        }
      );
    } else if (result.isDismissed) {
      element.statut = this.tempStatus; // Réinitialisez l'état si l'action est annulée
      Swal.fire(
        'Annulé',
        'Activation annulée',
        'error'
      );
      this.chargerDonner(); // Recharger les données si nécessaire

    }
  });
}



  onDelete(element:User):void{
    Swal.fire({
      title: "Etes vous supprimer?",
      text: "Voulez - vous supprimer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:"Non",
      confirmButtonText: "Oui, je veux supprimer!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(element.idUser).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            // console.log( "result delete : ", result);
          }
        );
        // console.log("id User", element.idUser);
        Swal.fire({
          title: "Supprimer!",
          text: "Suppression réussi.",
          icon: "success"
        });
      }else{
        Swal.fire(
          'Suppression annulée!',
          'Cette suppresion a été annulée.',
          'error'
        )
      }
    });
  }


  openDialog(user?: User): void {
    const dialogRef = this.dialog.open(AddUpUserComponent, {
      width: '500px',
      data: { user }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log('Dialog closed with result:', result);
        this.chargerDonner();
      } else {
        // console.log('Dialog closed without result');
      }
    });
  }

  editElement(user: User): void {

    this.openDialog(user);
    // console.log("user open dialog: ", user);
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEnabledStatus(id: string): boolean {
    // Implement your logic here to determine the enabled status
    // For example, return true or false based on some conditions
    return id == id; // Just an example condition
  }



  getToggleLabel(enabled: boolean): string {
    return enabled === true ? 'Désactiver' : 'Activer';
  }

 

}
