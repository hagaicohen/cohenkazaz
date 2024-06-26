import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

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

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.addFadeInEffect();
  }

  onSectionChange(section: string) {
    this.currentSection = section;

    if (!this.isMobile()) {
      setTimeout(() => this.addFadeInEffect(), 0);
    } else {

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
  }

  private addFadeInEffect() {
    const sections = document.querySelectorAll('.fade-in');
    sections.forEach(section => {
      this.renderer.addClass(section, 'visible');
    });
  }

  public isMobile() {
    return window.innerWidth <= 768;
  }
}
