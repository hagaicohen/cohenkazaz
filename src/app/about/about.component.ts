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
    // טייטל/תיאור עם כל הווריאציות (לא משנה נראות)
    const pageTitle = 'אודות | כהן־קזז – עו״ד דיני משפחה וגירושין, נדל״ן (נדלן) וגישור בקריית/קרית גת';
    const description = 'הכירו את כהן־קזז – משרד עורכי דין בקריית/קרית גת: דיני משפחה וגירושין, נדל״ן (נדלן) ומיסוי מקרקעין וגישור. ניסיון, יחס אישי וליווי מקצועי.';

    const canonical = 'https://cohenkazaz.law/about';
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

    // ========= JSON-LD: LegalService (מחוזק בווריאציות ובאזורים) =========
    this.upsertJsonLd('about-legalservice', {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      'name': 'כהן־קזז – משרד עורכי דין',
      'url': 'https://cohenkazaz.law/',
      'serviceType': ['דיני משפחה','גירושין','נדל״ן','נדלן','מיסוי מקרקעין','גישור','מגשר'],
      'areaServed': ['קריית גת','קרית גת','בית שמש','ירושלים','הדרום'],
      'keywords': [
        // משפחה/גירושין
        'עורך דין משפחה קריית גת','עורך דין משפחה קרית גת','משרד עורכי דין משפחה קריית גת','משרד עורכי דין משפחה קרית גת',
        'עו״ד גירושין קריית גת','עו״ד גירושין קרית גת','עורך דין גירושין קריית גת','עורך דין גירושין קרית גת',
        // נדל״ן/נדלן
        'עורך דין נדל״ן קריית גת','עורך דין נדל״ן קרית גת','עורך דין נדלן קריית גת','עורך דין נדלן קרית גת',
        'משרד עורכי דין נדל״ן','משרד עורכי דין נדלן',
        // גישור
        'גישור קריית גת','גישור קרית גת','מגשר קריית גת','מגשר קרית גת','מגשרים קריית גת','מגשרים קרית גת'
      ],
      // שדות מועילים ללוקאלי
      'telephone': '+972-52-6706744',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'חשוון 10 (Publico)',
        'addressLocality': 'קריית גת',
        'addressCountry': 'IL'
      },
      'openingHours': 'Su-Th 09:00-18:00'
    });

    // ========= JSON-LD: Ofra =========
    this.upsertJsonLd('about-person-ofra', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'עפרה קזז',
      'jobTitle': 'עו״ד ומגשרת',
      'alumniOf': 'הקריה האקדמית אונו (LLB)',
      'worksFor': { '@type': 'LegalService', 'name': 'כהן־קזז – משרד עורכי דין' },
      'knowsAbout': ['מקרקעין','נדל״ן','נדלן','דיני משפחה','גירושין','אזרחי','ייפוי כוח מתמשך','גישור','מגשר']
    });

    // ========= JSON-LD: Hagai =========
    this.upsertJsonLd('about-person-hagai', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'חגי כהן',
      'jobTitle': 'עו״ד ומגשר',
      'alumniOf': [
        'אוניברסיטת בר-אילן (B.Sc מדעי הטבע)',
        'אוניברסיטת בר-אילן (LLB)'
      ],
      'worksFor': { '@type': 'LegalService', 'name': 'כהן־קזז – משרד עורכי דין' },
      'knowsAbout': ['מיסוי מקרקעין','אזרחי-מסחרי','נדל״ן','נדלן','דיני משפחה','גירושין','גישור','מגשר']
    });

    // ========= JSON-LD: Breadcrumbs =========
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
