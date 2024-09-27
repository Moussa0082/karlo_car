import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Marque } from '../models/Marque';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MarqueService } from '../services/marque.service';

@Component({
  selector: 'app-add-up-marque',
  templateUrl: './add-up-marque.component.html',
  styleUrls: ['./add-up-marque.component.scss']
})
export class AddUpMarqueComponent implements OnInit{

  marqueForm!: FormGroup;
  marque:Marque | any;
  marques: Marque[] = [];
  isEditMode: boolean;
  logo!:File;

  // public imagePreview: string | ArrayBuffer | null = '../../../assets/images/preview.jpeg';
   
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  imagePreview: string | ArrayBuffer | null = null;
  
  constructor(
    public dialogRef: MatDialogRef<AddUpMarqueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
    private marqueService:MarqueService, private fb: FormBuilder
  ){
    this.isEditMode = !!data.marque; // Si une marque est passé, alors c'est le mode édition
    this.marqueForm = this.fb.group({
      idMarque: [this.isEditMode ? this.data.marque?.idMarque : '', this.isEditMode ? Validators.required : null],
      nomMarque: [data.marque?.nomMarque || '', Validators.required],
      logo: [null],

    });
  }
  
  ngOnInit(): void {
    this.isEditMode = !!this.data.marque; // Si une marque est passé, alors c'est le mode édition
    this.marqueForm = this.fb.group({
      idMarque: [this.isEditMode ? this.data.marque?.idMarque : '', this.isEditMode ? Validators.required : null],
      nomMarque: [this.data.marque?.nomMarque || '', Validators.required],
      logo: [null],
    });
    this.isEditMode ? this.loadExistingImage(this.data.marque?.idMarque+"/image") : null;
    this.marqueService.getAllMarque().subscribe(data =>{
      this.marques = data;
      // console.log("Liste marques:", this.marques);
    },
    (error) =>{
      console.error('Erreur lors du chargement de la liste des marques:', error);
    }
  );

  }


  // private loadExistingImage(imagePath: string): void {
  //   // Construct the URL for the existing image
  //   const imageUrl = `http://localhost/${imagePath}`;
  //   this.imagePreview = imageUrl;
  // }
  private loadExistingImage(imagePath: string): void {
    // Construct the URL for the existing image
    const imageUrl = `http://185.194.216.57:9000/marque/${imagePath}`;
    this.imagePreview = imageUrl;
  }


  // onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     const file = input.files[0];
  //     const reader = new FileReader();
      
  //     reader.onload = () => {
  //       this.imagePreview = reader.result;
  //     };
      
  //     reader.readAsDataURL(file);
  //     this.marqueForm.patchValue({
  //       logo: file
  //     });
  //   }
  // }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      
      reader.readAsDataURL(file);
      this.logo = file; // Mettre à jour la propriété locale
      // Reset the file input value to avoid issues
      input.value = '';
    }
  }

  //Afficher le lien de l'image
  ImageChange(event:any){
    this.logo = event.target.files[0];
    // console.log("Image uploiarder ", this.logo);
  }

  chargerDonner():void{
    this.marqueService.getAllMarque().subscribe(data =>{
      this.marques = data;
      // console.log("Liste marque:", this.marques);
    },
    (error) =>{
      console.error('Erreur lors du chargement de la liste des marques:', error);
    }
  );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
   

  onSaves(): void {
    if (this.logo == null ) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Une image est requise pour representer le logo de la marque',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return

    }
    if (this.marqueForm.valid && this.logo) {
      const marque = this.marqueForm.value;
      if (this.isEditMode) {
        // console.log("marque value :" ,marque);
        // Modifier marque
        this.marqueService.updateMarque(this.data.marque.idMarque, marque, this.logo).subscribe(
          response => {
            Swal.fire('Succès !', 'Marque modifié avec succès', 'success');
            // console.log("marque modifier : " , response);
            this.dialogRef.close(response);
          },
          error => {
            Swal.fire('Erreur !', 'Erreur lors de la modification', error);
          }
        );
      } else {
        // Ajouter une marque
        const newMarque: Marque = this.marqueForm.value;
        // console.log("marque value :" ,newMarque);

        this.marqueService.createMarque(newMarque, this.logo).subscribe(
          (response) => {
            // console.log('Marque ajouté avec succès :', response);
            this.marqueForm.reset();
            Swal.fire('Succès !', 'Marque crée avec succès', 'success');
            this.dialogRef.close(response);
          },
          (error) => {
            console.error("Erreur lors de l'ajout de la marque :", error);
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

  private showValidationErrors() {
    Object.keys(this.marqueForm.controls).forEach(key => {
      const control = this.marqueForm.get(key);
      if (control) {
        const controlErrors = control.errors as ValidationErrors | null; // Assertion de type
        if (controlErrors) {
          Object.keys(controlErrors).forEach(keyError => {
            // console.log(`Control ${key} has error: ${keyError}`);
          });
        }
      }
    });
  }

}
