import { Marque } from "./Marque";
import { TypeReservoir } from "./TypeReservoir";
import { TypeVoiture } from "./TypeVoiture";
import { User } from "./User";

export interface VoitureVendre {
    idVoiture:        string;
    matricule:        string;
    modele:           string;
    annee:            string;
    isVendu :         boolean;
    typeBoite:        string;
    dateAjout:        string;
    dateModif:        string;
    nbreView:         number;
    nbPortiere:       number;
    prixProprietaire: number;
    prixAugmente:     number;
    images:           string[];
    marque:           Marque;
    typeVoiture:      TypeVoiture;
    user:             User;
    typeReservoir:    TypeReservoir;
}