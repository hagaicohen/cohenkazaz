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

  /**
   * section יכול לכלול עוגן אופציונלי, למשל 'services#family-law',
   * כדי לגלול ישירות לתת-נושא בתוך העמוד.
   */
  onSectionChange(target: string) {
    const [section, anchor] = target.split('#');
    this.currentSection = section;

    if (!this.isMobile()) {
      setTimeout(() => {
        this.addFadeInEffect();
        const anchorEl = anchor ? document.getElementById(anchor) : null;
        if (anchorEl) {
          this.scrollToElement(anchorEl);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 0);
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
          const anchorEl = anchor ? document.getElementById(anchor) : null;
          this.scrollToElement(anchorEl || element!.nativeElement);
        }, 100); // Adjust delay timing as needed
      } else {
          console.warn(`Element for section ${section} is not defined or does not have nativeElement.`);
      }
    }
  }

  /** גלילה לאלמנט תוך התחשבות בגובה הכותרת הקבועה */
  private scrollToElement(el: HTMLElement) {
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
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
