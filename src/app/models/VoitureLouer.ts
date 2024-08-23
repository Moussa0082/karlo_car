import { Marque } from "./Marque";
import { TypeReservoir } from "./TypeReservoir";
import { TypeVoiture } from "./TypeVoiture";
import { User } from "./User";

export interface VoitureLouer {
    idVoiture:        string;
    matricule:        string;
    modele:           string;
    annee:            string;
    typeBoite:        string;
    dateAjout:        string;
    isDisponible :     boolean;
    dateModif:        string;
    nbreView:         number;
    nbPortiere:       number;
    prixProprietaire: number;
    prixAugmente:     number;
    isChauffeur:      boolean;
    images:           string[];
    marque:           Marque;
    typeVoiture:      TypeVoiture;
    typeReservoir:    TypeReservoir;
    user:             User;

    currentImageIndex?: number;
}