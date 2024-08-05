import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Marque } from '../models/Marque';
import { MatDialog } from '@angular/material/dialog';
import { HistoriqueService } from '../services/historique.service';
import { Historique } from '../models/Historique';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historiques',
  templateUrl: './historiques.component.html',
  styleUrls: ['./historiques.component.scss']
})
export class HistoriquesComponent implements OnInit{


  displayedColumns: string[] = [ 'date' , 'description', 'action'];

  dataSource = new MatTableDataSource<Historique>();
  historiques: Historique[] = [];


  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, private historiqueService: HistoriqueService) { }

 
  ngOnInit(): void {
    // Déclencher le chargement des données après un délai de 4 secondes
    // setTimeout(() => {
      this.historiqueService.getAllHistorique().subscribe(data => {
        this.historiques = data;
        this.dataSource = new MatTableDataSource(this.historiques);
        console.log("liste historiques: ", this.historiques);
      },
      (error) => {
        console.error('Erreur lors du chargement de la liste des marques:', error);
      });
  //   }, 1000
  // ); // Délai de 4 secondes
 
  }

  chargerDonner(): void {
    
    this.historiqueService.getAllHistorique().subscribe(data => {
      this.historiques = data;
      this.dataSource = new MatTableDataSource(this.historiques);
      console.log("liste historiques: ", this.historiques);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des marques:', error);
    });

  }
  

  


  onDelete(element:Historique):void{
    Swal.fire({
      title: "Etes vous sûr?",
      text: "Voulez - vous supprimer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:"Non",
      confirmButtonText: "Oui, je veux supprimer!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.historiqueService.deleteHistorique(element.idHistorique).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            console.log( "result delete : ", result);
          }
        );
        console.log("id Historique", element.idHistorique);
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






  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
