import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Contact } from '../models/Contact';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ContactService } from '../services/contact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.scss']
})
export class ListContactComponent implements OnInit{


         
  displayedColumns: string[] = [ 'nomContact' , 'email', 'telephone' , 'dateAjout', 'action'];

  dataSource = new MatTableDataSource<Contact>();
  contacts: Contact[] = [];
  loading: boolean = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, private contactService: ContactService) { }

 
  ngOnInit(): void {
      this.contactService.getAllContacts().subscribe(data => {
        this.contacts = data;
        this.dataSource = new MatTableDataSource(this.contacts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("liste contacts: ", this.contacts);
      },
      (error) => {
        console.error('Erreur lors du chargement de la liste des contacts:', error);
      });
 
  }

  chargerDonner(): void {
    this.contactService.getAllContacts().subscribe(data => {
      this.contacts = data;
      this.dataSource = new MatTableDataSource(this.contacts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste contacts: ", this.contacts);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des contacts:', error);
    });
  }
  

  


  onDelete(element:Contact):void{
    Swal.fire({
      title: "Etes vous sûr?",
      text: "Voulez - vous supprimer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:"Non",
      confirmButtonText: "Oui, je veux supprimer!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.deleteContact(element.idContact).subscribe(
          (result) => {
            this.chargerDonner(); // Recharger la liste après la suppression réussie
            console.log( "result delete : ", result);
          }
        );
        console.log("id contact", element.idContact);
        Swal.fire({
          title: "Supprimer!",
          text: "Suppression réussi.",
          icon: "success"
        });
      }else{
        Swal.fire(
          'Suppression annulée!',
          'Cette suppresion a été annulée.',
          'error'
        )
      }
    });
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
