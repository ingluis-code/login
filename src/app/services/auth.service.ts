import { Injectable, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {


  //API REST de Firebase Auth
  //registro
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //Login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  private url = 'https://identitytoolkit.googleapis.com/v1';
  
  //Descripcion general - configuracion del proyecto
  private apikey = 'AIzaSyC3UOmDq10JDgNvkugmmHCnsbK3Ptw-Krs';

  userToken: string;
  

  constructor(private htt: HttpClient) { }


  ngOnInit(): void {
    
  }

  login( user: User ) {
    const authData = {
      //email: user.email,
      //password: user.password,
      ...user, /*Como los campos del objeto se llaman igual a los que necesita la api 
      se puede enviar asi, sin importar los demas propiedades del objeto*/
      returnSecureToken: true
    };

    return this.htt.post(
      `${ this.url }/accounts:signInWithPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['idToken'] );
        return resp;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
  }

  newUser( user: User ) {

    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.htt.post(
      `${ this.url }/accounts:signUp?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['idToken'] );
        return resp;
      })
    );

  }


  private saveToken( idToken: string ) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );
  }

  getToken() {
    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }


  isAuthenticated(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }
  }
}
