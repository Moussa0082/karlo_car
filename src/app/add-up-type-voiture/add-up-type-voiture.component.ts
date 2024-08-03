import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TypeVoiture } from '../models/TypeVoiture';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TypeVoitureService } from '../services/type-voiture.service';

@Component({
  selector: 'app-add-up-type-voiture',
  templateUrl: './add-up-type-voiture.component.html',
  styleUrls: ['./add-up-type-voiture.component.scss']
})
export class AddUpTypeVoitureComponent implements OnInit{



  typeVoitureForm!: FormGroup;
  typeVoiture:TypeVoiture | any;
  typesVoitures: TypeVoiture[] = [];
  isEditMode: boolean;
  
  constructor(
    public dialogRef: MatDialogRef<AddUpTypeVoitureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
    private typeVoitureService:TypeVoitureService, private fb: FormBuilder
  ){
    this.isEditMode = !!data.typeVoiture; // Si un type voiture est passé, alors c'est le mode édition
    this.typeVoitureForm = this.fb.group({
      idTypeVoiture: [this.isEditMode ? this.data.typeVoiture?.idTypeVoiture : '', this.isEditMode ? Validators.required : null],
      nomTypeVoiture: [data.typeVoiture?.nomTypeVoiture || '', Validators.required],
      description: [data.typeVoiture?.description || '', Validators.required],
    });
  }
  
  ngOnInit(): void {
    this.isEditMode = !!this.data.typeVoiture; // Si un TypeVoiture est passé, alors c'est le mode édition
    this.typeVoitureForm = this.fb.group({
      idTypeVoiture: [this.isEditMode ? this.data.typeVoiture?.idTypeVoiture : '', this.isEditMode ? Validators.required : null],
      nomTypeVoiture: [this.data.typeVoiture?.nomTypeVoiture || '', Validators.required],
      description: [this.data.typeVoiture?.description || '', Validators.required],
    });

    this.typeVoitureService.getAllTypeVoiture().subscribe(data =>{
      this.typesVoitures = data;
      console.log("Liste type voiture:", this.typesVoitures);
    },
    (error) =>{
      console.error('Erreur lors du chargement de la liste des type voiture:', error);
    }
  );

  }

  chargerDonner():void{
    this.typeVoitureService.getAllTypeVoiture().subscribe(data =>{
      this.typesVoitures = data;
      console.log("Liste type voiture:", this.typesVoitures);
    },
    (error) =>{
      console.error('Erreur lors du chargement de la liste des type voiture:', error);
    }
  );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
   

  onSaves(): void {
    if (this.typeVoitureForm.valid) {
      const typeVoiture = this.typeVoitureForm.value;
      if (this.isEditMode) {
        // Modifier type voiture
        this.typeVoitureService.updateTypeVoiture(typeVoiture).subscribe(
          response => {
            Swal.fire('Succès !', 'Type voiture modifié avec succès', 'success');
            console.log("type voiture modifier : " , response);
            this.dialogRef.close(response);
          },
          error => {
            Swal.fire('Erreur !', 'Erreur lors de la modification', error);
          }
        );
      } else {
        // Ajouter un type voiture
        const newTypeVoiture: TypeVoiture = this.typeVoitureForm.value;
        this.typeVoitureService.createTypeVoiture(newTypeVoiture).subscribe(
          (response) => {
            console.log('Type Voiture ajouté avec succès :', response);
            this.typeVoitureForm.reset();
            Swal.fire('Succès !', 'Type Voiture crée avec succès', 'success');
            this.dialogRef.close(response);
          },
          (error) => {
            console.error("Erreur lors de l'ajout du type voiture :", error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message,
            });
          }
        );
      }
    }
  }

}
