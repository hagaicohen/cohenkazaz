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
    // ----- Meta (אחיד, ללא וריאציות "קריית/קרית") -----
    const canonical = 'https://cohenkazaz.law/';
    const pageTitle = 'כהן־קזז | עורך דין משפחה, גירושין, נדל״ן וגישור בקריית גת';
    const description = 'כהן־קזז – משרד עורכי דין בקריית גת: דיני משפחה וגירושין, דיני מקרקעין ונדל״ן, מיסוי מקרקעין וגישור. שירות מקצועי ורגיש בקריית גת, הדרום, בית שמש וירושלים.';
    const ogImage = 'https://cohenkazaz.law/assets/og-default.jpg';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'כהן־קזז – משרד עורכי דין' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });

    // Canonical
    let linkEl = this.doc.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!linkEl) {
      linkEl = this.doc.createElement('link');
      linkEl.rel = 'canonical';
      this.doc.head.appendChild(linkEl);
    }
    linkEl.href = canonical;

    // ----- JSON-LD -----
    // ישות עסקית קנונית עם @id קבוע (אליה עמודים אחרים מפנים)
    this.upsertJsonLd('legalservice-org', {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      '@id': 'https://cohenkazaz.law/#org',
      'name': 'כהן־קזז – משרד עורכי דין',
      'url': 'https://cohenkazaz.law/',
      'image': ogImage,
      'telephone': '+972-52-6706744',
      'email': 'office@cohenkazaz.law',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'רח׳ חשוון 10, Publico Complex, קומה 3',
        'addressLocality': 'קריית גת',
        'addressRegion': 'מחוז הדרום',
        'addressCountry': 'IL'
      },
      'areaServed': ['קריית גת', 'בית שמש', 'ירושלים', 'הדרום'],
      'serviceType': ['דיני משפחה', 'גירושין', 'נדל״ן', 'מיסוי מקרקעין', 'גישור'],
      'sameAs': ['https://www.facebook.com/profile.php?id=61560157382416'],
      'priceRange': '₪₪',
      'openingHours': 'Su-Th 09:00-18:00'
    });

    // WebSite + SearchAction (השאר רק אם קיים חיפוש באתר בנתיב ?s=)
    this.upsertJsonLd('website-entity', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'כהן־קזז – משרד עורכי דין',
      'url': canonical,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${canonical}?s={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });

    // FAQPage (אם יש תוכן מתאים בדף הבית)
    this.upsertJsonLd('home-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'איך מתחילים תהליך גירושין נכון בקריית גת?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'קובעים פגישת היכרות, ממפים סוגיות (ילדים/רכוש/מזונות), בוחנים גישור ובונים אסטרטגיה מותאמת.' }
        },
        {
          '@type': 'Question',
          'name': 'מה כולל הליווי בעסקאות נדל״ן?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'בדיקות מקדמיות, חוזים, מס רכישה/שבח, השגות ורישום זכויות עד הסגירה.' }
        },
        {
          '@type': 'Question',
          'name': 'מהו תהליך גישור?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'פגישות חסויות ומובנות, שיח מכבד, ניסוח הסכמות וטיוטת הסכם משפטי.' }
        }
      ]
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
