import { Role } from "./role";

export interface User {
    idUser:    string;
    nomUser:   string;
    email:     string;
    password:  string;
    adresse:   string;
    telephone: string;
    dateAjout: string;
    statut:    boolean;
    role:      Role;
}