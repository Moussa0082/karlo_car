import { Component, ViewChild } from '@angular/core';
import { TypeTransaction } from '../models/TypeTransaction';
import { AddUpTypeTransactionComponent } from '../add-up-type-transaction/add-up-type-transaction.component';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { TypeTransactionService } from '../services/type-transaction.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-type-transaction',
  templateUrl: './list-type-transaction.component.html',
  styleUrls: ['./list-type-transaction.component.scss']
})
export class ListTypeTransactionComponent {

  displayedColumns: string[] = [ 'libelle' , 'action'];

  dataSource = new MatTableDataSource<TypeTransaction>();
  typeTransactions: TypeTransaction[] = [];
  loading: boolean = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private typeTransactionService: TypeTransactionService, private fb: FormBuilder, private dialog: MatDialog){

  }

  ngOnInit(): void {
    this.typeTransactionService.getAllTypeTransaction().subscribe(data => {
      this.typeTransactions = data;
      this.dataSource = new MatTableDataSource(this.typeTransactions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste typeTransaction: ", this.typeTransactions);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des typeTransactions:', error);
    });  
  }

  chargerDonner(): void {
    this.typeTransactionService.getAllTypeTransaction().subscribe(data => {
      this.typeTransactions = data;
      this.dataSource.data = this.typeTransactions; // Assurez-vous que MatTableDataSource est mis à jour
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste typeTransaction: ", this.typeTransactions);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des typeTransactions:', error);
    });  
  }



  onDelete(element:TypeTransaction):void{
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
        this.typeTransactionService.deleteTypeTransaction(element.idTypeTransaction).subscribe(
          (result) => {
            console.log( "result delete : ", result);
            this.chargerDonner(); // Recharger la liste après la suppression réussie
          }
        );
        console.log("id typeTransaction", element.idTypeTransaction);
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


  openDialog(typeTransaction?: TypeTransaction): void {
    const dialogRef = this.dialog.open(AddUpTypeTransactionComponent, {
      width: '500px',
      data: { typeTransaction }
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
  editElement(typeTransaction: TypeTransaction): void {
    this.openDialog(typeTransaction);
    console.log("typeTransaction open dialog: ", typeTransaction);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
