import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;
  remember: boolean;

  constructor(private router: Router, private auth: AuthService) {
     this.user = new User();
     this.remember = false;
  }


  ngOnInit(): void {
    this.getNameLocalStorage();
  }

  login( form: NgForm ) {
    if (  form.invalid ) { return; }

    Swal.fire({
      //title: 'Error!',
      allowOutsideClick: false,
      text: 'Espere por favor...',
      icon: 'info',
      confirmButtonText: 'Cool'
    });
    Swal.showLoading();

    this.auth.login( this.user )
      .subscribe( resp => {
        Swal.close();

        if ( this.remember ) {
          localStorage.setItem('email', this.user.email);
        }else{
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/home');
      }, (err) => {

        console.log(err.error.error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message
        });
      });
  }

  getNameLocalStorage(){
    if(localStorage.getItem('email')){
      this.user.email = localStorage.getItem('email');
      this.remember = true;
    }
  }


}
