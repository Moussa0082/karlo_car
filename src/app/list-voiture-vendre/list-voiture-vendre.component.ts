import { Component, OnInit, ViewChild } from '@angular/core';
import { VoitureVendre } from '../models/VoitureVendre';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VoitureVendreService } from '../services/voiture-vendre.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AddUpVoitureVendreComponent } from '../add-up-voiture-vendre/add-up-voiture-vendre.component';

@Component({
  selector: 'app-list-voiture-vendre',
  templateUrl: './list-voiture-vendre.component.html',
  styleUrls: ['./list-voiture-vendre.component.scss']
})
export class ListVoitureVendreComponent implements OnInit{


  displayedColumns: string[] = ['matricule', 'modele', 'annee', 'typeBoite' , 'dateAjout' , 'dateModif' , 'nbreView' ,  'nbPortiere',  'prixProprietaire', 'prixAugmente' , 'images' , 'marque',   'typeVoiture', 'typeReservoir', 'user', 'actions'];
  voituresVendre: VoitureVendre[] = [];
  dataSource = new MatTableDataSource<VoitureVendre>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog ,  
    private voitureVendreService:VoitureVendreService
  ) { }

  ngOnInit(): void {
    this.voitureVendreService.getAllVoitures().subscribe(data => {
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
    this.voitureVendreService.getAllVoitures().subscribe(data => {
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


  openDialog(voitureVendre?: VoitureVendre): void {
    const dialogRef = this.dialog.open(AddUpVoitureVendreComponent, {
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
