import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() sectionChange = new EventEmitter<string>();
  activeSection: string = 'home'; // הוספת משתנה לעקוב אחר החלק הפעיל
  menuOpen: boolean = false;

  onSectionChange(section: string) {
    this.activeSection = section; // עדכון החלק הפעיל
    this.sectionChange.emit(section);
    this.menuOpen = false;
  }

  toggleBurger() {
    this.menuOpen = !this.menuOpen;
    const burger = document.querySelector('.burger') as HTMLElement;
    const nav = document.querySelector('.nav-links') as HTMLElement;

    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
  }
}
