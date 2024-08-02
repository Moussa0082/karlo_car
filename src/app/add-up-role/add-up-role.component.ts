import { Component, Inject, OnInit } from '@angular/core';
import { Role } from '../models/role';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddUpUserComponent } from '../add-up-user/add-up-user.component';
import { RoleService } from '../services/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-up-role',
  templateUrl: './add-up-role.component.html',
  styleUrls: ['./add-up-role.component.scss']
})
export class AddUpRoleComponent  implements OnInit{
  
  roleForm: FormGroup;
  role:Role | any;
  roles: Role[] = [];
  isEditMode: boolean;
  
  constructor(
    public dialogRef: MatDialogRef<AddUpUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
    private roleService:RoleService, private fb: FormBuilder
  ){
    this.isEditMode = !!data.role; // Si un role est passé, alors c'est le mode édition
    this.roleForm = this.fb.group({
      idRole: [this.isEditMode ? this.data.role?.idRole : '', this.isEditMode ? Validators.required : null],
      // idRole: [data.role?.idRole || '', Validators.required],
      libelle: [data.role?.libelle || '', Validators.required],
      description: [data.role?.description || '', Validators.required],
    });
  }
  
  ngOnInit(): void {
    this.isEditMode = !!this.data.role; // Si un role est passé, alors c'est le mode édition
    this.roleForm = this.fb.group({
      idRole: [this.isEditMode ? this.data.role?.idRole : '', this.isEditMode ? Validators.required : null],
      libelle: [this.data.role?.libelle || '', Validators.required],
      description: [this.data.role?.description || '', Validators.required],
    });

    this.roleService.getAllRole().subscribe(data =>{
      this.roles = data;
      console.log("Liste role:", this.roles);
    },
    (error) =>{
      console.error('Erreur lors du chargement de la liste des roles:', error);
    }
  );

  }

  chargerDonner():void{
    this.roleService.getAllRole().subscribe(data =>{
      this.roles = data;
      console.log("Liste role:", this.roles);
    },
    (error) =>{
      console.error('Erreur lors du chargement de la liste des roles:', error);
    }
  );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
   

  onSaves(): void {
    if (this.roleForm.valid) {
      const role = this.roleForm.value;
      if (this.isEditMode) {
        // Modifier l'utilisateur
        this.roleService.updateRole(role).subscribe(
          response => {
            Swal.fire('Succès !', 'Role modifié avec succès', 'success');
            console.log("role modifier : " , response);
            this.dialogRef.close(response);
          },
          error => {
            Swal.fire('Erreur !', 'Erreur lors de la modification', error);
          }
        );
      } else {
        // Ajouter un role
        const newRole: Role = this.roleForm.value;
        this.roleService.createRole(newRole).subscribe(
          (response) => {
            console.log('Rôle ajouté avec succès :', response);
            this.roleForm.reset();
            Swal.fire('Succès !', 'Rôle crée avec succès', 'success');
            this.dialogRef.close(response);
          },
          (error) => {
            console.error("Erreur lors de l'ajout du role :", error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message,
            });
          }
        );
      }
    }
  }

}
