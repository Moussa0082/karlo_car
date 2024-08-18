import { Component, OnInit, ViewChild } from '@angular/core';
import { VoitureVendre } from '../models/VoitureVendre';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VoitureVendreService } from '../services/voiture-vendre.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AddUpVoitureVendreComponent } from '../add-up-voiture-vendre/add-up-voiture-vendre.component';
import { AddUpVPartComponent } from '../add-up-vpart/add-up-vpart.component';
import { User } from '../models/User';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-list-voiture-part',
  templateUrl: './list-voiture-part.component.html',
  styleUrls: ['./list-voiture-part.component.scss']
})
export class ListVoiturePartComponent 

implements OnInit{


  displayedColumns: string[] = ['matricule', 'statut' ,'modele', 'annee', 'typeBoite' , 'dateAjout' , 'dateModif' , 'nbreView' ,  'nbPortiere',  'prixProprietaire', 'prixAugmente' , 'images' , 'marque',   'typeVoiture', 'typeReservoir', 'user', 'actions'];
  voituresVendre: VoitureVendre[] = [];
  tempStatus!: boolean; // Variable temporaire pour stocker l'état
  dataSource = new MatTableDataSource<VoitureVendre>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  adminRecup!: User  | null;
  userSubscription!: Subscription;

  constructor(private dialog: MatDialog ,
    private userService:UserService,
    private voitureVendreService:VoitureVendreService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.userService.getUtilisateurConnect().subscribe(user => {
      this.adminRecup = user;
      // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
    });
    this.voitureVendreService.getAllVoituresVendreByUSer(this.adminRecup!.idUser).subscribe(data => {
      this.voituresVendre = data;
      this.dataSource = new MatTableDataSource(this.voituresVendre);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste voitures à vendre: ", this.voituresVendre);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des voitures à vendre:', error);
    });  
   }


  chargerDonner(): void {
    this.voitureVendreService.getAllVoituresVendreByUSer(this.adminRecup!.idUser).subscribe(data => {
      this.voituresVendre = data;
      this.dataSource = new MatTableDataSource(this.voituresVendre);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste voitures à vendre: ", this.voituresVendre);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des voitures à vendre:', error);
    });  
   }
  

   onDelete(element:VoitureVendre):void{
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
        this.voitureVendreService.deleteVoiture(element.idVoiture).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            console.log( "result delete : ", result);
          }
        );
        console.log("id VoitureLouer", element.idVoiture);
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


  onDesActivate(element: VoitureVendre) {
    // Sauvegardez l'état initial du switch
    this.tempStatus = element.isVendu;
    
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir désactiver cette voiture à vendre?',
      text: 'Personne ne pourra l\'acheter!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, désactive-le!',
      cancelButtonText: 'Non, garde-le'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voitureVendreService.disableVoitureVendre(element.idVoiture).subscribe(
          () => {
            Swal.fire(
              'Désactivation!',
              `${element.matricule}  ${element.modele} a été désactivé.`,
              'success'
            );
            // Mettre à jour l'état dans le composant ou le tableau
            this.chargerDonner(); // Recharger les données si nécessaire
          },
          (error) => {
            console.error('Erreur lors de la désactivation : ', error);
            element.isVendu = this.tempStatus; // Réinitialiser l'état en cas d'erreur
            Swal.fire(
              'Erreur!',
              'Une erreur est survenue lors de la désactivation.',
              'error'
            );
            this.chargerDonner(); // Recharger les données si nécessaire
          }
        );
      } else if (result.isDismissed) {
        element.isVendu = this.tempStatus; // Réinitialisez l'état si l'action est annulée
        Swal.fire(
          'Annulé',
          'Désactivation annulée',
          'error'
        );
        this.chargerDonner(); // Recharger les données si nécessaire
      }
    });
  }
  
  onActivate(element: VoitureVendre) {
    // Sauvegardez l'état initial du switch
    this.tempStatus = element.isVendu;
  
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir activer cette voiture à vendre?',
      text: 'Les utilisateurs pourront  l\'acheter!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Oui, active-le!',
      cancelButtonText: 'Non, garde-le'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voitureVendreService.enableVoitureVendre(element.idVoiture).subscribe(
          () => {
            Swal.fire(
              'Activation!',
              `${element.matricule}  ${element.modele} a été activé.`,
              'success'
            );
            // Mettre à jour l'état dans le composant ou le tableau
            this.chargerDonner(); // Recharger les données si nécessaire
          },
          (error) => {
            console.error('Erreur lors de l\'activation : ', error);
            element.isVendu = this.tempStatus; // Réinitialiser l'état en cas d'erreur
            Swal.fire(
              'Erreur!',
              'Une erreur est survenue lors de l\'activation.',
              'error'
            );
            this.chargerDonner(); // Recharger les données si nécessaire
          }
        );
      } else if (result.isDismissed) {
        element.isVendu = this.tempStatus; // Réinitialisez l'état si l'action est annulée
        Swal.fire(
          'Annulé',
          'Activation annulée',
          'error'
        );
        this.chargerDonner(); // Recharger les données si nécessaire
  
      }
    });
  }


  openDialog(voitureVendre?: VoitureVendre): void {
    const dialogRef = this.dialog.open(AddUpVPartComponent, {
      width: '700px',
      data: { voitureVendre }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with result:', result);
        this.chargerDonner();
      } else {
        console.log('Dialog closed without result');
      }
    });
  }

  getToggleLabel(enabled: boolean): string {
    return enabled === true ? 'Vendu' : 'Non vendu';
  }


  editElement(voitureVendre: VoitureVendre): void {

    this.openDialog(voitureVendre);
    console.log("voiture Vendre open dialog: ", voitureVendre);
  }


    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
   

}
