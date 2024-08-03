import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Marque } from '../models/Marque';
import { AddUpMarqueComponent } from '../add-up-marque/add-up-marque.component';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MarqueService } from '../services/marque.service';

@Component({
  selector: 'app-list-marque',
  templateUrl: './list-marque.component.html',
  styleUrls: ['./list-marque.component.scss']
})
export class ListMarqueComponent implements OnInit{

      
  displayedColumns: string[] = [ 'nomMarque' , 'logo', 'action'];

  dataSource = new MatTableDataSource<Marque>();
  marques: Marque[] = [];
  loading: boolean = true;


  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, private marqueService: MarqueService) { }

 
  ngOnInit(): void {
    // Déclencher le chargement des données après un délai de 4 secondes
    // setTimeout(() => {
      this.marqueService.getAllMarque().subscribe(data => {
        this.marques = data;
        this.dataSource = new MatTableDataSource(this.marques);
        this.loading = false; // Fin du chargement
        console.log("liste marques: ", this.marques);
      },
      (error) => {
        console.error('Erreur lors du chargement de la liste des marques:', error);
        this.loading = false; // Fin du chargement même en cas d'erreur
      });
  //   }, 1000
  // ); // Délai de 4 secondes
 
  }

  chargerDonner(): void {
    this.marqueService.getAllMarque().subscribe(data => {
      this.marques = data;
      this.dataSource.data = this.marques; // Assurez-vous que MatTableDataSource est mis à jour
      console.log("liste marques charger: ", this.marques);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des marques:', error);
    });
  }
  

  


  onDelete(element:Marque):void{
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
        this.marqueService.deleteMarque(element.idMarque).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            console.log( "result delete : ", result);
          }
        );
        console.log("id marque", element.idMarque);
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


  openDialog(marque?: Marque): void {
    const dialogRef = this.dialog.open(AddUpMarqueComponent, {
      width: '500px',
      data: { marque }
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

  editElement(marque: Marque): void {
    this.openDialog(marque);
    console.log("Marque open dialog: ", marque);
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
