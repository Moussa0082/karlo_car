import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { VoitureLouer } from '../models/VoitureLouer';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VoitureLouerService } from '../services/voiture-louer.service';
import Swal from 'sweetalert2';
import { ReservationService } from '../services/reservation.service';
import { formatDate } from '@angular/common';
import { debounceTime } from 'rxjs';

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
  mtLocationMin!:number;
  mtLocation!:number;
  dateDebut: Date | null = null;
  selectedVoiture!:VoitureLouer;

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
      telephone: [this.data.reservation?.telephone ||'', Validators.required],
      montant: [this.data.reservation?.montant ||  '', Validators.required],
      description: [this.data.reservation?.description || '', Validators.required],
      images:this.fb.array([]),
      voitureLouer: [this.data.reservation?.voitureLouer ||  '', Validators.required],
     });
    //  this.isEditMode ? this.loadExistingImages(this.data.reservation?.images) : null;
     this.isEditMode ? this.loadSelectOptions() : null;

  }

 
  
  ngOnInit(): void {
    this.isEditMode =  !!this.data.reservation;
    this.reservationForm = this.fb.group({
      idReservation: [this.isEditMode ? this.data.reservation?.idReservation : '', this.isEditMode ? Validators.required : null],
      dateDebut: [this.data.reservation?.dateDebut || '', Validators.required],
      dateFin: [this.data.reservation?.dateFin || '', Validators.required],
      nomClient: [this.data.reservation?.nomClient || '', Validators.required],
      telephone: [this.data.reservation?.telephone ||'', Validators.required],
      montant: [this.data.reservation?.montant ||  '', Validators.required],
      description: [this.data.reservation?.description || '', Validators.required],
      images:this.fb.array([]),
      voitureLouer: [this.data.reservation?.voitureLouer ||  '', Validators.required],
     });

    

     this.voitureService.getAllVoituresLouer().subscribe(
      data => {
        // console.log('Données reçues :', data);
    
        // Vérifiez la structure des données reçues
        if (Array.isArray(data)) {
          this.voituresLouer = data
            .filter((v: any) => v.isDisponible === true); // Assurez-vous que `isDisponible` est correctement orthographié
    
          // Vérifiez les données filtrées
          this.voituresLouer.forEach(v => {
            // console.log("Statut voiture louée :", v.isDisponible);
          });
    
          // console.log("Liste des voitures à louer chargée :", this.voituresLouer);
        } else {
          // console.error('Les données reçues ne sont pas au format attendu.');
        }
      },
      error => {
        // console.error('Erreur lors du chargement de la liste des voitures à louer :', error);
      }
    );
    this.isEditMode ? this.loadSelectOptions() : null;
    this.isEditMode ? this.loadImages() : null;
     
  }

    // Fonction pour formater en français
  // formatFrenchDate(date: Date): string {
  //   const options: Intl.DateTimeFormatOptions = { 
  //     weekday: 'long', 
  //     year: 'numeric', 
  //     month: 'long', 
  //     day: 'numeric', 
  //     hour: 'numeric', 
  //     minute: 'numeric' 
  //   };
  //   return date.toLocaleDateString('fr-FR', options);
  // }


  onDateDebutChange(event: any) {
    const selectedDate: Date = new Date(event.value);
  
    // Formater la date en français
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',    // Affiche le jour complet ("vendredi")
      year: 'numeric',    // Affiche l'année
      month: 'long',      // Affiche le mois complet ("septembre")
      day: 'numeric',     // Affiche le jour du mois
      hour: '2-digit',    // Affiche l'heure
      minute: '2-digit',  // Affiche les minutes
      second: '2-digit'   // Affiche les secondes
    }).format(selectedDate);
  
    // Imprimer la date formatée dans la console
    console.log("formated date" ,formattedDate);
  
    this.dateDebut = selectedDate;
  
    const dateFin: Date = new Date(this.reservationForm.get('dateFin')?.value);
  
    // Comparer les deux dates
    if (dateFin && dateFin < selectedDate) {
      // Réinitialiser la date de fin si elle est antérieure à la date de début
      this.reservationForm.get('dateFin')?.setValue(null);
    }
  }
  
  

  onVoitureSelectionChange(voiture: VoitureLouer) {
    this.selectedVoiture = voiture; // Mise à jour de la voiture sélectionnée
    const montantControl = this.reservationForm.get('montant');
    if (this.selectedVoiture && montantControl) {
      montantControl.setValue(this.selectedVoiture.prixAugmente);
      // console.log("mt" , montantControl)
      montantControl.setValidators([Validators.required, Validators.min(this.selectedVoiture.prixAugmente)]);
     
    }
  }

  onMontantChange(event:Event): void {

    const inputElement = event.target as HTMLInputElement;
    const montant = parseFloat(inputElement.value);    
    const prixAugmentation = this.selectedVoiture.prixAugmente;
    
    if (montant && montant < prixAugmentation) {
      Swal.fire({
        icon: 'error',
        title: 'Montant insuffisant',
        text: `Le montant ne peut pas être inférieur à ${prixAugmentation} pour la voiture sélectionnée.`,
      });
    
      // Réinitialiser le montant à la valeur minimale (prixAugmentation)
      inputElement.value = prixAugmentation.toString();
      this.reservationForm.get('montant')?.setValue(prixAugmentation);
    }
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
            // console.log("voiture louer pour la livrason  mcll:", voitureLouer.matricule + " model " + voitureLouer.modele);
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement de la voitures à louer pour la livraison :', error);
      }
    );

  }


  // Méthode pour charger les images existantes
  // private loadExistingImages(logoPaths: string[]): void {
  //   if (logoPaths && logoPaths.length > 0) {
  //     this.imagePreviews = logoPaths.map(path => `http://localhost/${path}`);
  //   }
  // }


  onNoClick(): void {
    this.dialogRef.close();
  }

  formatFrenchDate(date: Date): string {
    return formatDate(date, 'EEEE dd MMMM yyyy HH:mm', 'fr-FR');
  }

  onSaves(): void {
    // Récupérer les valeurs des dates brutes
    const dateDebut = this.reservationForm.get('dateDebut')?.value;
    const dateFin = this.reservationForm.get('dateFin')?.value;
  
    // Vérification des dates et formatage en français
    const formattedDateDebut = this.formatFrenchDate(new Date(dateDebut));
    const formattedDateFin = this.formatFrenchDate(new Date(dateFin));
  
    console.log("Date Début formatée: ", formattedDateDebut);
    console.log("Date Fin formatée: ", formattedDateFin);
  
    // Mettre à jour les contrôles de formulaire avec les dates formatées
    this.reservationForm.get('dateDebut')?.setValue(formattedDateDebut);
    this.reservationForm.get('dateFin')?.setValue(formattedDateFin);
  
    // Vérifier les valeurs du formulaire après mise à jour des dates
    const formData = this.reservationForm.value;
    console.log("Données envoyées : ", formData);
  
    // Vérification de la validité du formulaire avant soumission
    if (this.reservationForm.valid) {
      const reservation = this.reservationForm.value;
  
      if (this.isEditMode) {
        this.reservationService.updateReservation(reservation, this.images).subscribe(
          response => {
            Swal.fire('Succès !', 'Réservation modifiée avec succès', 'success');
            this.dialogRef.close(response);
          },
          error => {
            console.error('Erreur lors de la modification:', error);
            Swal.fire('Erreur !', 'Erreur lors de la modification', 'error');
          }
        );
      } else {
        this.reservationService.addReservation(reservation, this.images).subscribe(
          response => {
            this.reservationForm.reset();
            this.images = [];
            this.imagePreviews = [];
            Swal.fire('Succès !', 'Réservation effectuée avec succès', 'success');
            this.dialogRef.close(response);
          },
          error => {
            console.error("Erreur lors de l'ajout de la réservation :", error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message,
            });
          }
        );
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs requis.',
      });
    }
  }
  

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files) {
      const files = Array.from(input.files);
  
      // // Réinitialiser les images sélectionnées et les aperçus
      // this.images = [];
      // this.imagePreviews = [];
  
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


  private loadImages(): any {
    if (this.data.reservation && this.data.reservation.images && this.data.reservation.images.length > 0) {
      this.data.reservation.images.forEach((imageName: string) => {
        const imageUrl = this.reservationService.getImageUrl(this.data.reservation.idReservation, imageName);
        this.imagePreviews.push(imageUrl);  // Ajouter l'URL complète de l'image au tableau
        // console.log("Image URL chargée", this.imagePreviews);
      }
    );
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
            // console.log(`Control ${key} has error: ${keyError}`);
          });
        }
      }
    });
  }



}

 