import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  titulo:string = 'Login';
  model: any = {};

  constructor(public toastr: ToastrService, private authService: AuthService, public router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('token') != null){
      this.router.navigate(['/dashboard']);
    }
  }

  login(){
    this.authService.login(this.model).subscribe(
      ()=>{
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.toastr.error('Falha no Login');
      }
    );
  }

}
