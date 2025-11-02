import { Component, OnInit, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    // ----- Meta (אחיד, ללא וריאציות "קריית/קרית") -----
    const canonical  = 'https://cohenkazaz.law/services';
    const pageTitle  = 'תחומי התמחות | כהן־קזז – עורך דין משפחה, גירושין, נדל״ן וגישור בקריית גת';
    const description = 'כהן־קזז – משרד עורכי דין בקריית גת: משפחה וגירושין (משמורת, מזונות, הסכמי ממון, צוואות/ירושות, ייפוי כוח מתמשך), לצד נדל״ן ומיסוי מקרקעין (עסקאות, מס שבח/רכישה, השגות). ליווי אישי ומקצועי.';
    const ogImage    = 'https://cohenkazaz.law/assets/og-default.jpg';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: 'website' });
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
    // ישות עסקית קנונית עם @id קבוע (כמו בעמודים אחרים)
    this.upsertJsonLd('services-legalservice-org', {
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

    // FAQPage ייעודי לעמוד "תחומי התמחות"
    this.upsertJsonLd('services-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'מה כולל הליווי שלכם בעסקאות נדל״ן?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'בדיקות מקדמיות, חוזים, מס רכישה/שבח, השגות ורישום זכויות עד הסגירה.'
          }
        },
        {
          '@type': 'Question',
          'name': 'איך מתחילים תהליך גירושין בצורה נכונה בקריית גת?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'פגישת היכרות, מיפוי סוגיות (ילדים/רכוש/מזונות), בחינת גישור ובניית אסטרטגיה מותאמת.'
          }
        },
        {
          '@type': 'Question',
          'name': 'מהו תהליך גישור ולמי הוא מתאים?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'תהליך חסוי ומובנה שמטרתו להגיע להסכמות במהירות וביעילות, תוך שמירה על יחסים תקינים.'
          }
        }
      ]
    });

    // Breadcrumbs
    this.upsertJsonLd('services-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'דף הבית', 'item': 'https://cohenkazaz.law/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'תחומי התמחות', 'item': canonical }
      ]
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
