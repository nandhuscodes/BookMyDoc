import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Typed from 'typed.js';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit{
  constructor(private router: Router) { }

  Patient() {
    this.router.navigate(['/patient-login']);
  }
  Patient_SignUp() {
    this.router.navigate(['/patient-signup']);
  }
  Doctor() {
    this.router.navigate(['/doctor-login']);
  }

  ngOnInit(): void {
    const typed = new Typed('.typing', {
      strings: ['Book<span style="color:#ebbb14">My</span>Doc - Hassle-free hospital appointments'],
      typeSpeed: 80,
      backSpeed: 40,
      showCursor: false,
      cursorChar: '|',
      loop: false,
      onComplete: function(self) {
        const p = document.querySelector('p');
        p?.classList.remove('hide');
      }
    });
    const typed2 = new Typed('.type', {
      strings: ['<span style="font-size:15px;color:#4c047c">Say goodbye to long queues, endless wait times, and the frustration of trying to book an appointment over the phone. Book<span style="color:#ebbb14">My</span>Doc makes hospital appointments a breeze!</span>'],
      typeSpeed: 40,
      backSpeed: 10,
      showCursor: false,
      cursorChar: '|',
      loop: false,
      onComplete: function(self) {
        const button = document.querySelector('button');
        button?.classList.remove('hidden');
        button?.classList.add('visible');
      }
    });
  }

}
