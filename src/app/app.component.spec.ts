import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { routes } from './app-routing.module';
import { PAGE_META } from './seo/page-meta';

// תחליפים קלים לחלקי האתר – הבדיקות כאן עוסקות בניווט ובגלילה, לא בתוכן
@Component({ selector: 'app-navbar', template: '<header class="site-header"></header>' })
class NavbarStub {
  @Input() activeSection = '';
  @Output() sectionChange = new EventEmitter<string>();
}
@Component({ selector: 'app-home', template: '' })
class HomeStub {
  @Output() navigate = new EventEmitter<string>();
}
@Component({ selector: 'app-about', template: '' })
class AboutStub {}
@Component({ selector: 'app-services', template: '<div id="family-law"></div>' })
class ServicesStub {}
@Component({ selector: 'app-contact', template: '' })
class ContactStub {}

const SECTIONS = ['app-home', 'app-about', 'app-services', 'app-contact'];

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let router: Router;
  let title: Title;
  let scrollTo: jasmine.Spy;

  /** יצירת האפליקציה במצב דסקטופ/מובייל וביצוע הניווט הראשוני (כמו בטעינת דף) */
  function create(mobile: boolean, initialUrl = '/') {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    spyOn(app, 'isMobile').and.returnValue(mobile);
    fixture.detectChanges();
    fixture.ngZone!.run(() => router.navigateByUrl(initialUrl));
    tick();
    fixture.detectChanges();
    tick(150);
  }

  function navigate(url: string) {
    fixture.ngZone!.run(() => router.navigateByUrl(url));
    tick();
    fixture.detectChanges();
    tick(150);
  }

  function shownSections(): string[] {
    const el = fixture.nativeElement as HTMLElement;
    return SECTIONS.filter(s => el.querySelector(s)).map(s => s.slice(4));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [AppComponent, NavbarStub, HomeStub, AboutStub, ServicesStub, ContactStub]
    }).compileComponents();
    router = TestBed.inject(Router);
    title = TestBed.inject(Title);
    title.setTitle(PAGE_META['home'].title);
    scrollTo = spyOn(window, 'scrollTo');
  });

  describe('desktop – one section at a time', () => {
    it('starts on the home section', fakeAsync(() => {
      create(false);
      expect(shownSections()).toEqual(['home']);
      expect(router.url).toBe('/');
      flush();
    }));

    for (const section of ['about', 'services', 'contact']) {
      it(`/${section} shows only the ${section} section and its tab title`, fakeAsync(() => {
        create(false, `/${section}`);
        expect(shownSections()).toEqual([section]);
        expect(app.currentSection).toBe(section);
        expect(title.getTitle()).toBe(PAGE_META[section].title);
        flush();
      }));
    }

    it('menu navigation updates the URL without reloading, and back/forward restore the section', fakeAsync(() => {
      create(false);
      app.onSectionChange('about');
      tick(); fixture.detectChanges(); tick(10);
      expect(router.url).toBe('/about');
      expect(shownSections()).toEqual(['about']);

      app.onSectionChange('contact');
      tick(); fixture.detectChanges(); tick(10);
      expect(router.url).toBe('/contact');

      navigate('/about'); // כמו "חזרה" בדפדפן – אותו מסלול טיפול (NavigationEnd)
      expect(shownSections()).toEqual(['about']);
      expect(title.getTitle()).toBe(PAGE_META['about'].title);
      flush();
    }));

    it('home navigation returns to "/" with the home title', fakeAsync(() => {
      create(false, '/services');
      app.onSectionChange('home');
      tick(); fixture.detectChanges(); tick(10);
      expect(router.url).toBe('/');
      expect(shownSections()).toEqual(['home']);
      expect(title.getTitle()).toBe(PAGE_META['home'].title);
      flush();
    }));

    it('a section with an anchor keeps the fragment and scrolls to the anchor', fakeAsync(() => {
      create(false);
      scrollTo.calls.reset();
      app.onSectionChange('services#family-law');
      tick(); fixture.detectChanges(); tick(10);
      expect(router.url).toBe('/services#family-law');
      expect(shownSections()).toEqual(['services']);
      expect(scrollTo).toHaveBeenCalledWith(jasmine.objectContaining({ behavior: 'smooth' }));
      flush();
    }));

    it('unknown paths redirect to the home page', fakeAsync(() => {
      create(false, '/no-such-page');
      expect(router.url).toBe('/');
      expect(shownSections()).toEqual(['home']);
      flush();
    }));
  });

  describe('mobile – one continuous page', () => {
    it('renders all sections on one page', fakeAsync(() => {
      create(true);
      expect(shownSections()).toEqual(['home', 'about', 'services', 'contact']);
      flush();
    }));

    it('opening "/" directly does not scroll', fakeAsync(() => {
      create(true, '/');
      expect(scrollTo).not.toHaveBeenCalled();
      flush();
    }));

    it('opening a section URL directly jumps (without animation) to that section', fakeAsync(() => {
      create(true, '/contact');
      expect(shownSections()).toEqual(['home', 'about', 'services', 'contact']);
      expect(scrollTo).toHaveBeenCalledWith(jasmine.objectContaining({ behavior: 'auto' }));
      flush();
    }));

    it('menu navigation smooth-scrolls and updates the URL, keeping the home title', fakeAsync(() => {
      create(true);
      app.onSectionChange('services');
      tick(); fixture.detectChanges(); tick(150);
      expect(router.url).toBe('/services');
      expect(scrollTo).toHaveBeenCalledWith(jasmine.objectContaining({ behavior: 'smooth' }));
      expect(title.getTitle()).toBe(PAGE_META['home'].title);
      flush();
    }));
  });

  describe('scroll target (header shrinks after scrolling)', () => {
    const root = document.documentElement.style;
    beforeEach(() => {
      root.setProperty('--ck-header-h', '84px');
      root.setProperty('--ck-header-h-scrolled', '66px');
    });
    afterEach(() => {
      root.removeProperty('--ck-header-h');
      root.removeProperty('--ck-header-h-scrolled');
    });

    function elAt(top: number): HTMLElement {
      const el = document.createElement('div');
      spyOn(el, 'getBoundingClientRect').and.returnValue({ top } as DOMRect);
      return el;
    }

    it('uses the shrunk header height when the destination is below the shrink point', () => {
      // 1000 - 66 (מכווצת) - 12 (רווח)
      expect(AppComponent.scrollTargetFor(elAt(1000 - window.scrollY))).toBe(922);
    });

    it('uses the full header height when the destination stays near the top', () => {
      // 100 - 66 - 12 = 22 – עדיין לפני נקודת הכיווץ, ולכן הכותרת במלוא גובהה: 100 - 84 - 12
      expect(AppComponent.scrollTargetFor(elAt(100 - window.scrollY))).toBe(4);
    });

    it('never returns a negative position', () => {
      expect(AppComponent.scrollTargetFor(elAt(30 - window.scrollY))).toBe(0);
    });
  });

  it('the skip link focuses the main content without navigating', fakeAsync(() => {
    create(false, '/about');
    const event = new MouseEvent('click', { cancelable: true });
    app.skipToMain(event);
    expect(event.defaultPrevented).toBeTrue();
    expect(document.activeElement?.id).toBe('main-content');
    expect(router.url).toBe('/about');
    flush();
  }));
});
