import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { VoitureLouerService } from '../services/voiture-louer.service';
import { VoitureVendreService } from '../services/voiture-vendre.service';
import { ReservationService } from '../services/reservation.service';
import { VenteService } from '../services/vente.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  totalMontantDepot: number | null = null;
  totalMontantRetrait: number | null = null;
  totalVoitureLouer: number | null = null;
  totalVoitureVendu: number | null = null;
  isLoading : boolean = true;

  constructor(
    private transactionService:TransactionService,
    private reservationService:ReservationService,
    private venteService:VenteService
  ) { }


  ngOnInit(): void {
    this.transactionService.getTotalAmountForDepot().subscribe(
      (amount) => {
        this.totalMontantDepot = amount;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement du montant total des dépôts:', error);
        this.isLoading = false;
      }
    );
    this.transactionService.getTotalAmountForRetrait().subscribe(
      (amount) => {
        this.totalMontantRetrait = amount;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Erreur lors du chargement du montant total des retraits:', error);
      }
    );
    this.venteService.getTotalVoitureVendu().subscribe(
      (amount) => {
        this.isLoading = false;
        this.totalVoitureVendu = amount;
      },
      (error) => {
        this.isLoading = false;
        console.error('Erreur lors du chargement du montant total des voitures vendues:', error);
      }
    );
    this.reservationService.getTotalVoitureLouer().subscribe(
      (amount) => {
        this.isLoading = false;
        this.totalVoitureLouer = amount;
      },
      (error) => {
        this.isLoading = false;
        console.error('Erreur lors du chargement du montant total des voitures louées:', error);
      }
    );
  }

}
