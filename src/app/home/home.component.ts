import { Component, Inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    const pageTitle =
      'כהן-קזז | משרד עורכי דין בקריית גת – נדל״ן, מיסוי מקרקעין, דיני משפחה וירושה';
    const description =
      'משרד עורכי הדין כהן-קזז מעניק ליווי אישי ומקצועי בעסקאות נדל״ן, מס שבח ומס רכישה, הסכמי ממון, צוואות וירושות וגישור. שירות בפריסה: קריית גת, הדרום, בית שמש וירושלים.';
    const canonical = 'https://cohenkazaz.law/';

    // Title + Description
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });

    // Open Graph (ללא תמונה לעת עתה)
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

    // JSON-LD (LegalService) – ללא image כרגע
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      name: 'כהן-קזז, משרד עורכי דין',
      url: canonical,
      telephone: '+972-52-6706744',
      email: 'office@cohen-kazaz.law',
      address: {
        '@type': 'PostalAddress',
        streetAddress: "רח׳ חשוון 10, Publico Complex, קומה 3",
        addressLocality: 'קריית גת',
        addressRegion: 'מחוז הדרום',
        addressCountry: 'IL'
      },
      areaServed: ['קריית גת','הדרום','בית שמש','ירושלים'],
      openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday','Monday','Tuesday','Wednesday','Thursday'],
        opens: '09:00',
        closes: '18:00'
      }]
    };
    this.upsertJsonLd('legalservice-home', jsonLd);
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
