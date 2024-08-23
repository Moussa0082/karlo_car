import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Marque } from '../models/Marque';
import { User } from '../models/User';
import { TypeVoiture } from '../models/TypeVoiture';
import { TypeReservoir } from '../models/TypeReservoir';
import { MarqueService } from '../services/marque.service';
import { TypeVoitureService } from '../services/type-voiture.service';
import { UserService } from '../services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VoitureVendreService } from '../services/voiture-vendre.service';
import { Router } from '@angular/router';
import { ReservoirService } from '../services/reservoir.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-up-voiture-vendre',
  templateUrl: './add-up-voiture-vendre.component.html',
  styleUrls: ['./add-up-voiture-vendre.component.scss']
})
export class AddUpVoitureVendreComponent implements OnInit{


  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  // imagePreview: string | ArrayBuffer | null | any = null;

  voitureVendreForm!: FormGroup;
  marques: Marque[] = [];
  users: User[] = [];
  typeVoitures: TypeVoiture[] = [];
  typeReservoirs: TypeReservoir[]  = [];
  images: File[]  = [];
  imagePreviews: string[] = [];
  isEditMode: boolean;
  imageUrls: string[] = [];  // Stocker les URLs des images de la voiture


  constructor(private fb: FormBuilder, private voitureService: VoitureVendreService,
    public dialogRef: MatDialogRef<AddUpVoitureVendreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
    private userService:UserService,
    private typeVoitureService : TypeVoitureService, 
    private typeReservoirService:ReservoirService ,
    private marqueservice : MarqueService,
  ) { 
    this.isEditMode =  !!data.voitureVendre;
    this.voitureVendreForm = this.fb.group({
      matricule: [this.data.voitureVendre?.matricule || '', Validators.required],
      modele: [this.data.voitureVendre?.modele ||'', Validators.required],
      annee: [this.data.voitureVendre?.annee ||  '', Validators.required],
      typeBoite: [this.data.voitureVendre?.typeBoite || '', Validators.required],
      nbPortiere: [this.data.voitureVendre?.nbPortiere || 0, Validators.required],
      prixProprietaire: [this.data.voitureVendre?.prixProprietaire ||  0, Validators.required],
      prixAugmente: [ this.data.voitureVendre?.prixAugmente || 0, Validators.required],
      images: this.fb.array([]), // Changez ici pour un tableau
      marque: [this.data.voitureVendre?.marque || '', Validators.required],
      typeVoiture: [this.data.voitureVendre?.typeVoiture || '', Validators.required],
      typeReservoir: [this.data.voitureVendre?.typeReservoir || '' , Validators.required],
      user: [this.data.voitureVendre?.user || '' , Validators.required]
    });
  }

  ngOnInit(): void {
    this.isEditMode =  !!this.data.voitureVendre;
    // this.isEditMode ? this.loadExistingImages(this.data.voitureVendre?.images) : null;
    
    this.voitureVendreForm = this.fb.group({
      idVoiture: [ this.isEditMode ? this.data.voitureVendre?.idVoiture : '', this.isEditMode ? Validators.required : null],
      matricule: [this.data.voitureVendre?.matricule || '', Validators.required],
      modele: [this.data.voitureVendre?.modele ||'', Validators.required],
      annee: [this.data.voitureVendre?.annee ||  '', Validators.required],
      typeBoite: [this.data.voitureVendre?.typeBoite || '', Validators.required],
      nbPortiere: [this.data.voitureVendre?.nbPortiere || 0, Validators.required],
      prixProprietaire: [this.data.voitureVendre?.prixProprietaire ||  0, Validators.required],
      prixAugmente: [ this.data.voitureVendre?.prixAugmente || 0, Validators.required],
      images: this.fb.array([]), // Changez ici pour un tableau
      marque: [this.data.voitureVendre?.marque || '', Validators.required],
      typeVoiture: [this.data.voitureVendre?.typeVoiture || '', Validators.required],
      typeReservoir: [this.data.voitureVendre?.typeReservoir || '' , Validators.required],
      user: [this.data.voitureVendre?.user || '' , Validators.required]
    });

    
    this.typeReservoirService.getAllTypeReservoir().subscribe(data => {
      this.typeReservoirs = data;
      console.log("liste type reservoir charger: ", this.typeReservoirs);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des type reservoirs:', error);
    });
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        // .filter((user:any) => user.role.libelle != "Admin");
        // // console.log(this.demandes.utilisateur.nom)
        // // console.log(this.demandes.utilisateur.nom)
        // this.users.forEach(user => {
        //   console.log(user.role?.libelle);
        // });
      },
      
