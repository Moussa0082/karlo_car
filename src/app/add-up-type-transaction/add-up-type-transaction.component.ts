import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TypeTransaction } from '../models/TypeTransaction';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TypeTransactionService } from '../services/type-transaction.service';

@Component({
  selector: 'app-add-up-type-transaction',
  templateUrl: './add-up-type-transaction.component.html',
  styleUrls: ['./add-up-type-transaction.component.scss']
})
export class AddUpTypeTransactionComponent {



  typeTransactionForm: FormGroup;
  typeTransaction:TypeTransaction | any;
  typeTransactions: TypeTransaction[] = [];
  isEditMode: boolean;
  
  constructor(
    public dialogRef: MatDialogRef<AddUpTypeTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
    private typeTransactionService:TypeTransactionService, private fb: FormBuilder
  ){
    this.isEditMode = !!data.typeTransaction; // Si un typeTransaction est passé, alors c'est le mode édition
    this.typeTransactionForm = this.fb.group({
      idTypeTransaction: [this.isEditMode ? this.data.typeTransaction?.idTypeTransaction : '', this.isEditMode ? Validators.required : null],
      libelle: [data.typeTransaction?.libelle || '', Validators.required],
    });
  }
  
  ngOnInit(): void {
    this.isEditMode = !!this.data.typeTransaction // Si un role est passé, alors c'est le mode édition
    this.typeTransactionForm = this.fb.group({
      idTypeTransaction: [this.isEditMode ? this.data.typeTransaction?.idTypeTransaction : '', this.isEditMode ? Validators.required : null],
      libelle: [this.data.typeTransaction?.libelle || '', Validators.required],
    });

    this.typeTransactionService.getAllTypeTransaction().subscribe(data =>{
      this.typeTransactions = data;
      // console.log("Liste typeTransaction:", this.typeTransactions);
    },
    (error) =>{
      // console.error('Erreur lors du chargement de la liste des typeTransactions:', error);
    }
  );

  }

  chargerDonner():void{
    this.typeTransactionService.getAllTypeTransaction().subscribe(data =>{
      this.typeTransactions = data;
      // console.log("Liste typeTransaction:", this.typeTransactions);
    },
    (error) =>{
      // console.error('Erreur lors du chargement de la liste des typeTransactions:', error);
    }
  );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
   

  onSaves(): void {
    if (this.typeTransactionForm.valid) {
      const typeTransaction = this.typeTransactionForm.value;
      if (this.isEditMode) {
        // Modifier type  transaction 
        this.typeTransactionService.updateTypeTransaction(typeTransaction).subscribe(
          response => {
            Swal.fire('Succès !', 'TypeTransaction modifié avec succès', 'success');
            // console.log("TypeTransaction modifier : " , response);
            this.dialogRef.close(response);
          },
          error => {
            Swal.fire('Erreur !', 'Erreur lors de la modification', error);
          }
        );
      } else {
        // Ajouter un typeTransaction
        const newTypeTransaction: TypeTransaction = this.typeTransactionForm.value;
        this.typeTransactionService.createTypeTransaction(newTypeTransaction).subscribe(
          (response) => {
            // console.log('Type ajouté avec succès :', response);
            this.typeTransactionForm.reset();
            Swal.fire('Succès !', 'Type transaction crée avec succès', 'success');
            this.dialogRef.close(response);
          },
          (error) => {
            console.error("Erreur lors de l'ajout du type transaction :", error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message,
            });
          }
        );
      }
    }else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs requis.',
      });
    }
  }

}
