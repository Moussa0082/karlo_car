import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Transaction } from '../models/Transaction';
import { AddUpTransactionComponent } from '../add-up-transaction/add-up-transaction.component';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TransactionService } from '../services/transaction.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.scss']
})
export class ListTransactionComponent implements OnInit{

       
  displayedColumns: string[] = [ 'dateTransaction' , 'montant' ,'dateModif', 'description' , 'type', 'user',  'typeTransaction' , 'action'];

  dataSource = new MatTableDataSource<Transaction>();
  transactions: Transaction[] = [];
  loading: boolean = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, private transactionService: TransactionService) { }

 
  ngOnInit(): void {
      this.transactionService.getAllTransactions().subscribe(data => {
        this.transactions = data;
        this.dataSource = new MatTableDataSource(this.transactions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // console.log("liste transactions: ", this.transactions);
      },
      (error) => {
        // console.error('Erreur lors du chargement de la liste des transactions:', error);
      });
 
  }

  chargerDonner(): void {
    this.transactionService.getAllTransactions().subscribe(data => {
      this.transactions = data;
      this.dataSource = new MatTableDataSource(this.transactions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log("liste transactions: ", this.transactions);
    },
    (error) => {
      // console.error('Erreur lors du chargement de la liste des transactions:', error);
    });
  }
  

  


  onDelete(element:Transaction):void{
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
        this.transactionService.deleteTransaction(element.idTransaction).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            // console.log( "result delete : ", result);
          }
        );
        // console.log("id transaction", element.idTransaction);
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


  openDialog(transaction?: Transaction): void {
    const dialogRef = this.dialog.open(AddUpTransactionComponent, {
      width: '500px',
      data: { transaction }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log('Dialog closed with result:', result);
        this.chargerDonner();
      } else {
        // console.log('Dialog closed without result');
      }
    });
  }

  editElement(transaction: Transaction): void {
    this.openDialog(transaction);
    // console.log("Transaction open dialog: ", transaction);
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
