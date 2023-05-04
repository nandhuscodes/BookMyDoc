import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pat-login',
  templateUrl: './pat-login.component.html',
  styleUrls: ['./pat-login.component.css']
})
export class PatLoginComponent {
  passwordType = 'password';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isPasswordVisible = false;
  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordType = this.isPasswordVisible ? 'text' : 'password';
}
constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const url = 'http://localhost:5000/api/login';
    const data = {
      email: this.email,
      password: this.password
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post(url, data, { headers }).subscribe((response:any) => {
      console.log(response);
      if(response.success){
        this.router.navigate(['/chatbot'], { queryParams: { email: this.email} });
      } else{
        this.errorMessage = response.error;
      }
    });
  }
}
