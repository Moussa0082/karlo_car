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
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-detail-voiture',
  templateUrl: './detail-voiture.component.html',
  styleUrls: ['./detail-voiture.component.scss']
})
export class DetailVoitureComponent   implements OnInit{


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
  adminRecup!: User  | null;
  userSubscription!: Subscription;
  imageUrls: string[] = [];  // Stocker les URLs des images de la voiture



  constructor(private fb: FormBuilder, private voitureService: VoitureVendreService,
    public dialogRef: MatDialogRef<DetailVoitureComponent>,
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
      user: this.adminRecup
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.getUtilisateurConnect().subscribe(user => {
      this.adminRecup = user;
      // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
    }); 
    this.isEditMode =  !!this.data.voitureVendre;
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
      user: this.adminRecup
    });
    
    
    this.typeReservoirService.getAllTypeReservoir().subscribe(data => {
      this.typeReservoirs = data;
      // console.log("liste type reservoir charger: ", this.typeReservoirs);
    },
    (error) => {
      // console.error('Erreur lors du chargement de la liste des type reservoirs:', error);
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
        // console.error('Erreur lors du chargement de la liste des users:', error);
      }
    );
    this.typeVoitureService.getAllTypeVoiture().subscribe(data => {
      this.typeVoitures = data;
      // console.log("liste type voiture charger: ", this.typeVoitures);
    },
    (error) => {
      // console.error('Erreur lors du chargement de la liste des type voiture:', error);
    });
    this.marqueservice.getAllMarque().subscribe(data => {
      this.marques = data;
      // console.log("liste marque charger: ", this.marques);
    },
    (error) => {
      // console.error('Erreur lors du chargement de la liste des marques:', error);
    });
    this.loadSelectOptions();
    this.loadImages();
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
            // console.log("marque de la voiture :", marque.nomMarque);
          }
        }
      },
      error => {
        // console.error('Erreur lors du chargement des marques:', error);
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
            // console.log("typeReservoir de la voiture :", typeReservoir.nomTypeReservoir);
          }
        }
      },
      error => {
        // console.error('Erreur lors du chargement des typeReservoirs:', error);
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
            // console.log("type de la voiture :", typeVoiture?.nomTypeVoiture);
          }
        }
      },
      error => {
        // console.error('Erreur lors du chargement des typeVoitures:', error);
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
            // console.log("utilisateur :", user?.nomUser);
          }
        }
      },
      error => {
        // console.error('Erreur lors du chargement des utilisateurs de la voiture à louer:', error);
      }
    );
  }

   // Méthode pour charger les images existantes
  //  private loadExistingImages(logoPaths: string[]): void {
  //   if (logoPaths && logoPaths.length > 0) {
  //     this.imagePreviews = logoPaths.map(path => `http://localhost/${path}`);
  //   }
  // }

  private loadImages(): void {
    if (this.data.voitureVendre && this.data.voitureVendre.images && this.data.voitureVendre.images.length > 0) {
      this.data.voitureVendre.images.forEach((imageName: string) => {
        const imageUrl = this.voitureService.getImageUrl(this.data.voitureVendre.idVoiture, imageName);
        this.imageUrls.push(imageUrl);  // Ajouter l'URL complète de l'image au tableau
        // console.log("Image URL chargée", this.imageUrls);
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  

 

}