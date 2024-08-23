import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { VoitureLouer } from '../models/VoitureLouer';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VoitureLouerService } from '../services/voiture-louer.service';
import Swal from 'sweetalert2';
import { ReservationService } from '../services/reservation.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-detail-reservation',
  templateUrl: './detail-reservation.component.html',
  styleUrls: ['./detail-reservation.component.scss']
})
export class DetailReservationComponent implements OnInit{


  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  // imagePreview: string | ArrayBuffer | null | any = null;

  reservationForm!: FormGroup;
  voituresLouer: VoitureLouer[] = [];
  images: File[]  = [];
  imagePreviews: string[] = [];
  isEditMode: boolean;

   constructor(private fb: FormBuilder, private voitureService: VoitureLouerService,
    private reservationService:ReservationService,
    public dialogRef: MatDialogRef<DetailReservationComponent>,
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
    //  this.isEditMode ? this.loadImages() : null;

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
        console.log('Données reçues :', data);
    
        // Vérifiez la structure des données reçues
        if (Array.isArray(data)) {
          this.voituresLouer = data
            .filter((v: any) => v.isDisponible === true); // Assurez-vous que `isDisponible` est correctement orthographié
    
          // Vérifiez les données filtrées
          this.voituresLouer.forEach(v => {
            console.log("Statut voiture louée :", v.isDisponible);
          });
    
          console.log("Liste des voitures à louer chargée :", this.voituresLouer);
        } else {
          console.error('Les données reçues ne sont pas au format attendu.');
        }
      },
      error => {
        console.error('Erreur lors du chargement de la liste des voitures à louer :', error);
      }
    );
    this.isEditMode ? this.loadSelectOptions() : null;
    this.isEditMode ? this.loadImages() : null;

  }


  private loadImages(): any {
    if (this.data.reservation && this.data.reservation.images && this.data.reservation.images.length > 0) {
      this.data.reservation.images.forEach((imageName: string) => {
        const imageUrl = this.reservationService.getImageUrl(this.data.reservation.idReservation, imageName);
        this.imagePreviews.push(imageUrl);  // Ajouter l'URL complète de l'image au tableau
        console.log("Image URL chargée", this.imagePreviews);
      }
    );
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
  // private loadExistingImages(logoPaths: string[]): void {
  //   if (logoPaths && logoPaths.length > 0) {
  //     this.imagePreviews = logoPaths.map(path => `http://localhost/${path}`);
  //   }
  // }


  onNoClick(): void {
    this.dialogRef.close();
  }



}

 