import { VoitureVendre } from "./VoitureVendre";

export interface Vente {
    idVente:       string;
    dateAjout:     string;
    dateModif:     string;
    nomClient:     string;
    telephone:     string;
    montant:       number;
    description:   string;
    images:        string[];
    voitureVendre: VoitureVendre;
}