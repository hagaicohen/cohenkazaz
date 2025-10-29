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
    const pageTitle = 'תחומי התמחות | כהן־קזז – דיני מקרקעין, מיסוי מקרקעין ודיני משפחה';
    const description =
      'כהן־קזז – משרד עורכי דין בקריית גת המתמחה בדיני מקרקעין, מיסוי מקרקעין, דיני משפחה, ירושות, צוואות וגישור. ליווי אישי ומקצועי מקריית גת ועד ירושלים.';
    const canonical = 'https://cohenkazaz.law/services';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    let linkEl = this.doc.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!linkEl) {
      linkEl = this.doc.createElement('link');
      linkEl.rel = 'canonical';
      this.doc.head.appendChild(linkEl);
    }
    linkEl.href = canonical;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      name: 'כהן־קזז, משרד עורכי דין',
      url: canonical,
      areaServed: ['קריית גת', 'הדרום', 'בית שמש', 'ירושלים'],
      keywords: [
        'דיני מקרקעין',
        'מיסוי מקרקעין',
        'עסקאות נדל״ן',
        'דיני משפחה',
        'גירושין',
        'הסכמי ממון',
        'צוואות וירושות',
        'ייפוי כוח מתמשך',
        'גישור'
      ]
    };

    this.upsertJsonLd('services-legalservice', jsonLd);
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
