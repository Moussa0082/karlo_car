import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Marque } from '../models/Marque';
import { TypeVoiture } from '../models/TypeVoiture';
import { TypeReservoir } from '../models/TypeReservoir';
import { VoitureLouerService } from '../services/voiture-louer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddUpUserComponent } from '../add-up-user/add-up-user.component';
import { Router } from '@angular/router';
import { TypeVoitureService } from '../services/type-voiture.service';
import { ReservoirService } from '../services/reservoir.service';
import { MarqueService } from '../services/marque.service';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import {MatRadioModule} from '@angular/material/radio';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-up-vlpart',
  templateUrl: './add-up-vlpart.component.html',
  styleUrls: ['./add-up-vlpart.component.scss']
})
export class AddUpVLPartComponent  implements OnInit{

  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  // imagePreview: string | ArrayBuffer | null | any = null;

  voitureLouerForm!: FormGroup;
  marques: Marque[] = [];
  adminRecup!: User  | null;
  users: User[] = [];
  typeVoitures: TypeVoiture[] = [];
  typeReservoirs: TypeReservoir[]  = [];
  images: File[]  = [];
  imagePreviews: string[] = [];
  isEditMode: boolean;
  userSubscription!: Subscription;


  constructor(private fb: FormBuilder, private voitureService: VoitureLouerService,
    public dialogRef: MatDialogRef<AddUpVLPartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
    private userService:UserService,
    private typeVoitureService : TypeVoitureService, 
    private typeReservoirService:ReservoirService ,
    private marqueservice : MarqueService,
  ) { 
    this.userSubscription = this.userService.getUtilisateurConnect().subscribe(user => {
      this.adminRecup = user;
      // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
    }); 
    this.isEditMode =  !!data.voitureLouer;
    this.voitureLouerForm = this.fb.group({
      matricule: [this.data.voitureLouer?.matricule || '', Validators.required],
      modele: [this.data.voitureLouer?.modele ||'', Validators.required],
      annee: [this.data.voitureLouer?.annee ||  '', Validators.required],
      typeBoite: [this.data.voitureLouer?.typeBoite || '', Validators.required],
      nbPortiere: [this.data.voitureLouer?.nbPortiere || 0, Validators.required],
      prixProprietaire: [this.data.voitureLouer?.prixProprietaire ||  0, Validators.required],
      prixAugmente: [ this.data.voitureLouer?.prixAugmente || 0, Validators.required],
      isChauffeur: [this.data.voitureLouer?.isChauffeur || false],
      images: this.fb.array([]), // Changez ici pour un tableau
      marque: [this.data.voitureLouer?.marque || '', Validators.required],
      typeVoiture: [this.data.voitureLouer?.typeVoiture || '', Validators.required],
      typeReservoir: [this.data.voitureLouer?.typeReservoir || '' , Validators.required],
      user: this.adminRecup,
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.getUtilisateurConnect().subscribe(user => {
      this.adminRecup = user;
      // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
    });
    this.isEditMode =  !!this.data.voitureLouer;
    this.voitureLouerForm = this.fb.group({
      idVoiture: [ this.isEditMode ? this.data.voitureLouer?.idVoiture : '', this.isEditMode ? Validators.required : null],
      matricule: [this.data.voitureLouer?.matricule || '', Validators.required],
      modele: [this.data.voitureLouer?.modele ||'', Validators.required],
      annee: [this.data.voitureLouer?.annee ||  '', Validators.required],
      typeBoite: [this.data.voitureLouer?.typeBoite || '', Validators.required],
      nbPortiere: [this.data.voitureLouer?.nbPortiere || 0, Validators.required],
      prixProprietaire: [this.data.voitureLouer?.prixProprietaire ||  0, Validators.required],
      prixAugmente: [ this.data.voitureLouer?.prixAugmente || 0, Validators.required],
      isChauffeur: [this.data.voitureLouer?.isChauffeur || false],
      images: this.fb.array([]), // Changez ici pour un tableau
      marque: [this.data.voitureLouer?.marque || '', Validators.required],
      typeVoiture: [this.data.voitureLouer?.typeVoiture || '', Validators.required],
      typeReservoir: [this.data.voitureLouer?.typeReservoir || '' , Validators.required],
      user: [this.data.voitureLouer?.user || '' , Validators.required]
    });
    this.isEditMode ? this.loadExistingImages(this.data.voitureLouer?.images) : null;

    // Abonnez-vous aux changements de valeur pour le contrôle isChauffeur
    this.voitureLouerForm.get('isChauffeur')?.valueChanges.subscribe(value => {
      this.onIsChauffeurChange(value);
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
    this.loadSelectOptions();
  }

   // Méthode pour charger les images existantes
   private loadExistingImages(logoPaths: string[]): void {
    if (logoPaths && logoPaths.length > 0) {
      this.imagePreviews = logoPaths.map(path => `http://localhost/${path}`);
    }
  }


  private loadSelectOptions(): void {
    this.marqueservice.getAllMarque().subscribe(
      (marques: Marque[]) => {
        this.marques = marques;
        
        // Pour le mode édition, assurez-vous que la valeur du formulaire est correctement définie
        if (this.isEditMode && this.data.voitureLouer?.marque) {
          const marque = this.marques.find(r => r.idMarque === this.data.voitureLouer.marque.idMarque);
          if (marque) {
            this.voitureLouerForm.patchValue({ marque: marque });
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
        if (this.isEditMode && this.data.voitureLouer?.typeReservoir) {
          const typeReservoir = this.typeReservoirs.find(r => r.idTypeReservoir === this.data.voitureLouer.typeReservoir.idTypeReservoir);
          if (typeReservoir) {
            this.voitureLouerForm.patchValue({ typeReservoir: typeReservoir });
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
        if (this.isEditMode && this.data.voitureLouer?.typeVoiture) {
          const typeVoiture = this.typeVoitures.find(r => r.idTypeVoiture === this.data.voitureLouer.typeVoiture.idTypeVoiture);
          if (typeVoiture) {
            this.voitureLouerForm.patchValue({ typeVoiture: typeVoiture });
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
        if (this.isEditMode && this.data.voitureLouer?.user) {
          const user = this.users.find(r => r.idUser === this.data.voitureLouer.user.idUser);
          if (user) {
            this.voitureLouerForm.patchValue({ user: user });
            console.log("utilisateur :", user?.nomUser);
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement des utilisateurs de la voiture à louer:', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onIsChauffeurChange(value: boolean) {
    value   === !value;
    console.log('Valeur booléenne:', value);
    // Faites ce que vous voulez avec la valeur booléenne
  }

 
  onSaves(): void {
    if (this.voitureLouerForm.valid) {
      const voitureLouer = this.voitureLouerForm.value;
      console.log('Form Data:', voitureLouer);
  
      if (this.isEditMode) {
        console.log('Edit Mode');
        this.voitureService.updateVoitureLouer(voitureLouer, this.images).subscribe(
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
        this.voitureService.addVoitureLouer(voitureLouer, this.images).subscribe(
          response => {
            console.log('Voiture à louer ajoutée avec succès :', response);
            this.voitureLouerForm.reset();
            this.images = [];
            this.imagePreviews = [];
            Swal.fire('Succès !', 'Voiture à louer créé avec succès', 'success');
            this.dialogRef.close(response);
          },
          error => {
            console.error("Erreur lors de l'ajout de la voiture à louer :", error);
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
    Object.keys(this.voitureLouerForm.controls).forEach(key => {
      const control = this.voitureLouerForm.get(key);
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
