import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TypeReservoir } from '../models/TypeReservoir';
import { AddUpTypeReservoirComponent } from '../add-up-type-reservoir/add-up-type-reservoir.component';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ReservoirService } from '../services/reservoir.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-type-reservoir',
  templateUrl: './list-type-reservoir.component.html',
  styleUrls: ['./list-type-reservoir.component.scss']
})
export class ListTypeReservoirComponent {

    
  displayedColumns: string[] = [ 'nomTypeReservoir' , 'description', 'action'];

  dataSource = new MatTableDataSource<TypeReservoir>();
  typeReservoires: TypeReservoir[] = [];
  loading: boolean = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, private typeReservoireService: ReservoirService) { }

 
  ngOnInit(): void {
    // Déclencher le chargement des données après un délai de 4 secondes
    // setTimeout(() => {
      this.typeReservoireService.getAllTypeReservoir().subscribe(data => {
        this.typeReservoires = data;
        this.dataSource = new MatTableDataSource(this.typeReservoires);
        this.loading = false; // Fin du chargement
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("liste types reservoir: ", this.typeReservoires);
      },
      (error) => {
        console.error('Erreur lors du chargement de la liste des type reservoirs:', error);
        this.loading = false; // Fin du chargement même en cas d'erreur
      });
  //   }, 1000
  // ); // Délai de 4 secondes
 
  }

  chargerDonner(): void {
    this.typeReservoireService.getAllTypeReservoir().subscribe(data => {
      this.typeReservoires = data;
      this.dataSource.data = this.typeReservoires; // Assurez-vous que MatTableDataSource est mis à jour
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste type reservoir charger: ", this.typeReservoires);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des type reservoirs:', error);
    });
  }
  

  


  onDelete(element:TypeReservoir):void{
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
        this.typeReservoireService.deleteTypeReservoire(element.idTypeReservoir).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            console.log( "result delete : ", result);
          }
        );
        console.log("id typeReservoire", element.idTypeReservoir);
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


  openDialog(typeReservoir?: TypeReservoir): void {
    const dialogRef = this.dialog.open(AddUpTypeReservoirComponent, {
      width: '500px',
      data: { typeReservoir }
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

  editElement(typeReservoire: TypeReservoir): void {
    this.openDialog(typeReservoire);
    console.log("type reservoir open dialog: ", typeReservoire);
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
