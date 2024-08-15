import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { VoitureLouer } from '../models/VoitureLouer';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VoitureLouerService } from '../services/voiture-louer.service';
import Swal from 'sweetalert2';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-add-up-reservation',
  templateUrl: './add-up-reservation.component.html',
  styleUrls: ['./add-up-reservation.component.scss']
})
export class AddUpReservationComponent implements OnInit{


  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  // imagePreview: string | ArrayBuffer | null | any = null;

  reservationForm!: FormGroup;
  voituresLouer: VoitureLouer[] = [];
  images: File[]  = [];
  imagePreviews: string[] = [];
  isEditMode: boolean;

   constructor(private fb: FormBuilder, private voitureService: VoitureLouerService,
    private reservationService:ReservationService,
    public dialogRef: MatDialogRef<AddUpReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
  ) { 
    this.isEditMode =  !!data.reservation;
    this.reservationForm = this.fb.group({
      idReservation: [this.data.reservation?.idReservation || '', Validators.required],
      dateDebut: [this.data.reservation?.dateDebut || '', Validators.required],
      dateFin: [this.data.reservation?.dateFin || '', Validators.required],
      nomClient: [this.data.reservation?.nomClient || '', Validators.required],
      telephone: [this.data.voitureVendre?.telephone ||'', Validators.required],
      montant: [this.data.voitureVendre?.montant ||  '', Validators.required],
      description: [this.data.voitureVendre?.description || '', Validators.required],
      images:this.fb.array([]),
      voitureLouer: [this.data.voitureVendre?.prixProprietaire ||  0, Validators.required],
     });
     this.isEditMode ? this.loadExistingImages(this.data.reservation?.images) : null;
     this.isEditMode ? this.loadSelectOptions() : null;

  }

 
  
  ngOnInit(): void {
    this.isEditMode =  !!this.data.reservation;
    this.reservationForm = this.fb.group({
      idReservation: [this.data.reservation?.idReservation || '', Validators.required],
      dateDebut: [this.data.reservation?.dateDebut || '', Validators.required],
      dateFin: [this.data.reservation?.dateFin || '', Validators.required],
      nomClient: [this.data.reservation?.nomClient || '', Validators.required],
      telephone: [this.data.reservation?.telephone ||'', Validators.required],
      montant: [this.data.reservation?.montant ||  '', Validators.required],
      description: [this.data.reservation?.description || '', Validators.required],
      images:this.fb.array([]),
      voitureLouer: [this.data.reservation?.prixProprietaire ||  0, Validators.required],
     });
     this.voitureService.getAllVoituresLouer().subscribe(data => {
      this.voituresLouer = data;
      console.log("liste des voiture à louer charger: ", this.voituresLouer);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des voitures à louer:', error);
    });
  }

  private loadSelectOptions(): void {
    this.voitureService.getAllVoituresLouer().subscribe(
      (voituresLouer: VoitureLouer[]) => {
        this.voituresLouer = voituresLouer;
        
        // Pour le mode édition, assurez-vous que la valeur du formulaire est correctement définie
        if (this.isEditMode && this.data.reservation?.voitureLouer) {
          const voitureLouer = this.voituresLouer.find(r => r.idVoiture === this.data.reservation.voitureLouer.idVoiture);
          if (voitureLouer) {
            this.reservationForm.patchValue({ voitureLouer: voitureLouer });
            console.log("voiture louer pour la livrason  mcll:", voitureLouer.matricule + " model " + voitureLouer.modele);
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement de la voitures à louer pour la livraison :', error);
      }
    );

  }


  // Méthode pour charger les images existantes
  private loadExistingImages(logoPaths: string[]): void {
    if (logoPaths && logoPaths.length > 0) {
      this.imagePreviews = logoPaths.map(path => `http://localhost/${path}`);
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaves(): void {
    if (this.reservationForm.valid) {
      const reservation = this.reservationForm.value;
      console.log('Form Data:', reservation);
  
      if (this.isEditMode) {
        console.log('Edit Mode');
        this.reservationService.updateReservation(reservation, this.images).subscribe(
          response => {
            Swal.fire('Succès !', 'Reservation modifié avec succès', 'success');
            console.log("Reservation modifié : ", response);
            this.dialogRef.close(response);
          },
          error => {
            console.error('Erreur lors de la modification:', error);
            Swal.fire('Erreur !', 'Erreur lors de la modification', 'error');
          }
        );
      } else {
        console.log('Add Mode');
        this.reservationService.addReservation(reservation, this.images).subscribe(
          response => {
            console.log('Reservation ajoutée avec succès :', response);
            this.reservationForm.reset();
            this.images = [];
            this.imagePreviews = [];
            Swal.fire('Succès !', 'Reservation faite avec succès', 'success');
            this.dialogRef.close(response);
          },
          error => {
            console.error("Erreur lors de l'ajout de la reservation :", error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message,
            });
          }
        );
      }
    } else {
      this.showValidationErrors();
    }
  }


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files) {
      const files = Array.from(input.files);
  
      // Réinitialiser les images sélectionnées et les aperçus
      this.images = [];
      this.imagePreviews = [];
  
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          this.imagePreviews.push(imageUrl); // Ajouter l'aperçu au tableau
        };
        reader.readAsDataURL(file);
  
        // Ajouter le fichier à la liste des images sélectionnées
        this.images.push(file);
      });
  
      input.value = ''; // Réinitialiser le champ pour éviter des problèmes
    }
  }

  editImage(index: number): void {
    const newFileInput = document.createElement('input');
    newFileInput.type = 'file';
    newFileInput.accept = 'image/*';
    newFileInput.onchange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          this.imagePreviews[index] = imageUrl;
        };
        reader.readAsDataURL(file);
      }
    };
    newFileInput.click();
  }

   // Méthode pour supprimer une image
   removeImage(index: number): void {
    // Supprime l'image à l'index spécifié
    this.imagePreviews.splice(index, 1);
  }

  private showValidationErrors() {
    Object.keys(this.reservationForm.controls).forEach(key => {
      const control = this.reservationForm.get(key);
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



}

 