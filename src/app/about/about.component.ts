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
    // ----- Page meta (שיפור המיקוד) -----
    const pageTitle = 'אודות | משרד עורכי דין מקרקעין ומשפחה (גירושין) בקריית גת, בית שמש והדרום';
    const description =
      'הכירו את כהן־קזז – משרד עורכי דין מוביל בקריית גת: דיני משפחה, גירושין, מקרקעין, נדל"ן, מיסוי והתחדשות עירונית. ניסיון, יחס אישי וליווי מקצועי.';
    const canonical = 'https://cohenkazaz.law/about';
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

    // ----- JSON-LD (שיפור תחומי השירות והידע) -----
    
    // ישות עסקית קנונית עם @id קבוע
    this.upsertJsonLd('about-legalservice', {
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
      'areaServed': ['קריית גת', 'בית שמש', 'ירושלים', 'הדרום', 'קרית מלאכי', 'אשקלון'],
      
      // הרחבת סוגי השירות
      'serviceType': [
        "דיני משפחה", "גירושין", "הסכם גירושין בהסכמה", "ירושות", "צוואות",
        "דיני מקרקעין", "נדלן", "התחדשות עירונית", "עסקאות מכר יד שניה",
        "ייצוג קבלנים", "ייצוג יזמים", "נכסים מסחריים", "גישור"
      ],
      
      'sameAs': ['https://www.facebook.com/profile.php?id=61560157382416'],
      'priceRange': '₪₪',
      'openingHours': 'Su-Th 09:00-18:00'
    });

    // פרופיל עו״ד עפרה קזז (שיפור knowsAbout)
    this.upsertJsonLd('about-person-ofra', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'עפרה קזז',
      'jobTitle': 'עו״ד ומגשרת',
      'alumniOf': 'הקריה האקדמית אונו (LLB)',
      'worksFor': { '@id': 'https://cohenkazaz.law/#org' },
      'knowsAbout': ['מקרקעין', 'דיני משפחה', 'גירושין', 'מזונות', 'ירושות', 'ייפוי כוח מתמשך']
    });

    // פרופיל עו״ד חגי כהן (שיפור knowsAbout)
    this.upsertJsonLd('about-person-hagai', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'חגי כהן',
      'jobTitle': 'עו״ד ומגשר',
      'alumniOf': [
        'אוניברסיטת בר-אילן (B.Sc מדעי הטבע)',
        'אוניברסיטת בר-אילן (LLB)'
      ],
      'worksFor': { '@id': 'https://cohenkazaz.law/#org' },
      'knowsAbout': ['מיסוי מקרקעין', 'נדל״ן', 'התחדשות עירונית', 'נכסים מסחריים', 'גישור']
    });

    // Breadcrumbs של העמוד (ללא שינוי)
    this.upsertJsonLd('about-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'דף הבית', 'item': 'https://cohenkazaz.law/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'אודות', 'item': canonical }
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