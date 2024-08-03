import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from '../services/role.service';
import { Role } from '../models/Role';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-up-user',
  templateUrl: './add-up-user.component.html',
  styleUrls: ['./add-up-user.component.scss']
})
export class AddUpUserComponent implements OnInit{

  
  userForm: FormGroup;
  user:User | any;
  roles: Role[] = [];
  users: User[] = [];
  isEditMode: boolean;

  
  constructor(public dialogRef: MatDialogRef<AddUpUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
     private userService:UserService,
     private roleService:RoleService, private fb: FormBuilder) {
      this.isEditMode = !!data.user; // Si un utilisateur est passé, alors c'est le mode édition
      this.userForm = this.fb.group({
        nomUser: [data.user?.nomUser || '', Validators.required],
        email: [data.user?.email || '', Validators.required],
        password: [data.user?.password || '', Validators.required],
        telephone: [data.user?.telephone || '', Validators.required],
        adresse: [data.user?.adresse || '', Validators.required],
        role: [data.user?.role || '', Validators.required]
      });
   }
 
    ngOnInit(): void {
    this.isEditMode = !!this.data.user; // Si un utilisateur est passé, alors c'est le mode édition
         this.userForm = this.fb.group({
          idUser: [this.isEditMode ? this.data.user?.idUser : '', this.isEditMode ? Validators.required : null],
          // idUser: [this.data.user?.idUser || '', Validators.required],
        nomUser: [this.data.user?.nomUser || '', Validators.required],
        email: [this.data.user?.email || '', Validators.required],
        password: [this.data.user?.password || '', Validators.required],
        telephone: [this.data.user?.telephone || '', Validators.required],
        adresse: [this.data.user?.adresse || '', Validators.required],
        role: [this.data.user?.role || '', Validators.required]
      });

    this.roleService.getAllRole().subscribe(data =>{
      this.roles = data;
      // console.log("Liste role:", this.roles);
    },
    (error) =>{
      console.error('Erreur lors du chargement de la liste des roles:', error);
    }
  );
  // Chargez les rôles après l'initialisation du formulaire
  this.loadRoles();
  }

   
  private loadRoles(): void {
    this.roleService.getAllRole().subscribe(
      (roles: Role[]) => {
        this.roles = roles;
        // console.log('Roles chargés:', roles);
        
        // Pour le mode édition, assurez-vous que la valeur du formulaire est correctement définie
        if (this.isEditMode && this.data.user?.role) {
          const role = this.roles.find(r => r.idRole === this.data.user.role.idRole);
          if (role) {
            this.userForm.patchValue({ role: role });
            // console.log("role du user :", role.libelle);
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement des rôles:', error);
      }
    );
  }
   


  chargerDonner(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
      // console.log("liste user: ", this.users);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des utilisateurs:', error);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

 
  onSaves(): void {
    if (this.userForm.valid) {
      const user = this.userForm.value;
      console.log('Form Data:', user);
  
      if (this.isEditMode) {
        console.log('Edit Mode');
        this.userService.updateUser(user).subscribe(
          response => {
            Swal.fire('Succès !', 'Utilisateur modifié avec succès', 'success');
            console.log("Utilisateur modifié : ", response);
            this.dialogRef.close(response);
          },
          error => {
            console.error('Erreur lors de la modification:', error);
            Swal.fire('Erreur !', 'Erreur lors de la modification', error);
          }
        );
      } else {
        console.log('Add Mode');
        this.userService.addUser(user).subscribe(
          response => {
            console.log('Utilisateur ajoutée avec succès :', response);
            this.userForm.reset();
            Swal.fire('Succès !', 'Utilisateur créé avec succès', 'success');
            this.dialogRef.close(response);
          },
          error => {
            console.error("Erreur lors de l'ajout de l'utilisateur :", error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message,
            });
          }
        );
      }
    } else {
      this.showValidationErrors();
    }
  }
  
  private showValidationErrors() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control) {
        const controlErrors = control.errors as ValidationErrors | null; // Assertion de type
        if (controlErrors) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log(`Control ${key} has error: ${keyError}`);
          });
        }
      }
    });
  }
  
  
}
