import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { VoitureLouer } from '../models/VoitureLouer';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { VoitureLouerService } from '../services/voiture-louer.service';
import { AddUpVoitureLouerComponent } from '../add-up-voiture-louer/add-up-voiture-louer.component';
import Swal from 'sweetalert2';
import { AddUpVLPartComponent } from '../add-up-vlpart/add-up-vlpart.component';
import { User } from '../models/User';
import { Subscription } from 'rxjs';
import { DetailVoitureLouerComponent } from '../detail-voiture-louer/detail-voiture-louer.component';


@Component({
  selector: 'app-list-voiture-lpart',
  templateUrl: './list-voiture-lpart.component.html',
  styleUrls: ['./list-voiture-lpart.component.scss']
})
export class ListVoitureLPartComponent  

implements OnInit{
  
  displayedColumns: string[] = ['matricule', 'statut' , 'modele', 'annee', 'typeBoite' , 'dateAjout' , 'dateModif' , 'nbreView' ,  'nbPortiere',  'prixProprietaire', 'prixAugmente' , 'isChauffeur' ,  'marque',   'typeVoiture', 'typeReservoir', 'user', 'actions'];
  // displayedColumns: string[] = ['matricule', 'statut' , 'modele', 'annee', 'typeBoite' , 'dateAjout' , 'dateModif' , 'nbreView' ,  'nbPortiere',  'prixProprietaire', 'prixAugmente' , 'isChauffeur' , 'images' , 'marque',   'typeVoiture', 'typeReservoir', 'user', 'actions'];
  voituresLouer: VoitureLouer[] = [];
  tempStatus!: boolean; // Variable temporaire pour stocker l'état
  dataSource = new MatTableDataSource<VoitureLouer>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  adminRecup!: User  | null;
  userSubscription!: Subscription;
  sliderInterval: any;

  
  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, 
    private voitureLouerService:VoitureLouerService,
    private userService:UserService
  ) { }

  
  ngOnInit(): void {
    this.userSubscription = this.userService.getUtilisateurConnect().subscribe(user => {
      this.adminRecup = user;
      // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
    });
    this.voitureLouerService.getAllVoituresLouerByUSer(this.adminRecup!.idUser).subscribe(data => {
      // this.voituresLouer = data;
      this.voituresLouer = data.map((voiture:any) => ({
        ...voiture,
        currentImageIndex: 0
      }));
      this.dataSource = new MatTableDataSource(this.voituresLouer);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste voitures à louer: ", this.voituresLouer);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des voitures à louer:', error);
    }); 
    // Démarrer le slider automatique au chargement du composant
    this.startAutoSlider();
  }

  startAutoSlider(): void {
    this.sliderInterval = setInterval(() => {
      this.voituresLouer.forEach(voiture => {
        // Si la voiture a des images, faire défiler
        if (voiture.images.length > 0) {
          voiture.currentImageIndex = 
            (voiture.currentImageIndex! + 1) % voiture.images.length;
        }
      });
    }, 2000); // Changer d'image toutes les 3 secondes
  }

  chargerDonner(): void {
    this.voitureLouerService.getAllVoituresLouerByUSer(this.adminRecup!.idUser).subscribe(data => {
      // this.voituresLouer = data;
       // Initialisation de l'index des images pour chaque voiture
       this.voituresLouer = data.map((voiture:any) => ({
        ...voiture,
        currentImageIndex: 0
      }));
      this.dataSource = new MatTableDataSource(this.voituresLouer);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste voitures à louer: ", this.voituresLouer);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des voitures à louer:', error);
    }); 
   }


   previousImage(voitureLouer: VoitureLouer): void {
    if (voitureLouer.images && voitureLouer.images.length > 1) {
      voitureLouer.currentImageIndex = 
        (voitureLouer.currentImageIndex === 0) ? 
        voitureLouer.images.length - 1 : 
        voitureLouer.currentImageIndex! - 1;
    }
  }

  // Fonction pour passer à l'image suivante
  nextImage(voitureLouer: VoitureLouer): void {
    if (voitureLouer.images && voitureLouer.images.length > 1) {
      voitureLouer.currentImageIndex = 
        (voitureLouer.currentImageIndex! + 1) % voitureLouer.images.length;
    }
  }


   onDelete(element:VoitureLouer):void{
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
        this.voitureLouerService.deleteVoiture(element.idVoiture).subscribe(
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


  onDesActivate(element: VoitureLouer) {
    // Sauvegardez l'état initial du switch
    this.tempStatus = element.isDisponible;
    
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir désactiver cette voiture à louer?',
      text: 'Personne ne pourra la louer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, désactive-le!',
      cancelButtonText: 'Non, garde-le'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voitureLouerService.disableVoitureLouer(element.idVoiture).subscribe(
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
            element.isDisponible = this.tempStatus; // Réinitialiser l'état en cas d'erreur
            Swal.fire(
              'Erreur!',
              'Une erreur est survenue lors de la désactivation.',
              'error'
            );
            this.chargerDonner(); // Recharger les données si nécessaire
          }
        );
      } else if (result.isDismissed) {
        element.isDisponible = this.tempStatus; // Réinitialisez l'état si l'action est annulée
        Swal.fire(
          'Annulé',
          'Désactivation annulée',
          'error'
        );
        this.chargerDonner(); // Recharger les données si nécessaire
      }
    });
  }
  
  onActivate(element: VoitureLouer) {
    // Sauvegardez l'état initial du switch
    this.tempStatus = element.isDisponible;
  
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir activer cette voiture à louer?',
      text: 'Les utilisateurs pourront le louer!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Oui, active-le!',
      cancelButtonText: 'Non, garde-le'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voitureLouerService.enableVoitureLouer(element.idVoiture).subscribe(
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
            element.isDisponible = this.tempStatus; // Réinitialiser l'état en cas d'erreur
            Swal.fire(
              'Erreur!',
              'Une erreur est survenue lors de l\'activation.',
              'error'
            );
            this.chargerDonner(); // Recharger les données si nécessaire
          }
        );
      } else if (result.isDismissed) {
        element.isDisponible = this.tempStatus; // Réinitialisez l'état si l'action est annulée
        Swal.fire(
          'Annulé',
          'Activation annulée',
          'error'
        );
        this.chargerDonner(); // Recharger les données si nécessaire
  
      }
    });
  }
  


  openDialog(voitureLouer?: VoitureLouer): void {
    const dialogRef = this.dialog.open(AddUpVLPartComponent, {
      width: '700px',
      data: { voitureLouer }
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

  openDialogView(voitureLouer?: VoitureLouer): void {
    const dialogRef = this.dialog.open(DetailVoitureLouerComponent, {
      width: '700px',
      data: { voitureLouer }
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

  
  voirElement(voitureLouer: VoitureLouer): void {
    
    this.openDialogView(voitureLouer);
    console.log("voiture Louer open dialog: ", voitureLouer);
  }
  
  editElement(voitureLouer: VoitureLouer): void {

    this.openDialog(voitureLouer);
    console.log("voiture Louer open dialog: ", voitureLouer);
  }

  getToggleLabel(enabled: boolean): string {
    return enabled === true ? 'Dispo' : 'Non dispo';
  }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

}
