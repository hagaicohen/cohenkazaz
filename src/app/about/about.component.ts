import { Component, OnInit, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    // עודכן: הוספת נדל״ן (נדלן) לשם הדף
    const pageTitle = 'אודות | כהן־קזז – דיני משפחה, נדל״ן (נדלן) ומיסוי מקרקעין';
    const description =
      'הכירו את צוות כהן־קזז: עו״ד עפרה קזז (אזרחי, מקרקעין, דיני משפחה; ייפוי כוח מתמשך) ועו״ד חגי כהן (מיסוי מקרקעין, אזרחי-מסחרי). ליווי אישי בקריית גת, הדרום, בית שמש וירושלים.';
    const canonical = 'https://cohenkazaz.law/about';

    // Title + Description
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'כהן-קזז, משרד עורכי דין' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    // Canonical
    let linkEl = this.doc.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!linkEl) {
      linkEl = this.doc.createElement('link');
      linkEl.rel = 'canonical';
      this.doc.head.appendChild(linkEl);
    }
    linkEl.href = canonical;

    // JSON-LD: ישות העסק
    this.upsertJsonLd('about-legalservice', {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      'name': 'כהן־קזז, משרד עורכי דין',
      'url': 'https://cohenkazaz.law/',
      'areaServed': ['קריית גת','הדרום','בית שמש','ירושלים'],
      // עודכן: הוספתי נדל״ן ונדלן לרשימת מילות המפתח
      'keywords': [
        'דיני משפחה',
        'עורך דין גירושין',
        'משמורת',
        'הסכם ממון',
        'ידועים בציבור',
        'צוואות',
        'ירושות',
        'נדל״ן',
        'נדלן'
      ]
    });

    // JSON-LD: עו״ד עפרה קזז
    this.upsertJsonLd('about-person-ofra', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'עפרה קזז',
      'jobTitle': 'עו״ד ומגשרת',
      'alumniOf': 'הקריה האקדמית אונו (LLB)',
      'worksFor': { '@type': 'LegalService', 'name': 'כהן־קזז, משרד עורכי דין' },
      'knowsAbout': ['מקרקעין','נדל״ן','דיני משפחה','אזרחי','ייפוי כוח מתמשך'] // הוספתי "נדל״ן" לעקביות
    });

    // JSON-LD: עו״ד חגי כהן
    this.upsertJsonLd('about-person-hagai', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'חגי כהן',
      'jobTitle': 'עו״ד ומגשר',
      'alumniOf': [
        'אוניברסיטת בר-אילן (B.Sc מדעי הטבע)',
        'אוניברסיטת בר-אילן (LLB)'
      ],
      'worksFor': { '@type': 'LegalService', 'name': 'כהן־קזז, משרד עורכי דין' },
      'knowsAbout': ['מיסוי מקרקעין','אזרחי-מסחרי','נדל״ן']
    });
  }

  private upsertJsonLd(id: string, obj: any) {
    const scriptId = `jsonld-${id}`;
    let el = this.doc.getElementById(scriptId) as HTMLScriptElement | null;
    if (!el) {
      el = this.doc.createElement('script');
      el.type = 'application/ld+json';
      el.id = scriptId;
      this.doc.head.appendChild(el);
    }
    el.textContent = JSON.stringify(obj);
  }
}
