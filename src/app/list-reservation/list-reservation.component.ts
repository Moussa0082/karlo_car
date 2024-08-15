import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Reservation } from '../models/Reservation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ReservationService } from '../services/reservation.service';
import { AddUpReservationComponent } from '../add-up-reservation/add-up-reservation.component';

@Component({
  selector: 'app-list-reservation',
  templateUrl: './list-reservation.component.html',
  styleUrls: ['./list-reservation.component.scss']
})
export class ListReservationComponent implements OnInit{


  displayedColumns: string[] = ['dateDebut', 'dateFin', 'nomClient',  'dateAjout' , 'dateModif' , 'telephone' ,  'montant',  'description', 'voitureLouer' ,  'images' , 'actions'];
  reservations: Reservation[] = [];
  dataSource = new MatTableDataSource<Reservation>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog , 
    private cd: ChangeDetectorRef, 
    private reservationService:ReservationService
  ) { }

  ngOnInit(): void {
    this.reservationService.getAllReservation().subscribe(data => {
      this.reservations = data;
      this.dataSource = new MatTableDataSource(this.reservations);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste des reservations charger: ", this.reservations);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des reservations:', error);
    }); 
   }
   
   chargerDonner(): void {
    this.reservationService.getAllReservation().subscribe(data => {
      this.reservations = data;
      this.dataSource = new MatTableDataSource(this.reservations);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste des reservations charger: ", this.reservations);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des reservations:', error);
    }); 
   }



  onDelete(element:Reservation):void{
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
        this.reservationService.deleteReservation(element.idReservation).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            console.log( "result delete : ", result);
          }
        );
        console.log("id Reservation", element.idReservation);
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


  openDialog(reservation?: Reservation): void {
    const dialogRef = this.dialog.open(AddUpReservationComponent, {
      width: '700px',
      data: { reservation }
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

  editElement(reservation: Reservation): void {

    this.openDialog(reservation);
    console.log("reservation open dialog: ", reservation);
  }


    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }


}
