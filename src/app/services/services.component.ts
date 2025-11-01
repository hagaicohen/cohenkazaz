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
    const pageTitle = 'תחומי התמחות | כהן־קזז – עו״ד דיני משפחה וגירושין בקריית גת, נדל״ן ומיסוי מקרקעין';
    const description =
      'כהן־קזז – משרד עורכי דין בקריית גת: דיני משפחה וגירושין (משמורת, מזונות, הסכמי ממון, צווי הגנה, ירושות), לצד נדל״ן ומיסוי מקרקעין (עסקאות, מס שבח/רכישה, השגות). ליווי אישי ומקצועי.';
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

    // LegalService מורחב
    this.upsertJsonLd('services-legalservice', {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      'name': 'כהן־קזז, משרד עורכי דין',
      'url': canonical,
      'image': ogImage,
      'areaServed': ['קריית גת', 'הדרום', 'בית שמש', 'ירושלים'],
      'serviceType': ['דיני משפחה','גירושין','נדל״ן','מיסוי מקרקעין','גישור','משפט אזרחי'],
      'keywords': [
        'עו״ד דיני משפחה קריית גת',
        'עו״ד גירושין קריית גת',
        'עורך דין גירושין',
        'משמורת','מזונות','הסכמי ממון','צווי הגנה',
        'דיני מקרקעין','מס שבח','מס רכישה','השגות מס','עסקאות נדל״ן',
        'גישור'
      ]
    });

    // FAQPage שקוף (ללא שינוי תוכן גלוי)
    this.upsertJsonLd('services-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'האם שיחה ראשונה בתשלום?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'שיחה ראשונה ללא התחייבות – כדי להבין את הצורך ולהציע כיוון פעולה.' }
        },
        {
          '@type': 'Question',
          'name': 'מה עדיף – גישור או הליך משפטי?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'כאשר ניתן – גישור חוסך זמן, כסף ועימות. כשצריך – ננהל הליך משפטי בנחישות.' }
        },
        {
          '@type': 'Question',
          'name': 'האם מטפלים גם במס שבח/רכישה ותכנוני מס?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'כן. ליווי מלא בעסקאות נדל״ן כולל היבטי מס שבח/רכישה, השגות ותכנוני מס.' }
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
