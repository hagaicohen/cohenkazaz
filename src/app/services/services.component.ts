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
    // טייטל/דסקריפשן עם הווריאציות (ללא שינוי נראות)
    const pageTitle = 'תחומי התמחות | כהן־קזז – עורך דין משפחה, גירושין, נדל״ן (נדלן) וגישור בקריית/קרית גת';
    const description =
      'כהן־קזז – משרד עורכי דין בקריית/קרית גת: עורך דין משפחה וגירושין (משמורת, מזונות, הסכמי ממון, צווי הגנה, ירושות), לצד נדל״ן (נדלן) ומיסוי מקרקעין (עסקאות, מס שבח/רכישה, השגות). ליווי אישי ומקצועי.';

    const canonical = 'https://cohenkazaz.law/services';
    const ogImage = 'https://cohenkazaz.law/assets/og-default.jpg';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
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

    // ========= LegalService מורחב (שקט; מכיל כל הווריאציות) =========
    this.upsertJsonLd('services-legalservice', {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      'name': 'כהן־קזז – משרד עורכי דין',
      'url': canonical,
      'image': ogImage,
      'areaServed': ['קריית גת','קרית גת','בית שמש','ירושלים','הדרום'],
      'serviceType': ['דיני משפחה','גירושין','נדל״ן','נדלן','מיסוי מקרקעין','גישור','משפט אזרחי','מגשר'],
      'keywords': [
        // משפחה/גירושין
        'עורך דין משפחה קריית גת','עורך דין משפחה קרית גת',
        'משרד עורכי דין משפחה קריית גת','משרד עורכי דין משפחה קרית גת',
        'עו״ד גירושין קריית גת','עו״ד גירושין קרית גת','עורך דין גירושין',
        // נדל״ן/נדלן
        'דיני מקרקעין','עסקאות נדל״ן','עסקאות נדלן',
        'מס שבח','מס רכישה','השגות מס',
        'עורך דין נדל״ן קריית גת','עורך דין נדל״ן קרית גת','עורך דין נדלן קריית גת','עורך דין נדלן קרית גת',
        // גישור/מגשר
        'גישור קריית גת','גישור קרית גת','מגשר קריית גת','מגשר קרית גת','מגשרים קריית גת','מגשרים קרית גת'
      ]
    });

    // ========= FAQPage שקוף (לא משנה UI) =========
    this.upsertJsonLd('services-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'מה כולל הליווי שלכם בעסקאות נדל״ן (נדלן)?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'בדיקות מקדמיות, חוזים, מס רכישה/שבח, השגות ורישום זכויות עד הסגירה.' }
        },
        {
          '@type': 'Question',
          'name': 'איך מתחילים תהליך גירושין בצורה נכונה בקריית/קרית גת?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'פגישת היכרות, מיפוי סוגיות (ילדים/רכוש/מזונות), בחינת גישור ובניית אסטרטגיה.' }
        },
        {
          '@type': 'Question',
          'name': 'מה כולל גישור אצל מגשר מוסמך?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'פגישות חסויות, ניהול שיח מכבד, ניסוח הסכמות וטיוטת הסכם משפטי.' }
        }
      ]
    });

    // ========= Breadcrumbs =========
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
