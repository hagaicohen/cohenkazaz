import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /** בקשת מעבר לחלק אחר באתר (למשל 'contact' או 'services#family-law') */
  @Output() navigate = new EventEmitter<string>();

  /**
   * עיצוב ה-Hero בדף הבית:
   *  'team'   – תמונת הצוות (hero-team-desktop / hero-team-mobile)
   *  'office' – העיצוב הקודם עם תמונת המשרד (office3.jpg)
   * למעבר בין העיצובים: לשנות את הערך (ולעדכן את ה-preload ב-index.html).
   */
  readonly heroVariant: 'team' | 'office' = 'office';

  readonly practiceAreas = [
    {
      title: 'מקרקעין ומיסוי מקרקעין',
      text: 'ליווי בעסקאות מכר ורכישה, ייצוג קבלנים ויזמים והתחדשות עירונית, לצד ייעוץ במס שבח ומס רכישה, השגות על שומות ותכנון מס.',
      anchor: 'real-estate',
      icon: ['M3 21h18', 'M5 21V8l7-5 7 5v13', 'M10 21v-5h4v5', 'M9 11h6']
    },
    {
      title: 'דיני משפחה וירושה',
      text: 'גירושין וחלוקת רכוש, משמורת וזמני שהות, מזונות והסכמי ממון, לצד עריכת צוואות, צווי ירושה וייפוי כוח מתמשך.',
      anchor: 'family-law',
      icon: ['M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6', 'M16 11a2.5 2.5 0 1 0 0-5', 'M17 14c2.4.4 4 2.6 4 5']
    },
    {
      title: 'גישור ויישוב סכסוכים',
      text: 'הליכי גישור משפחתיים ואזרחיים, המתמקדים בשיח מכבד ובהגעה להסכמות שניתן לעגן בהסכם משפטי ברור ואכיף.',
      anchor: 'mediation',
      icon: ['M12 3v18', 'M7 21h10', 'M4 7h16', 'M4 7l-3 6a3 3 0 0 0 6 0z', 'M20 7l-3 6a3 3 0 0 0 6 0z']
    }
  ];

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
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

  go(target: string, event?: Event): void {
    event?.preventDefault();
    this.navigate.emit(target);
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