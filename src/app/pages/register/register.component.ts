import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User;
  remember: boolean;

  constructor(private router: Router, private auth: AuthService) { 
    this.user = new User();
    this.remember = false;
  }

  ngOnInit(): void {
  }

  onSubmit( form: NgForm ) {

    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      title: 'Registro',
      text:  'Espere por favor...',
      icon: 'info',
      confirmButtonText: 'Cool'
    });
    Swal.showLoading();

    this.auth.newUser( this.user )
      .subscribe( resp => {
        
        Swal.close();

        if ( this.remember ) {
          localStorage.setItem('email', this.user.email);
        }

        this.router.navigateByUrl('/home');
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Registro exitoso!!!',
          showConfirmButton: false,
          timer: 1500
        })

      }, (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.error.error.message,
          icon: 'error',
          confirmButtonText: 'Cool'
        });
      });
  }

}
