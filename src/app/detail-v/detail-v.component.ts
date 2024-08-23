import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { VoitureVendre } from '../models/VoitureVendre';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VenteService } from '../services/vente.service';
import { Router } from '@angular/router';
import { VoitureVendreService } from '../services/voiture-vendre.service';


@Component({
  selector: 'app-detail-v',
  templateUrl: './detail-v.component.html',
  styleUrls: ['./detail-v.component.scss']
})
export class DetailVComponent implements OnInit{


  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  // imagePreview: string | ArrayBuffer | null | any = null;

  venteForm!: FormGroup;
  voituresVendre: VoitureVendre[] = [];
  images: File[]  = [];
  imageUrls: string[] = [];  // Stocker les URLs des images de la voiture
  isEditMode: boolean;

  constructor(private fb: FormBuilder, private voitureService: VoitureVendreService,
    private venteService:VenteService,
    public dialogRef: MatDialogRef<DetailVComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
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
    this.loadSelectOptions();
    this.loadImages();
    
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
  //  private loadExistingImages(logoPaths: string[]): void {
  //   if (logoPaths && logoPaths.length > 0) {
  //     this.imageUrls = logoPaths.map(path => `http://localhost/${path}`);
  //   }
  // }


  onNoClick(): void {
    this.dialogRef.close();
  }

  private loadImages(): any {
    if (this.data.vente && this.data.vente.images && this.data.vente.images.length > 0) {
      this.data.vente.images.forEach((imageName: string) => {
        const imageUrl = this.venteService.getImageUrl(this.data.vente.idVente, imageName);
        this.imageUrls.push(imageUrl);
        console.log("Image URL chargée", imageUrl);
      });
      this.cdr.detectChanges();  // Forcer la détection des changements
    }
  }
  
  

 
}

