import { Component,Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.css']
})
export class BotComponent implements OnInit {
  @Input() email!: string;
  departments: any[] = [];
  selectedDepartment!: string;
  doctors!: string[];
  selectedDoctor!: string;
  slots!: string[];
  selectedDate!: string;
  selectedTime!: string;
  doc!:string;
  message:string='';
  slot:string="";
  userInput: string = "";
  messages: { text: string, type: string }[] = [];
  botResponse!: string;
  msg!:string;
  fixAppointment = false;
  datetimeList: string[] = [];
  selectedDatetime! : string;
  selectedDatetimes! : string;


  constructor(private route: ActivatedRoute,private http: HttpClient,private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
    this.getDepartments();
    this.getDatetimeList();
  }
  getDepartments() {
    this.http.get('http://localhost:5000/api/departments').subscribe((response: any) => {
      this.departments = response.departments;
    });
  }
  selectDepartment(department: string) {
    this.selectedDepartment = department;
    this.http.post('http://localhost:5000/doctors', { department: department }).subscribe(
      (response: any) => {
        this.doctors = response.doctors;
      },
      (error: any) => {
        console.error('Error fetching doctors', error);
      }
    );
  }

  getDatetimeList() {
    this.http.get<string[]>(`http://localhost:5000/api/datetime_list?email=${this.email}`).subscribe(
      (response: string[]) => {
        this.datetimeList = response;
      },
      (error: any) => {
        console.error('Error fetching datetime list', error);
      }
    );
  }

  selectDatetime(datetime: string) {
    this.selectedDatetime = datetime;
  }

  selectDatetimes(datetime: string) {
    this.selectedDatetimes = datetime;
  }
  

  selectDoctor(doctor: string) {
    this.selectedDoctor = doctor;
    this.doc=doctor;
  }

  bookAppointment() {
    const datetime = `${this.selectedDate} ${this.selectedTime}`;
    this.slot = datetime;
    const payload = { doctor: this.doc, datetime, status: 'booked', patient: this.email };
    this.http.post('http://localhost:5000/book-appointment', payload).subscribe(
      (response: any) => {
        this.msg=response.message;
        console.log(response.message);
      },
      (error: any) => {
        console.error('Error booking appointment', error);
      }
    );

  }

  updateAppointment() {
    // ...
    this.http.post('http://localhost:5000/doctor-of-that-slot', { datetime: this.selectedDatetime, patient: this.email }).subscribe(
      (response: any) => {
        this.doc = response.doctors;
      },
      (error: any) => {
        console.error('Error fetching doctors', error);
      }
    );
    const datetime = `${this.selectedDate} ${this.selectedTime}`;
    this.slot = datetime;
    const payload = { doctor: this.doc, datetime:this.selectedDatetime, status: 'booked', patient: this.email, newDatetime:this.slot };
  
    this.http.post('http://localhost:5000/api/update-appointment', payload).subscribe(
      (response: any) => {
        this.msg=response.message;
      },
      (error: any) => {
        console.error('Error booking appointment', error);
      }
    );
  }
  deleteAppointment() {
    // ...
    this.http.post('http://localhost:5000/doctor-of-that-slot', { datetime: this.selectedDatetimes, patient: this.email }).subscribe(
      (response: any) => {
        this.doc = response.doctors;
      },
      (error: any) => {
        console.error('Error fetching doctors', error);
      }
    );
    const datetime = this.selectedDatetimes;
    this.slot = datetime;
    const payload = { doctor: this.doc, datetime:this.selectedDatetimes, status: 'booked', patient: this.email};
  
    this.http.post('http://localhost:5000/api/delete-appointment', payload).subscribe(
      (response: any) => {
        this.msg=response.message;
        console.log(this.msg);
      },
      (error: any) => {
        console.error('Error booking appointment', error);
      }
    );
  }
  sendMessage() {
    if (this.userInput.trim() !== "") {
      this.messages.push({ text: this.userInput.trim(), type: "user" });
      this.http.post<any>('http://localhost:5000/bot', { "text": this.userInput.trim() }).subscribe(response => {
        this.messages.push({ text: response.message, type: "bot" });
      });
      this.userInput = "";
      this.msg='';
    }
  }
  Logout(){
    this.email = '';
    this.router.navigate(['/']);
  }
}
