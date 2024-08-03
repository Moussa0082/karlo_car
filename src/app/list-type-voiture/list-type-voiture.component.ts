import { Component, OnInit } from '@angular/core';
import { TypeVoiture } from '../models/TypeVoiture';
import { MatTableDataSource } from '@angular/material/table';
import { TypeVoitureService } from '../services/type-voiture.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AddUpTypeVoitureComponent } from '../add-up-type-voiture/add-up-type-voiture.component';

@Component({
  selector: 'app-list-type-voiture',
  templateUrl: './list-type-voiture.component.html',
  styleUrls: ['./list-type-voiture.component.scss']
})
export class ListTypeVoitureComponent  implements OnInit{


  displayedColumns: string[] = [ 'nom' , 'description', 'action'];

  dataSource = new MatTableDataSource<TypeVoiture>();
  typeVoitures: TypeVoiture[] = [];
  loading: boolean = true;
  
  constructor(private typeVoitureService: TypeVoitureService, private fb: FormBuilder, private dialog: MatDialog){

  }

  ngOnInit(): void {
    this.typeVoitureService.getAllTypeVoiture().subscribe(data => {
      this.typeVoitures = data;
      this.dataSource = new MatTableDataSource(this.typeVoitures);
      console.log("liste type Voitures: ", this.typeVoitures);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des type Voitures:', error);
    });  
  }

  chargerDonner(): void {
    this.typeVoitureService.getAllTypeVoiture().subscribe(data => {
      this.typeVoitures = data;
      this.dataSource.data = this.typeVoitures; // Assurez-vous que MatTableDataSource est mis à jour
      console.log("liste type voitures: ", this.typeVoitures);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des type voiture:', error);
    });  
  }



  onDelete(element:TypeVoiture):void{
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
        this.typeVoitureService.deleteTypeVoiture(element.idTypeVoiture).subscribe(
          (result) => {
            console.log( "result delete : ", result);
            this.chargerDonner(); // Recharger la liste après la suppression réussie
          }
        );
        console.log("id type voiture", element.idTypeVoiture);
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


  openDialog(typeVoiture?: TypeVoiture): void {
    const dialogRef = this.dialog.open(AddUpTypeVoitureComponent, {
      width: '500px',
      data: { typeVoiture }
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

  //Editer 
  editElement(typeVoiture: TypeVoiture): void {
    this.openDialog(typeVoiture);
    console.log("type voiture open dialog: ", typeVoiture);
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