      (error) => {
        console.error('Erreur lors du chargement de la liste des users:', error);
      }
    );
    this.typeVoitureService.getAllTypeVoiture().subscribe(data => {
      this.typeVoitures = data;
      console.log("liste type voiture charger: ", this.typeVoitures);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des type voiture:', error);
    });
    this.marqueservice.getAllMarque().subscribe(data => {
      this.marques = data;
      console.log("liste marque charger: ", this.marques);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des marques:', error);
    });
   this.isEditMode ? this.loadSelectOptions() : null ;
   this.isEditMode ? this.loadImages() : null ;
  }

  private loadSelectOptions(): void {
    this.marqueservice.getAllMarque().subscribe(
      (marques: Marque[]) => {
        this.marques = marques;
        
        // Pour le mode édition, assurez-vous que la valeur du formulaire est correctement définie
        if (this.isEditMode && this.data.voitureVendre?.marque) {
          const marque = this.marques.find(r => r.idMarque === this.data.voitureVendre.marque.idMarque);
          if (marque) {
            this.voitureVendreForm.patchValue({ marque: marque });
            console.log("marque de la voiture :", marque.nomMarque);
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement des marques:', error);
      }
    );
    this.typeReservoirService.getAllTypeReservoir().subscribe(
      (typeReservoirs: TypeReservoir[]) => {
        this.typeReservoirs = typeReservoirs;
        
        // Pour le mode édition, assurez-vous que la valeur du formulaire est correctement définie
        if (this.isEditMode && this.data.voitureVendre?.typeReservoir) {
          const typeReservoir = this.typeReservoirs.find(r => r.idTypeReservoir === this.data.voitureVendre.typeReservoir.idTypeReservoir);
          if (typeReservoir) {
            this.voitureVendreForm.patchValue({ typeReservoir: typeReservoir });
            console.log("typeReservoir de la voiture :", typeReservoir.nomTypeReservoir);
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement des typeReservoirs:', error);
      }
    );
    this.typeVoitureService.getAllTypeVoiture().subscribe(
      (typeVoitures: TypeVoiture[]) => {
        this.typeVoitures = typeVoitures;
        
        // Pour le mode édition, assurez-vous que la valeur du formulaire est correctement définie
        if (this.isEditMode && this.data.voitureVendre?.typeVoiture) {
          const typeVoiture = this.typeVoitures.find(r => r.idTypeVoiture === this.data.voitureVendre.typeVoiture.idTypeVoiture);
          if (typeVoiture) {
            this.voitureVendreForm.patchValue({ typeVoiture: typeVoiture });
            console.log("type de la voiture :", typeVoiture?.nomTypeVoiture);
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement des typeVoitures:', error);
      }
    );
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users;
        
        // Pour le mode édition, assurez-vous que la valeur du formulaire est correctement définie
        if (this.isEditMode && this.data.voitureVendre?.user) {
          const user = this.users.find(r => r.idUser === this.data.voitureVendre.user.idUser);
          if (user) {
            this.voitureVendreForm.patchValue({ user: user });
            console.log("utilisateur :", user?.nomUser);
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement des utilisateurs de la voiture à louer:', error);
      }
    );
  }

  private loadImages(): void {
    if (this.data.voitureVendre && this.data.voitureVendre.images && this.data.voitureVendre.images.length > 0) {
      this.data.voitureVendre.images.forEach((imageName: string) => {
        const imageUrl = this.voitureService.getImageUrl(this.data.voitureVendre.idVoiture, imageName);
        this.imageUrls.push(imageUrl);  // Ajouter l'URL complète de l'image au tableau
        console.log("Image URL chargée", this.imageUrls);
      });
    }
  }

   // Méthode pour charger les images existantes
  //  private loadExistingImages(logoPaths: string[]): void {
  //   if (logoPaths && logoPaths.length > 0) {
  //     this.imagePreviews = logoPaths.map(path => `http://localhost/${path}`);
  //   }
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaves(): void {
    if (this.voitureVendreForm.valid) {
      const voitureVendre = this.voitureVendreForm.value;
      console.log('Form Data:', voitureVendre);
  
      if (this.isEditMode) {
        console.log('Edit Mode');
        this.voitureService.updateVoitureVendre(voitureVendre, this.images).subscribe(
          response => {
            Swal.fire('Succès !', 'Voiture à louer modifié avec succès', 'success');
            console.log("Voiture à louer modifié : ", response);
            this.dialogRef.close(response);
          },
          error => {
            console.error('Erreur lors de la modification:', error);
            Swal.fire('Erreur !', 'Erreur lors de la modification', 'error');
          }
        );
      } else {
        console.log('Add Mode');
        this.voitureService.addVoitureVendre(voitureVendre, this.images).subscribe(
          response => {
            console.log('Voiture à vendre ajoutée avec succès :', response);
            this.voitureVendreForm.reset();
            this.images = [];
            this.imagePreviews = [];
            Swal.fire('Succès !', 'Voiture à vendre créé avec succès', 'success');
            this.dialogRef.close(response);
          },
          error => {
            console.error("Erreur lors de l'ajout de la voiture à vendre :", error);
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
  
      // // Réinitialiser les images sélectionnées et les aperçus
      // this.images = [];
      // this.imagePreviews = [];
  
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          this.imageUrls.push(imageUrl); // Ajouter l'aperçu au tableau
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
    Object.keys(this.voitureVendreForm.controls).forEach(key => {
      const control = this.voitureVendreForm.get(key);
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
