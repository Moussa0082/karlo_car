import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction } from '../models/Transaction';
import { TransactionService } from '../services/transaction.service';
import { TypeTransactionService } from '../services/type-transaction.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TypeTransaction } from '../models/TypeTransaction';
import Swal from 'sweetalert2';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-up-transaction',
  templateUrl: './add-up-transaction.component.html',
  styleUrls: ['./add-up-transaction.component.scss']
})
export class AddUpTransactionComponent implements OnInit{

  adminRecup!: User  | null;
  transactionForm!:FormGroup;
  typeTransactions: TypeTransaction[] = [];
  isEditMode: boolean;
  private userSubject = new BehaviorSubject<User | null>(null);
  private userSubscription!: Subscription;




  constructor(private userService : UserService, private typeTransactionService:TypeTransactionService,
    public dialogRef: MatDialogRef<AddUpTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
    private fb:FormBuilder,private transactionService : TransactionService
  ){
    this.userSubscription = this.userService.getUtilisateurConnect().subscribe(user => {
      this.adminRecup = user;
      // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
    }); 
       this.isEditMode = !!data.transaction; // Si une transaction est passé, alors c'est le mode édition
    this.transactionForm = this.fb.group({
      idTransaction: [this.isEditMode ? this.data.transaction?.idTransaction : '', this.isEditMode ? Validators.required : null],
      description: [data.transaction?.description || '', Validators.required],
      user: this.adminRecup,
      typeTransaction: [data.transaction?.typeTransaction || '', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.getUtilisateurConnect().subscribe(user => {
      this.adminRecup = user;
      // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
    });
    console.log("Admin recup  ", this.adminRecup);
    this.isEditMode = !!this.data.transaction; // Si une transaction est passé, alors c'est le mode édition
    this.transactionForm = this.fb.group({
      idTransaction: [this.isEditMode ? this.data.transaction?.idTransaction : '', this.isEditMode ? Validators.required : null],
      description: [this.data.transaction?.description || '', Validators.required],
      user: this.adminRecup,
      typeTransaction: [this.data.transaction?.typeTransaction || '', Validators.required],
    });
    this.typeTransactionService.getAllTypeTransaction().subscribe(data => {
      this.typeTransactions = data;
      console.log("liste type transactions charger: ", this.typeTransactions);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des type transaction:', error);
    });
    this.loadTypeTransactions();
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
   

  onSaves(): void {
    // if(this.adminRecup == null){
    //   Swal.fire('Erreur !', 'User non connecter', 'success');
    // }
    if (this.transactionForm.valid) {
      const transaction = this.transactionForm.value;
      if (this.isEditMode) {
        // Modifier une transaction
        this.transactionService.updateTransaction(transaction).subscribe(
          response => {
            Swal.fire('Succès !', 'Transaction modifié avec succès', 'success');
            console.log("Transaction modifier : " , response);
            this.dialogRef.close(response);
          },
          error => {
            Swal.fire('Erreur !', error.error?.message, error);
          }
        );
      } else {
        // Ajouter une transaction
        const newTransaction: Transaction = this.transactionForm.value;
        this.transactionService.addTransaction(newTransaction).subscribe(
          (response) => {
            console.log('Transaction ajouté avec succès :', response);
            this.transactionForm.reset();
            Swal.fire('Succès !', 'Transaction ajoutée avec succès', 'success');
            this.dialogRef.close(response);
          },
          (error) => {
            console.error("Erreur lors de l'ajout de la transaction :", error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message,
            });
          }
        );
      }
    }else{
      this.showValidationErrors();
    }
  }


  private showValidationErrors() {
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      if (control) {
        const controlErrors = control.errors as ValidationErrors | null; // Assertion de type
        if (controlErrors) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log(`Control ${key} has error: ${keyError}`);
          });
        }
      }
    });
  }


  private loadTypeTransactions(): void {
    this.typeTransactionService.getAllTypeTransaction().subscribe(
      (typeTransactions: TypeTransaction[]) => {
        this.typeTransactions = this.typeTransactions;
        
        // Pour le mode édition, assurez-vous que la valeur du formulaire est correctement définie
        if (this.isEditMode && this.data.transaction?.typeTransaction) {
          const typeTransaction = this.typeTransactions.find(r => r.idTypeTransaction === this.data.transaction.typeTransaction.idTypeTransaction);
          if (typeTransaction) {
            this.transactionForm.patchValue({ typeTransaction: typeTransaction });
            console.log("Type de la transaction :", typeTransaction.libelle);
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement des type transaction:', error);
      }
    );
  }

}
