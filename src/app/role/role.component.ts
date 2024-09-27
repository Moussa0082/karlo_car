import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleService } from '../services/role.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Role } from '../models/Role';
import { MatTableDataSource } from '@angular/material/table';
import { AddUpRoleComponent } from '../add-up-role/add-up-role.component';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit{
  
  displayedColumns: string[] = [ 'libelle' , 'description', 'action'];

  dataSource = new MatTableDataSource<Role>();
  roles: Role[] = [];
  loading: boolean = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private roleService: RoleService, private fb: FormBuilder, private dialog: MatDialog){

  }

  ngOnInit(): void {
    this.roleService.getAllRole().subscribe(data => {
      this.roles = data;
      this.dataSource = new MatTableDataSource(this.roles);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log("liste role: ", this.roles);
    },
    (error) => {
      // console.error('Erreur lors du chargement de la liste des roles:', error);
    });  
  }

  chargerDonner(): void {
    this.roleService.getAllRole().subscribe(data => {
      this.roles = data;
      this.dataSource.data = this.roles; // Assurez-vous que MatTableDataSource est mis à jour
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log("liste role: ", this.roles);
    },
    (error) => {
      // console.error('Erreur lors du chargement de la liste des roles:', error);
    });  
  }



  onDelete(element:Role):void{
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
        this.roleService.deleteRole(element.idRole).subscribe(
          (result) => {
            // console.log( "result delete : ", result);
            this.chargerDonner(); // Recharger la liste après la suppression réussie
          }
        );
        // console.log("id Role", element.idRole);
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


  openDialog(role?: Role): void {
    const dialogRef = this.dialog.open(AddUpRoleComponent, {
      width: '500px',
      data: { role }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log('Dialog closed with result:', result);
        this.chargerDonner();
      } else {
        // console.log('Dialog closed without result');
      }
    });
  }

  //Editer 
  editElement(role: Role): void {
    this.openDialog(role);
    // console.log("role open dialog: ", role);
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
