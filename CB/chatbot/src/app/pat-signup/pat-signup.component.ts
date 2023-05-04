import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-pat-signup',
  templateUrl: './pat-signup.component.html',
  styleUrls: ['./pat-signup.component.css']
})
export class PatSignupComponent {
  username: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  age: number = 0;
  gender: string = '';
  errorMessage: string = '';
  passwordType = 'password';
  message: string = '';
  isPasswordVisible = false;
  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordType = this.isPasswordVisible ? 'text' : 'password';
}
constructor(private http: HttpClient) {}

  onSubmit() {
  const url = 'http://localhost:5000/api/register';
  const data = {
  username: this.username,
  email: this.email,
  password: this.password,
  phone: this.phone,
  age: this.age,
  gender: this.gender
  };
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  this.http.post(url, data, { headers }).subscribe(
  (response: any) => this.message = response.message,
  (error: any) => this.errorMessage = error.message
  );
  }
}
