import { Component,Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  @Input() username!: string;
  appointments: any[] = [];

  constructor(private route: ActivatedRoute,private http: HttpClient,private router: Router) { }

  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      this.username = params['name'];
    });
    this.getAppointments();
  }

  getAppointments() {
    const doctor_id = this.username; // replace with actual doctor ID
    const url = `http://localhost:5000/appointments?doctor_id=${doctor_id}`;
    this.http.get<any[]>(url).subscribe((data) => {
      this.appointments = data;
    });
  }

  cancelAppointment(appointment: any) {
    // TODO: implement cancel appointment logic
    const payload = { doctor: this.username, datetime:appointment.datetime};
  
    this.http.post('http://localhost:5000/api/delete', payload).subscribe(
      (response: any) => {
        alert(response.message);
      },
      (error: any) => {
        console.error('Error booking appointment', error);
      }
    );
  }
  visitAppointment(appointment: any) {
    // TODO: implement cancel appointment logic
    const payload = { doctor: this.username, datetime:appointment.datetime};
  
    this.http.post('http://localhost:5000/api/delete', payload).subscribe(
      (response: any) => {
        alert("Status: Visited");
      },
      (error: any) => {
        console.error('Error booking appointment', error);
      }
    );
  }
  Logout(){
    this.username = '';
    this.router.navigate(['/']);
  }
}
