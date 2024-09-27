import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { VoitureLouer } from '../models/VoitureLouer';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DemandeReservationService } from '../services/demande-reservation.service';
import { DemandeReservation } from '../models/DemandeReservation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-demande-reservation',
  templateUrl: './list-demande-reservation.component.html',
  styleUrls: ['./list-demande-reservation.component.scss']
})
export class ListDemandeReservationComponent implements OnInit{

       
  displayedColumns: string[] = [ 'dateAjout' , 'email' ,'isReserved', 'description' , 'telephone',  'voitureLouer' , 'action'];

  dataSource = new MatTableDataSource<DemandeReservation>();
  demandesReservation: DemandeReservation[] = [];
  loading: boolean = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog , private demandeReservationService: DemandeReservationService) { }

 
  ngOnInit(): void {
      this.demandeReservationService.getAllDemandesReservation().subscribe(data => {
        this.demandesReservation = data;
        this.dataSource = new MatTableDataSource(this.demandesReservation);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // console.log("liste demandes reservation: ", this.demandesReservation);
      },
      (error) => {
        // console.error('Erreur lors du chargement de la liste des demandes reservation:', error);
      });
 
  }

  chargerDonner(): void {
    this.demandeReservationService.getAllDemandesReservation().subscribe(data => {
      this.demandesReservation = data;
      this.dataSource = new MatTableDataSource(this.demandesReservation);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log("liste demande de reservation: ", this.demandesReservation);
    },
    (error) => {
      // console.error('Erreur lors du chargement de la liste des demandes de reservation:', error);
    });
  }
  

  


  onDelete(element:DemandeReservation):void{
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
        this.demandeReservationService.deleteDemandeReservation(element.idDemandeReservation).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            // console.log( "result delete : ", result);
          }
        );
        // console.log("id demande reservation", element.idDemandeReservation);
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


  onValidate(element:DemandeReservation):void{
    Swal.fire({
      title: "Etes vous sûr?",
      text: "Voulez - vous valider la demande de reservation!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:"Non",
      confirmButtonText: "Oui, je veux valider!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.demandeReservationService.validerDemandeReservation(element).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            // console.log( "result delete : ", result);
          }
        );
        // console.log("id demande reservation", element.idDemandeReservation);
        Swal.fire({
          title: "Validation!",
          text: "Validation de la demande de reservation effectuée.",
          icon: "success"
        });
      }else{
        Swal.fire(
          'Validation de la demande de reservation annulée!',
          'Cette validation de la demande de reservation a été annulée.',
          'error'
        )
      }
    });
  }

  onCancel(element:DemandeReservation):void{
    Swal.fire({
      title: "Etes vous sûr?",
      text: "Voulez - vous annuler la demande de reservation!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:"Non",
      confirmButtonText: "Oui, je veux annuler!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.demandeReservationService.annulerDemandeReservation(element).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            // console.log( "result delete : ", result);
          }
        );
        // console.log("id demande reservation", element.idDemandeReservation);
        Swal.fire({
          title: "Annulation!",
          text: "Annulation de la demande de reservation effectuée.",
          icon: "success"
        });
      }else{
        Swal.fire(
          'Annulation de la demande de reservation annulée!',
          'Cette annulation de la demande de reservation a été effectuée avec succès.',
          'error'
        )
      }
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}

