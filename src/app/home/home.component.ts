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
    const pageTitle   = 'כהן-קזז | משרד עורכי דין בקריית גת – דיני משפחה, גירושין, נדל״ן ומיסוי מקרקעין';
    const description = 'כהן-קזז – משרד עורכי דין בקריית גת: מומחים בדיני משפחה וגירושין, דיני מקרקעין ומיסוי מקרקעין, ירושות, צוואות וגישור. שירות מקצועי ורגיש בקריית גת, הדרום, בית שמש וירושלים.';

    const canonical = 'https://cohenkazaz.law/';
    const ogImage = 'https://cohenkazaz.law/assets/og-default.jpg';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'כהן-קזז, משרד עורכי דין' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:image', content: ogImage });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });

    let linkEl = this.doc.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!linkEl) {
      linkEl = this.doc.createElement('link');
      linkEl.rel = 'canonical';
      this.doc.head.appendChild(linkEl);
    }
    linkEl.href = canonical;

    // LegalService
    this.upsertJsonLd('legalservice-home', {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      'name': 'כהן-קזז, משרד עורכי דין',
      'url': canonical,
      'telephone': '+972-52-6706744',
      'email': 'office@cohenkazaz.law',
      'image': ogImage,
      'keywords': [
        'עו״ד דיני משפחה קריית גת',
        'עו״ד גירושין קריית גת',
        'עורך דין משפחה קרית גת',
        'משמורת','מזונות','הסכמי ממון','צווי הגנה',
        'דיני מקרקעין','נדל״ן','מיסוי מקרקעין'
      ],
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'רח׳ חשוון 10, Publico Complex, קומה 3',
        'addressLocality': 'קריית גת',
        'addressRegion': 'מחוז הדרום',
        'addressCountry': 'IL'
      },
      'areaServed': ['קריית גת', 'הדרום', 'בית שמש', 'ירושלים'],
      'openingHoursSpecification': [{
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Sunday','Monday','Tuesday','Wednesday','Thursday'],
        'opens': '09:00',
        'closes': '18:00'
      }],
      'sameAs': ['https://www.facebook.com/profile.php?id=61560157382416'],
      'serviceType': ['דיני משפחה','גירושין','נדל״ן','מיסוי מקרקעין'],
      'priceRange': '₪₪'
    });

    // WebSite + SearchAction
    this.upsertJsonLd('website-entity', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'כהן-קזז – משרד עורכי דין',
      'url': canonical,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${canonical}?s={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });

    // Breadcrumbs
    this.upsertJsonLd('home-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'דף הבית', 'item': canonical }
      ]
    });
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
