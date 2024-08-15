import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Vente } from '../models/Vente';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { VenteService } from '../services/vente.service';
import { AddUpVenteComponent } from '../add-up-vente/add-up-vente.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-vente',
  templateUrl: './list-vente.component.html',
  styleUrls: ['./list-vente.component.scss']
})
export class ListVenteComponent implements OnInit{

  displayedColumns: string[] = [ 'nomClient',  'dateAjout' , 'dateModif' , 'telephone' ,  'montant',  'description', 'voitureVendre' ,  'images' , 'actions'];
  ventes: Vente[] = [];
  dataSource = new MatTableDataSource<Vente>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog , 
    private cd: ChangeDetectorRef, 
    private venteService:VenteService
  ) { }


  ngOnInit(): void {
    this.venteService.getAllVente().subscribe(data => {
      this.ventes = data;
      this.dataSource = new MatTableDataSource(this.ventes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste des ventes charger: ", this.ventes);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des ventes:', error);
    }); 
   }

  chargerDonner(): void {
    this.venteService.getAllVente().subscribe(data => {
      this.ventes = data;
      this.dataSource = new MatTableDataSource(this.ventes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste des ventes charger: ", this.ventes);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des ventes:', error);
    }); 
   }


   onDelete(element:Vente):void{
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
        this.venteService.deleteVente(element.idVente).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            console.log( "result delete : ", result);
          }
        );
        console.log("id Vente", element.idVente);
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


  openDialog(vente?: Vente): void {
    const dialogRef = this.dialog.open(AddUpVenteComponent, {
      width: '700px',
      data: { vente }
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

  editElement(vente: Vente): void {

    this.openDialog(vente);
    console.log("vente open dialog: ", vente);
  }


    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

}
