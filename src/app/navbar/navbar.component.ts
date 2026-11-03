import { Component, Output, EventEmitter, Input, NgZone, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() activeSection: string = 'home'; // החלק הפעיל – מגיע מ-AppComponent
  @Output() sectionChange = new EventEmitter<string>();
  menuOpen: boolean = false;
  scrolled: boolean = false;

  readonly links = [
    { id: 'home', label: 'בית' },
    { id: 'about', label: 'אודות' },
    { id: 'services', label: 'שירותים' },
    { id: 'contact', label: 'צור קשר' }
  ];

  private readonly onScroll = () => {
    const scrolled = window.scrollY > 24;
    if (scrolled !== this.scrolled) {
      // נכנסים ל-Angular רק כשהמצב משתנה, כדי לא להריץ change detection על כל גלילה
      this.zone.run(() => this.scrolled = scrolled);
    }
  };

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
    this.onScroll();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onSectionChange(section: string, event?: Event) {
    event?.preventDefault();
    this.activeSection = section;
    this.sectionChange.emit(section);
    this.menuOpen = false;
  }

  toggleBurger() {
    this.menuOpen = !this.menuOpen;
  }
}
