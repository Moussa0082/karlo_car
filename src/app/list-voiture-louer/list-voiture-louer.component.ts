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

@Component({
  selector: 'app-list-voiture-louer',
  templateUrl: './list-voiture-louer.component.html',
  styleUrls: ['./list-voiture-louer.component.scss']
})
export class ListVoitureLouerComponent implements OnInit{
  
  displayedColumns: string[] = ['matricule', 'modele', 'annee', 'typeBoite' , 'dateAjout' , 'dateModif' , 'nbreView' ,  'nbPortiere',  'prixProprietaire', 'prixAugmente' , 'isChauffeur' , 'images' , 'marque',   'typeVoiture', 'typeReservoir', 'user', 'actions'];
  voituresLouer: VoitureLouer[] = [];
  dataSource = new MatTableDataSource<VoitureLouer>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, 
    private voitureLouerService:VoitureLouerService
  ) { }

  
  ngOnInit(): void {
    this.voitureLouerService.getAllVoitures().subscribe(data => {
      this.voituresLouer = data;
      this.dataSource = new MatTableDataSource(this.voituresLouer);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste voitures à louer: ", this.voituresLouer);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des voitures à louer:', error);
    }); 
   }

  chargerDonner(): void {
    this.voitureLouerService.getAllVoitures().subscribe(data => {
      this.voituresLouer = data;
      this.dataSource = new MatTableDataSource(this.voituresLouer);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste voitures à louer: ", this.voituresLouer);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des voitures à louer:', error);
    }); 
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


  openDialog(voitureLouer?: VoitureLouer): void {
    const dialogRef = this.dialog.open(AddUpVoitureLouerComponent, {
      width: '500px',
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

  editElement(voitureLouer: VoitureLouer): void {

    this.openDialog(voitureLouer);
    console.log("voiture Louer open dialog: ", voitureLouer);
  }


    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

}
