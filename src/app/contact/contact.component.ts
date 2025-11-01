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
    const pageTitle = 'צור קשר | כהן־קזז – דיני משפחה, גירושין, נדל״ן ומיסוי מקרקעין';
    const description = 'צרו קשר עם כהן־קזז – משרד עורכי דין בקריית גת: ייעוץ מקצועי בדיני משפחה וגירושין, נדל״ן ומיסוי מקרקעין. כתובת: רח׳ חשוון 10 (Publico). טלפון: 052-6706744 (חגי), 054-6949137 (עפרה).';

    const canonical = 'https://cohenkazaz.law/contact';
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

    // ContactPage
    this.upsertJsonLd('contact-page', {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'צור קשר – כהן־קזז, משרד עורכי דין',
      'url': canonical,
      'about': [
        'דיני משפחה', 'גירושין', 'משמורת', 'מזונות', 'הסכמי ממון',
        'צווי הגנה', 'נדל״ן', 'מיסוי מקרקעין'
      ],
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'דף הבית', 'item': 'https://cohenkazaz.law/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'צור קשר', 'item': canonical }
        ]
      }
    });

    // LegalService
    this.upsertJsonLd('legalservice-contact', {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      'name': 'כהן־קזז – משרד עורכי דין',
      'url': 'https://cohenkazaz.law/',
      'image': ogImage,
      'keywords': [
        'עו״ד דיני משפחה קריית גת',
        'עו״ד גירושין קריית גת',
        'משמורת', 'מזונות', 'הסכמי ממון', 'צווי הגנה',
        'נדל״ן', 'מיסוי מקרקעין'
      ],
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'רחוב חשוון 10, קומה ג׳ (מתחם פבליקו)',
        'addressLocality': 'קריית גת',
        'addressRegion': 'מחוז הדרום',
        'addressCountry': 'IL'
      },
      'contactPoint': [
        { '@type': 'ContactPoint', 'telephone': '+972-52-6706744', 'contactType': 'customer service', 'areaServed': ['IL'], 'availableLanguage': ['he'] },
        { '@type': 'ContactPoint', 'telephone': '+972-54-6949137', 'contactType': 'customer service', 'areaServed': ['IL'], 'availableLanguage': ['he'] }
      ],
      'openingHoursSpecification': [{
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Sunday','Monday','Tuesday','Wednesday','Thursday'],
        'opens': '09:00',
        'closes': '18:00'
      }],
      'sameAs': ['https://www.facebook.com/profile.php?id=61560157382416'],
      'areaServed': ['קריית גת','בית שמש','ירושלים','הדרום'],
      'priceRange': '₪₪',
      'serviceType': ['דיני משפחה','גירושין','נדל״ן','מיסוי מקרקעין']
    });

    this.upsertJsonLd('contact-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'דף הבית', 'item': 'https://cohenkazaz.law/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'צור קשר', 'item': canonical }
      ]
    });

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
