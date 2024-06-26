import { Component, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  currentSection: string = 'home';

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.addFadeInEffect();
  }

  onSectionChange(section: string) {
    this.currentSection = section;
    
    if (!this.isMobile()){
      setTimeout(() => this.addFadeInEffect(), 0);
    } else{
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
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
