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
    // ----- Meta (חיזוק Title ו-Description למיקוד שירותים ואזור) -----
    const canonical = 'https://cohenkazaz.law/services';
    
    // Title ממוקד: כעת כולל גישור בראש הרשימה
    const pageTitle = 'תחומי התמחות | עורך דין גישור, משפחה, גירושין, נדל״ן ומיסוי מקרקעין בקריית גת';
    
    // Description ממוקד: מפרט את השירותים הליבתיים באזור קרית גת ובית שמש.
    const description = 'משרד עורכי דין בקריית גת מתמחה: גישור (משפחה/עסקי), דיני משפחה (גירושין, ירושות), מקרקעין ונדל"ן (עסקאות מכר, ייצוג קבלנים). ליווי אישי בקריית גת והדרום.';
    const ogImage = 'https://cohenkazaz.law/assets/og-default.jpg';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    // Open Graph ו-Twitter (ממוקדים)
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
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

    // ----- JSON-LD (ללא שינוי, כי יצרנו כבר ישות גישור נפרדת שממוקדת לקרית גת) -----
    
    // יישות ארגונית קנונית (צריך להתאים ל-HOME)
    this.upsertJsonLd('legalservice-org', {
        '@context': 'https://schema.org',
        '@type': 'LegalService',
        '@id': 'https://cohenkazaz.law/#org',
        'name': 'כהן־קזז – משרד עורכי דין',
        'url': 'https://cohenkazaz.law/',
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'רח׳ חשוון 10, Publico Complex, קומה 3',
            'addressLocality': 'קריית גת',
            'addressRegion': 'מחוז הדרום',
            'addressCountry': 'IL'
        },
        'areaServed': ['קריית גת', 'קרית גת', 'בית שמש', 'הדרום', 'אשקלון'],
        'serviceType': ["דיני משפחה", "גירושין", "נדלן", "מיסוי מקרקעין", "גישור"]
    });

    // 1. Schema Markup עבור "דיני משפחה וגירושין" בקריית גת
    this.upsertJsonLd('family-service', {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "דיני משפחה וגירושין",
      "provider": { "@id": "https://cohenkazaz.law/#org" },
      "name": "עורך דין משפחה וגירושין בקריית גת",
      "areaServed": {
        "@type": "City",
        "name": "קריית גת"
      },
      "description": "ייצוג בהליכי גירושין, מזונות, משמורת, חלוקת רכוש והסכמי ממון בבית הדין הרבני ובתי המשפט לענייני משפחה."
    });

    // 2. Schema Markup עבור "מקרקעין ונדל"ן"
    this.upsertJsonLd('realestate-service', {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "דיני מקרקעין ונדלן",
      "provider": { "@id": "https://cohenkazaz.law/#org" },
      "name": "עורך דין מקרקעין ונדלן בקריית גת",
      "areaServed": {
        "@type": "City",
        "name": "קריית גת"
      },
      "description": "ליווי עסקאות מכר ורכישה, ייצוג קבלנים, מיסוי מקרקעין, מס שבח וטיפול בהתחדשות עירונית באזור הדרום."
    });
    
    // 3. Schema Markup עבור "גישור" (כבר ממוקד חזק)
    this.upsertJsonLd('mediation-service', {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "גישור משפחתי ועסקי",
      "provider": { "@id": "https://cohenkazaz.law/#org" },
      "name": "גישור בקריית גת",
      "areaServed": {
        "@type": "City",
        "name": "קריית גת"
      },
      "description": "ניהול הליכי גישור מקצועיים וחסויים להסדרת סכסוכי משפחה וסכסוכים אזרחיים, כולל גישור גירושין."
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