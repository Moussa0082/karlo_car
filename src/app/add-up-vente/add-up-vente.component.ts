import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { VoitureVendre } from '../models/VoitureVendre';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VenteService } from '../services/vente.service';
import { Router } from '@angular/router';
import { VoitureVendreService } from '../services/voiture-vendre.service';
import Swal from 'sweetalert2';
import { Vente } from '../models/Vente';

@Component({
  selector: 'app-add-up-vente',
  templateUrl: './add-up-vente.component.html',
  styleUrls: ['./add-up-vente.component.scss']
})
export class AddUpVenteComponent implements OnInit{


  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  // imagePreview: string | ArrayBuffer | null | any = null;

  venteForm!: FormGroup;
  voituresVendre: VoitureVendre[] = [];
  images: File[]  = [];
  imagePreviews: string[] = [];
  isEditMode: boolean;

  constructor(private fb: FormBuilder, private voitureService: VoitureVendreService,
    private venteService:VenteService,
    public dialogRef: MatDialogRef<AddUpVenteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
  ) { 
    this.isEditMode =  !!data.vente;
    this.venteForm = this.fb.group({
      idVente: [this.isEditMode ? this.data.vente?.idVente : '', this.isEditMode ? Validators.required : null],
      nomClient: [this.data.vente?.nomClient || '', Validators.required],
      telephone: [this.data.vente?.telephone ||'', Validators.required],
      montant: [this.data.vente?.montant ||  '', Validators.required],
      description: [this.data.vente?.description || '', Validators.required],
      images:this.fb.array([]),
      voitureVendre: [this.data.vente?.voitureVendre ||  0, Validators.required],
     });
    

  }



  ngOnInit(): void {
    this.isEditMode =  !!this.data.vente;
    this.venteForm = this.fb.group({
      idVente: [this.isEditMode ? this.data.vente?.idVente : '', this.isEditMode ? Validators.required : null],
      nomClient: [this.data.vente?.nomClient || '', Validators.required],
      telephone: [this.data.vente?.telephone ||'', Validators.required],
      montant: [this.data.vente?.montant ||  '', Validators.required],
      description: [this.data.vente?.description || '', Validators.required],
      images:this.fb.array([]),
      voitureVendre: [this.data.vente?.voitureVendre ||  '', Validators.required],
     });
    
     this.voitureService.getAllVoituresVendre().subscribe(
      data => {
        console.log('Données reçues :', data);
    
        // Vérifiez la structure des données reçues
        if (Array.isArray(data)) {
          this.voituresVendre = data
            .filter((v: any) => v.isVendu === false); // Assurez-vous que `isVendu` est correctement orthographié
    
          // Vérifiez les données filtrées
          this.voituresVendre.forEach(v => {
            console.log("Statut voiture vendre :", v.isVendu);
          });
    
          console.log("Liste des voitures à vendre chargée :", this.voituresVendre);
        } else {
          console.error('Les données reçues ne sont pas au format attendu.');
        }
      },
      error => {
        console.error('Erreur lors du chargement de la liste des voitures à vendre :', error);
      }
    );

    this.isEditMode ? this.loadExistingImages(this.data.vente?.images) : null;
    this.isEditMode ? this.loadSelectOptions() : null;
  }

  private loadSelectOptions(): void {
    this.voitureService.getAllVoituresVendre().subscribe(
      (voituresVendre: VoitureVendre[]) => {
        this.voituresVendre = voituresVendre;
        
        // Pour le mode édition, assurez-vous que la valeur du formulaire est correctement définie
        if (this.isEditMode && this.data.vente?.voitureVendre) {
          const voitureVendre = this.voituresVendre.find(r => r.idVoiture === this.data.vente.voitureVendre.idVoiture);
          if (voitureVendre) {
            this.venteForm.patchValue({ voitureVendre: voitureVendre });
            console.log("voiture vendre  mcll:", voitureVendre.matricule + " model " + voitureVendre.modele);
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
    if (this.venteForm.valid) {
      const vente = this.venteForm.value;
      console.log('Form Data:', vente);
  
      if (this.isEditMode) {
        console.log('Edit Mode');
        this.venteService.updateVente(vente, this.images).subscribe(
          response => {
            Swal.fire('Succès !', 'Vente modifié avec succès', 'success');
            console.log("Vente modifié : ", response);
            this.dialogRef.close(response);
          },
          error => {
            console.error('Erreur lors de la modification:', error);
            Swal.fire('Erreur !', 'Erreur lors de la modification', 'error');
          }
        );
      } else {
        console.log('Add Mode');
        this.venteService.addVente(vente, this.images).subscribe(
          response => {
            console.log('Vente ajoutée avec succès :', response);
            this.venteForm.reset();
            this.images = [];
            this.imagePreviews = [];
            Swal.fire('Succès !', 'Vente ajoutée avec succès', 'success');
            this.dialogRef.close(response);
          },
          error => {
            console.error("Erreur lors de l'ajout de la vente :", error);
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
    Object.keys(this.venteForm.controls).forEach(key => {
      const control = this.venteForm.get(key);
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
