import { Component, OnInit, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(
    private title: Title,
    private meta: Meta,
    private fb: FormBuilder,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    // ----- Meta (אחיד, ללא וריאציות "קריית/קרית") -----
    const pageTitle = 'צור קשר | כהן־קזז – עורך דין משפחה, גירושין, נדל״ן וגישור בקריית גת';
    const description = 'צרו קשר עם כהן־קזז – משרד עורכי דין בקריית גת: משפחה וגירושין, נדל״ן, גישור ומיסוי מקרקעין. כתובת: חשוון 10 (Publico), קומה 3. טל: 052-670-6744 (חגי), 054-694-9137 (עפרה).';
    const canonical = 'https://cohenkazaz.law/contact';
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

    // ----- JSON-LD (רק מה שרלוונטי לעמוד "צור קשר") -----
    // ישות עסקית קנונית עם @id קבוע
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
      'areaServed': ['קריית גת', 'בית שמש', 'ירושלים', 'הדרום'],
      'serviceType': ['דיני משפחה', 'גירושין', 'נדל״ן', 'מיסוי מקרקעין', 'גישור'],
      'sameAs': ['https://www.facebook.com/profile.php?id=61560157382416'],
      'priceRange': '₪₪',
      'openingHours': 'Su-Th 09:00-18:00',
      'contactPoint': [
        { '@type': 'ContactPoint', 'telephone': '+972-52-6706744', 'contactType': 'customer service', 'areaServed': ['IL'], 'availableLanguage': ['he'] },
        { '@type': 'ContactPoint', 'telephone': '+972-54-6949137', 'contactType': 'customer service', 'areaServed': ['IL'], 'availableLanguage': ['he'] }
      ]
    });

    // ContactPage שמפנה לישות העסקית הקבועה
    this.upsertJsonLd('contact-page', {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'צור קשר – כהן־קזז, משרד עורכי דין',
      'url': canonical,
      'about': ['דיני משפחה', 'גירושין', 'נדל״ן', 'מיסוי מקרקעין', 'גישור'],
      'mainEntityOfPage': { '@id': 'https://cohenkazaz.law/#org' }
    });

    // Breadcrumbs
    this.upsertJsonLd('contact-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'דף הבית', 'item': 'https://cohenkazaz.law/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'צור קשר', 'item': canonical }
      ]
    });

    // ----- Form -----
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      message: ['', Validators.required]
    });
  }

  sendWhatsApp(phone: string) {
    const text = encodeURIComponent('שלום, אשמח לשוחח בקשר לייעוץ משפטי.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      // כאן תוכל להחליף בשליחה בפועל (HTTP) לשרת שלך
    }
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
