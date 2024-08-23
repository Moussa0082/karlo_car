import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
import { VoitureLouerService } from '../services/voiture-louer.service';

@Component({
  selector: 'app-detail-voiture-louer',
  templateUrl: './detail-voiture-louer.component.html',
  styleUrls: ['./detail-voiture-louer.component.scss']
})
export class DetailVoitureLouerComponent implements OnInit{


  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  // imagePreview: string | ArrayBuffer | null | any = null;

  voitureLouerForm!: FormGroup;
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



  constructor(private fb: FormBuilder, private voitureService: VoitureLouerService,
    public dialogRef: MatDialogRef<DetailVoitureLouerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
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
      user: this.adminRecup
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
      user: this.adminRecup
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
    this.loadImages();
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

   // Méthode pour charger les images existantes
  //  private loadExistingImages(logoPaths: string[]): void {
  //   if (logoPaths && logoPaths.length > 0) {
  //     this.imagePreviews = logoPaths.map(path => `http://localhost/${path}`);
  //   }
  // }
  //  private loadExistingImages(logoPaths: string[]): void {
  //   if (logoPaths && logoPaths.length > 0) {
  //     this.imagePreviews = logoPaths.map(path => `http://185.194.216.57:9000/voitureLouer/${path}`);
  //   }
  // }

  // private loadImages(): void {
  //   if (this.data.voitureLouer && this.data.voitureLouer.images && this.data.voitureLouer.images.length > 0) {
  //     this.data.voitureLouer.images.forEach((imageName: string) => {
  //       this.voitureService.getImages(this.data.voitureLouer.idVoiture, imageName).subscribe(
  //         (imageBlob: any) => {
  //           const objectURL = URL.createObjectURL(imageBlob);
  //           this.imageUrls.push(objectURL);  // Ajouter l'URL de l'image au tableau
  //           console.log("image chargée", this.imageUrls);
            
  //           // Déclencher la détection des changements
  //           this.cdr.detectChanges();
  //         },
  //         (error) => {
  //           console.error(`Erreur lors du chargement de l'image ${imageName}:`, error);
  //         }
  //       );
  //     });
  //   }
  // }
  private loadImages(): void {
    if (this.data.voitureLouer && this.data.voitureLouer.images && this.data.voitureLouer.images.length > 0) {
      this.data.voitureLouer.images.forEach((imageName: string) => {
        const imageUrl = this.voitureService.getImageUrl(this.data.voitureLouer.idVoiture, imageName);
        this.imageUrls.push(imageUrl);  // Ajouter l'URL complète de l'image au tableau
        console.log("Image URL chargée", this.imageUrls);
      });
    }
  }
  
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  
}

