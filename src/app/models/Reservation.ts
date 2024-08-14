import { VoitureLouer } from "./VoitureLouer";

export interface Reservation {
    idReservation: string;
    dateDebut:     string;
    dateAjout:     string;
    dateModif:     string;
    dateFin:       string;
    nomClient:     string;
    telephone:     string;
    montant:       number;
    description:   string;
    images:        string[];
    voitureLouer:  VoitureLouer;
}