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
    // ----- Meta (חיזוק Title ו-Description) -----
    const canonical = 'https://cohenkazaz.law/';
    
    // Title ממוקד: כולל עורך דין, מקרקעין, משפחה, גירושין ומיקומים.
    const pageTitle = 'עורך דין מקרקעין ומשפחה (גירושין) בקרית גת, בית שמש והדרום | כהן־קזז';
    
    // Description ממוקד: כולל ייצוג קבלנים, התחדשות עירונית, ירושות וצוואות.
    const description = 'משרד עורכי דין מוביל בקריית גת ובית שמש: מומחים בנדל"ן, ייצוג קבלנים, התחדשות עירונית, וכן דיני משפחה, גירושין, ירושות וצוואות. שירות מקצועי ואנושי.';
    
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

    // ----- JSON-LD (הרחבת LegalService ו-FAQ) -----
    // ישות עסקית קנונית עם @id קבוע (הרחבת שירותים ואזורים)
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
      // הרחבת areaServed
      'areaServed': ['קריית גת', 'קרית גת', 'בית שמש', 'ירושלים', 'הדרום', 'אשקלון', 'קרית מלאכי'], 
      
      // הרחבת serviceType לכלול את כלל הנושאים
      'serviceType': [
        "דיני משפחה", "גירושין", "הסכם גירושין בהסכמה", "ירושות", "צוואות", "ייפוי כוח מתמשך", 
        "דיני מקרקעין", "נדלן", "התחדשות עירונית", "עסקאות מכר יד שניה",
        "ייצוג קבלנים", "ייצוג יזמים", "נכסים מסחריים", "גישור"
      ],
      'sameAs': ['https://www.facebook.com/profile.php?id=61560157382416'],
      'priceRange': '₪₪',
      'openingHours': 'Su-Th 09:00-18:00'
    });

    // WebSite + SearchAction (ללא שינוי)
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

    // FAQPage (שיפור התשובות לכלול יותר ביטויים)
    this.upsertJsonLd('home-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'איך מתחילים תהליך גירושין נכון בקריית גת?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'קובעים פגישת היכרות עם עורך דין משפחה, ממפים סוגיות (ילדים/רכוש/מזונות), בוחנים גישור ובונים אסטרטגיה להסכם גירושין.' }
        },
        {
          '@type': 'Question',
          'name': 'מה כולל ליווי עורך דין בעסקאות נדל״ן?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'בדיקות זכויות מקיפות, ניהול מו"מ, עריכת חוזים, תכנון מס שבח ורכישה, הגשת השגות ורישום זכויות סופי בטאבו. מתמחים גם בייצוג קבלנים ובהתחדשות עירונית.' }
        },
        {
          '@type': 'Question',
          'name': 'מהו תהליך גישור משפחתי?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'הליכי גישור חסויים ומובנים שמטרתם להגיע להסכמות על חלוקת רכוש, משמורת ומזונות, מבלי להיגרר להליכים משפטיים יקרים וממושכים בבתי המשפט או בבית הדין הרבני.' }
        }
      ]
    });

    // Breadcrumbs (ללא שינוי)
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