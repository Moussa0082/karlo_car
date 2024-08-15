import { TypeTransaction } from "./TypeTransaction";
import { User } from "./User";

export interface Transaction {
    idTransaction:   string;
    dateTransaction: string;
    dateModif:       string;
    montant :        number;
    description:     string;
    user:            User;
    typeTransaction: TypeTransaction;
}