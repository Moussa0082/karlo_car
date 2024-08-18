import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit{

  loginForm!: FormGroup;
  private passwordVisible: boolean = false;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('eyeIcon') eyeIcon!: ElementRef<HTMLElement>;


  constructor(private userService:UserService , private fb: FormBuilder, private router:Router){
    this.loginForm = this.fb.group({
      email: [ '', Validators.required],
      password: [ '', Validators.required],
    });
  }



  ngAfterViewInit() {
    // Initial setup if needed
    this.updateIcon();
  }

    togglePasswordVisibility(): void {
      if (this.passwordInput.nativeElement.type === 'password') {
        this.passwordInput.nativeElement.type = 'text';
        this.passwordVisible = true;
      } else {
        this.passwordInput.nativeElement.type = 'password';
        this.passwordVisible = false;
      }
      this.updateIcon();
    }
  
    private updateIcon(): void {
      if (this.passwordVisible) {
        this.eyeIcon.nativeElement.classList.add('ri-eye-line');
        this.eyeIcon.nativeElement.classList.remove('ri-eye-off-line');
      } else {
        this.eyeIcon.nativeElement.classList.remove('ri-eye-line');
        this.eyeIcon.nativeElement.classList.add('ri-eye-off-line');
      }
    }


     

    onSubmit() {
      const { email, password } = this.loginForm.value;
    
      if (this.loginForm.valid) {
        this.userService.login(email, password).subscribe(
          (response) => {
            // Gérer la connexion réussie ici
            console.log(response);
            // Stocker les informations de l'utilisateur dans localStorage
            localStorage.setItem('userData', JSON.stringify({
              userData: response,
            }));
            this.userService.setutilisateurConnect(response);
    
            console.log("userType", localStorage.getItem('userData'));
            // Rediriger vers la page appropriée
            if(response.role.libelle.toLocaleLowerCase()=== 'admin'){
              this.router.navigate(['/home']);
            }else{
              this.router.navigate(['/vlpart']);
            }
            this.loginForm.reset();
          },
          error => {
            console.error("Erreur lors de la connexion :", error);
            
            // Vérifier si `error.error` et `error.error.message` existent avant de les utiliser
            const errorMessage = error.error?.message || 'Une erreur est survenue';
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: errorMessage,
            });
          }
        );
      } else {
        console.log("non valid");
      }
    }
    
  

  private showValidationErrors() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
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
