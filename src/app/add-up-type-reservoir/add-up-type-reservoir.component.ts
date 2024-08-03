import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddUpUserComponent } from '../add-up-user/add-up-user.component';
import Swal from 'sweetalert2';
import { TypeReservoir } from '../models/TypeReservoir';
import { ReservoirService } from '../services/reservoir.service';
@Component({
  selector: 'app-add-up-type-reservoir',
  templateUrl: './add-up-type-reservoir.component.html',
  styleUrls: ['./add-up-type-reservoir.component.scss']
})
export class AddUpTypeReservoirComponent implements OnInit {
  
  typeReservoirForm: FormGroup;
  typeReservoir:TypeReservoir | any;
  typeReservoires: TypeReservoir[] = [];
  isEditMode: boolean;
  
  constructor(
    public dialogRef: MatDialogRef<AddUpTypeReservoirComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
    private typeReservoireService:ReservoirService, private fb: FormBuilder
  ){
    this.isEditMode = !!data.typeReservoir; // Si un type reservoir est passé, alors c'est le mode édition
    this.typeReservoirForm = this.fb.group({
      idTypeReservoir: [this.isEditMode ? this.data.typeReservoir?.idTypeReservoir : '', this.isEditMode ? Validators.required : null],
      nomTypeReservoir: [data.typeReservoir?.nomTypeReservoir || '', Validators.required],
      description: [data.typeReservoir?.description || '', Validators.required],
    });
  }
  
  ngOnInit(): void {
    this.isEditMode = !!this.data.typeReservoir; // Si un type reservoir est passé, alors c'est le mode édition
    this.typeReservoirForm = this.fb.group({
      idTypeReservoir: [this.isEditMode ? this.data.typeReservoir?.idTypeReservoir : '', this.isEditMode ? Validators.required : null],
      nomTypeReservoir: [this.data.typeReservoir?.nomTypeReservoir || '', Validators.required],
      description: [this.data.typeReservoir?.description || '', Validators.required],
    });

    this.typeReservoireService.getAllTypeReservoir().subscribe(data =>{
      this.typeReservoires = data;
      console.log("Liste type reservoir :", this.typeReservoires);
    },
    (error) =>{
      console.error('Erreur lors du chargement de la liste des type reservoirs:', error);
    }
  );

  }

  chargerDonner():void{
    this.typeReservoireService.getAllTypeReservoir().subscribe(data =>{
      this.typeReservoires = data;
      console.log("Liste type reservoirs:", this.typeReservoires);
    },
    (error) =>{
      console.error('Erreur lors du chargement de la liste des type reservoirs:', error);
    }
  );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
   

  onSaves(): void {
    if (this.typeReservoirForm.valid) {
      const typeReservoir = this.typeReservoirForm.value;
      if (this.isEditMode) {
        // Modifier typeReservoirForm
        this.typeReservoireService.updateTypeReservoire(typeReservoir).subscribe(
          response => {
            Swal.fire('Succès !', 'Type Reservoir modifié avec succès', 'success');
            console.log("typeReservoir modifier : " , response);
            this.dialogRef.close(response);
          },
          error => {
            Swal.fire('Erreur !', 'Erreur lors de la modification', error);
          }
        );
      } else {
        // Ajouter un typeReservoir
        const newTypeReservoir: TypeReservoir = this.typeReservoirForm.value;
        this.typeReservoireService.createTypeReservoire(newTypeReservoir).subscribe(
          (response) => {
            console.log('Type Reservoir ajouté avec succès :', response);
            this.typeReservoirForm.reset();
            Swal.fire('Succès !', 'Rôle crée avec succès', 'success');
            this.dialogRef.close(response);
          },
          (error) => {
            console.error("Erreur lors de l'ajout du type reservoir :", error);
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
