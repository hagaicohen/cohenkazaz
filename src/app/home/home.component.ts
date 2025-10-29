import { Component, Inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
    private router: Router
  ) {}

  ngOnInit(): void {
    const pageTitle =
      'כהן-קזז | משרד עורכי דין בקריית גת – דיני משפחה, נדל״ן ומיסוי מקרקעין';
    const description =
      'כהן-קזז – משרד עורכי דין בקריית גת: מומחים בדיני משפחה, דיני מקרקעין, מיסוי מקרקעין, ירושות, צוואות וגישור. שירות מקצועי ורגיש בקריית גת, הדרום, בית שמש וירושלים.';
    const canonical = 'https://cohenkazaz.law/';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'כהן-קזז, משרד עורכי דין' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    let linkEl = this.doc.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!linkEl) {
      linkEl = this.doc.createElement('link');
      linkEl.rel = 'canonical';
      this.doc.head.appendChild(linkEl);
    }
    linkEl.href = canonical;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      name: 'כהן-קזז, משרד עורכי דין',
      url: canonical,
      telephone: '+972-52-6706744',
      email: 'office@cohenkazaz.law',
      keywords: [
        'דיני משפחה',
        'גירושין',
        'הסכמי ממון',
        'משמורת',
        'צוואות וירושות',
        'דיני מקרקעין',
        'מיסוי מקרקעין'
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: "רח׳ חשוון 10, Publico Complex, קומה 3",
        addressLocality: 'קריית גת',
        addressRegion: 'מחוז הדרום',
        addressCountry: 'IL'
      },
      areaServed: ['קריית גת', 'הדרום', 'בית שמש', 'ירושלים'],
      openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday','Monday','Tuesday','Wednesday','Thursday'],
        opens: '09:00',
        closes: '18:00'
      }]
    };
    this.upsertJsonLd('legalservice-home', jsonLd);
  }

  goToContact(): void {
    this.router.navigate(['/contact']);
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
