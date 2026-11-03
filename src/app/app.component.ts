import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { PAGE_META } from './seo/page-meta';
import { SECTION_PATHS } from './app-routing.module';
import { HEADER_SHRINK_SCROLL_Y } from './navbar/navbar.component';

/** רווח בין תחתית הכותרת הקבועה לראש החלק אחרי גלילה */
const SCROLL_GAP = 12;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('homeSection', { static: false }) homeSection!: ElementRef;
  @ViewChild('aboutSection', { static: false }) aboutSection!: ElementRef;
  @ViewChild('servicesSection', { static: false }) servicesSection!: ElementRef;
  @ViewChild('contactSection', { static: false }) contactSection!: ElementRef;

  /** נקבע כבר מהכתובת, כדי שכניסה ישירה ל-/about בדסקטופ לא תציג קודם את דף הבית */
  currentSection: string = AppComponent.sectionFromPath(window.location.pathname);

  private firstNavigation = true;
  private readonly routerSub: Subscription;

  constructor(private renderer: Renderer2, private title: Title, private meta: Meta, private router: Router) {
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.onNavigationEnd(e.urlAfterRedirects));
  }

  ngAfterViewInit() {
    this.addFadeInEffect();
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  /**
   * בקשת מעבר מהתפריט או מכפתורים בעמוד. target יכול לכלול עוגן, למשל 'services#family-law'.
   * מעדכנים את הכתובת דרך ה-Router (בלי טעינה מחדש); ההצגה עצמה מתבצעת ב-onNavigationEnd,
   * כך שגם חזרה/קדימה בדפדפן מציגות את החלק המתאים.
   */
  onSectionChange(target: string) {
    const [section, anchor] = target.split('#');
    const path = section === 'home' ? '/' : `/${section}`;
    this.router.navigateByUrl(anchor ? `${path}#${anchor}` : path);
  }

  /** קישור הדילוג לתוכן: מעבר פוקוס בלי לשנות את הכתובת */
  skipToMain(event: Event) {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }

  private onNavigationEnd(url: string) {
    const tree = this.router.parseUrl(url);
    const section = tree.root.children['primary']?.segments[0]?.path ?? 'home';
    const anchor = tree.fragment ?? undefined;
    const initial = this.firstNavigation;
    this.firstNavigation = false;
    this.showSection(section, anchor, initial);
  }

  /** הצגת חלק – זהה להתנהגות הקודמת של התפריט; בכניסה ישירה הגלילה מיידית במקום חלקה */
  private showSection(section: string, anchor: string | undefined, initial: boolean) {
    this.currentSection = section;

    if (!this.isMobile()) {
      this.applyPageMeta(section);
      setTimeout(() => {
        this.addFadeInEffect();
        const anchorEl = anchor ? document.getElementById(anchor) : null;
        if (anchorEl) {
          initial ? this.alignOnLoad(anchorEl) : this.scrollToElement(anchorEl);
        } else if (!initial) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 0);
      return;
    }

    // בכניסה לדף הבית עצמו אין לאן לגלול
    if (initial && section === 'home' && !anchor) return;

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
        const target = anchorEl || element!.nativeElement;
        initial ? this.alignOnLoad(target) : this.scrollToElement(target);
      }, 100);
    } else {
      console.warn(`Element for section ${section} is not defined or does not have nativeElement.`);
    }
  }

  /**
   * כניסה ישירה לכתובת חלק: גלילה מיידית, ויישור חוזר אחרי טעינת הגופנים והתמונות
   * (שעלולים להזיז מעט את המיקום) – רק אם המשתמש עוד לא גלל בעצמו.
   */
  private alignOnLoad(el: HTMLElement) {
    this.scrollToElement(el, 'auto');
    const expected = window.scrollY;
    const loaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>(resolve => window.addEventListener('load', () => resolve(), { once: true }));
    Promise.all([loaded, (document as any).fonts?.ready]).then(() => {
      if (Math.abs(window.scrollY - expected) < 2) this.scrollToElement(el, 'auto');
    });
  }

  /** כותרת הלשונית והתיאור לפי החלק המוצג (בדסקטופ מוצג חלק אחד בכל פעם) */
  private applyPageMeta(section: string) {
    const meta = PAGE_META[section] ?? PAGE_META['home'];
    this.title.setTitle(meta.title);
    this.meta.updateTag({ name: 'description', content: meta.description });
  }

  /**
   * גלילה לאלמנט כך שיופיע SCROLL_GAP פיקסלים מתחת לכותרת הקבועה.
   * הגובה נלקח לפי מצב הכותרת ביעד ולא ברגע הלחיצה: מעבר ל-HEADER_SHRINK_SCROLL_Y הכותרת מתכווצת,
   * ומדידה ברגע הלחיצה (בראש העמוד, או באמצע אנימציית הכיווץ) הייתה משאירה את הכותרת נמוכה מדי.
   */
  private scrollToElement(el: HTMLElement, behavior: ScrollBehavior = 'smooth') {
    window.scrollTo({ top: AppComponent.scrollTargetFor(el), behavior });
  }

  /** מיקום הגלילה שבו ראש האלמנט נמצא SCROLL_GAP מתחת לכותרת (בגובהה ביעד) */
  static scrollTargetFor(el: HTMLElement): number {
    const css = getComputedStyle(document.documentElement);
    const full = parseFloat(css.getPropertyValue('--ck-header-h')) || 0;
    const shrunk = parseFloat(css.getPropertyValue('--ck-header-h-scrolled')) || full;
    // הגובה במשתנים לא כולל את קו הגבול התחתון של הכותרת
    const header = document.querySelector('.site-header');
    const border = header ? parseFloat(getComputedStyle(header).borderBottomWidth) || 0 : 0;
    const elTop = el.getBoundingClientRect().top + window.scrollY;
    const withShrunk = elTop - shrunk - border - SCROLL_GAP;
    const top = withShrunk > HEADER_SHRINK_SCROLL_Y ? withShrunk : elTop - full - border - SCROLL_GAP;
    return Math.max(Math.round(top), 0);
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

  private static sectionFromPath(pathname: string): string {
    const first = pathname.split('/').filter(Boolean)[0];
    return (SECTION_PATHS as readonly string[]).includes(first) ? first : 'home';
  }
}
