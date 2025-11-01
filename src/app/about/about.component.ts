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
    const pageTitle = 'אודות | כהן־קזז – עו״ד דיני משפחה וגירושין, נדל״ן ומיסוי מקרקעין בקריית גת';
    const description = 'הכירו את כהן־קזז – משרד עורכי דין בקריית גת, עם התמחות בדיני משפחה וגירושין, נדל״ן ומיסוי מקרקעין. ניסיון, יחס אישי וליווי מקצועי.';

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

    this.upsertJsonLd('about-legalservice', {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      'name': 'כהן־קזז – משרד עורכי דין',
      'url': 'https://cohenkazaz.law/',
      'serviceType': ['דיני משפחה','גירושין','נדל״ן','מיסוי מקרקעין'],
      'keywords': [
        'עו״ד גירושין קריית גת',
        'עורך דין משפחה קרית/קריית גת',
        'משמורת','מזונות','הסכמי ממון',
        'נדל״ן','מיסוי מקרקעין'
      ]
    });

    this.upsertJsonLd('about-person-ofra', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'עפרה קזז',
      'jobTitle': 'עו״ד ומגשרת',
      'alumniOf': 'הקריה האקדמית אונו (LLB)',
      'worksFor': { '@type': 'LegalService', 'name': 'כהן־קזז – משרד עורכי דין' },
      'knowsAbout': ['מקרקעין','נדל״ן','דיני משפחה','גירושין','אזרחי','ייפוי כוח מתמשך']
    });

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
      'knowsAbout': ['מיסוי מקרקעין','אזרחי-מסחרי','נדל״ן','דיני משפחה','גירושין']
    });

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
