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
    const pageTitle = 'אודות | כהן־קזז – משרד עורכי דין';
    const description =
      'הכירו את צוות כהן־קזז: עו״ד עפרה קזז (אזרחי, מקרקעין, משפחה; ייפוי כוח מתמשך) ועו״ד חגי כהן (מיסוי מקרקעין, אזרחי-מסחרי). ניסיון מגוון וליווי אישי.';
    const canonical = 'https://cohenkazaz.vercel.app/about';

    // Title + Description
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });

    // Open Graph (בלי תמונה כרגע)
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
      'url': 'https://cohenkazaz.vercel.app/',
      'areaServed': ['קריית גת','הדרום','בית שמש','ירושלים']
    });

    // JSON-LD: עו״ד עפרה קזז
    this.upsertJsonLd('about-person-ofra', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'עפרה קזז',
      'jobTitle': 'עו״ד ומגשרת',
      'alumniOf': 'הקריה האקדמית אונו (LLB)',
      'worksFor': { '@type': 'LegalService', 'name': 'כהן־קזז, משרד עורכי דין' },
      'knowsAbout': ['מקרקעין','דיני משפחה','אזרחי','ייפוי כוח מתמשך']
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
