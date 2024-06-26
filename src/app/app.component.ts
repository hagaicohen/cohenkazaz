import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('homeSection', { static: false }) homeSection!: ElementRef;
  @ViewChild('aboutSection', { static: false }) aboutSection!: ElementRef;
  @ViewChild('servicesSection', { static: false }) servicesSection!: ElementRef;
  @ViewChild('contactSection', { static: false }) contactSection!: ElementRef;

  currentSection: string = 'home';

  constructor() {}

  ngAfterViewInit() {
    this.addFadeInEffect();
  }

  onSectionChange(section: string) {
    this.currentSection = section;

    let element: ElementRef | undefined;

    switch (section) {
      case 'home':
        element = this.homeSection;
        break;
      case 'about':
        element = this.aboutSection;
        break;
      case 'services':
        element = this.servicesSection;
        break;
      case 'contact':
        element = this.contactSection;
        break;
    }

    if (element && element.nativeElement) {
      // Use setTimeout to delay scroll to ensure element is ready
      setTimeout(() => {
        element!.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100); // Adjust delay timing as needed
    } else {
        console.warn(`Element for section ${section} is not defined or does not have nativeElement.`);
    }
  }

  private addFadeInEffect() {
    // Implement your fade-in effect logic here if needed
  }

  public isMobile() {
    return window.innerWidth <= 768;
  }
}
