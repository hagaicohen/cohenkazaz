import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      
      let name = this.contactForm.value['name'];
      let phone = this.contactForm.value['phone'];
      let email = this.contactForm.value['email'];
      let message = this.contactForm.value['message'];
      
      
    }
  }

  sendWhatsApp(phoneNumber: string) {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  }
}
