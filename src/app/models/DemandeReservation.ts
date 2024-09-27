import { VoitureLouer } from "./VoitureLouer";

export interface DemandeReservation {
    idDemandeReservation: string;
    dateDajout:           string;
    email:                string;
    isReserved:           boolean;
    description:          string;
    telephone:            string;
    voitureLouer:         VoitureLouer;
}