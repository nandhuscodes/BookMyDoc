import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-doc-signup',
  templateUrl: './doc-signup.component.html',
  styleUrls: ['./doc-signup.component.css']
})
export class DocSignupComponent {
  username:string='';
  email:string='';
  password:string='';
  phone:string='';
  dept:string='';
  hospital:string='';
  address:string='';
  errorMessage:string='';
  message:string='';
  passwordType = 'password';
  isPasswordVisible = false;
  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordType = this.isPasswordVisible ? 'text' : 'password';
}
constructor(private http: HttpClient) {}

  onSubmit() {
  const url = 'http://localhost:5000/api/signup';
  const data = {
  username: this.username,
  dept:this.dept,
  email: this.email,
  password: this.password,
  phone: this.phone,
  hospital:this.hospital,
  address:this.address
  };
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  this.http.post(url, data, { headers }).subscribe(
  (response: any) => this.message=response.message,
  (error: any) => this.errorMessage = error.message
  );
  }
}
