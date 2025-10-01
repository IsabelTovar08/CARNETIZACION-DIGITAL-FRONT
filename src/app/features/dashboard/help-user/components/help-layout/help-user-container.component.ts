import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule,  } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Section = 'faq' | 'productos' | 'evento' | 'servicio';

interface FaqItem {
  id: string;
  text: string;
  answer: string;
}

interface SideItem {
  id: Section;
  label: string;
  icon: string;
}

@Component({
  standalone: true,
  selector: 'app-help-user-container',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './help-user-container.component.html',
  styleUrls: ['./help-user-container.component.css']
})
export class HelpUserContainerComponent {
  constructor(private http: HttpClient) {}
  private dataMap: Record<Section, string> = {
  faq: 'frequenly-asked-questions.json',   
  productos: 'product-inquiries.json',
  evento: 'how-do-create-an-event.json',
  servicio: 'service-offeredn.json'
};


  expandedId: string | null = null;
  query = '';
  section: Section = 'faq';

  sections: SideItem[] = [
    { id: 'faq', label: 'Consultas Frecuentes', icon: 'description' },
    { id: 'productos', label: 'Consulta sobre productos', icon: 'shopping_bag' },
    { id: 'evento', label: 'Como creo un evento', icon: 'event_note' },
    { id: 'servicio', label: 'Servicio ofrecido', icon: 'handshake' },
  ];

  faqs: FaqItem[] = [];
  productos: any = null;
  evento: any = null;
  servicio: any = null;

  ngOnInit() {
    this.loadSection('faq');
  }

  setSection(s: Section) {
    this.section = s;
    this.loadSection(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

loadSection(s: Section) {
  const fileName = this.dataMap[s];
  this.http.get(`assets/help-user/data/${fileName}`)
    .subscribe(data => {
      console.log('Datos cargados de', fileName, data); 
      if (s === 'faq') this.faqs = data as FaqItem[];
      if (s === 'productos') this.productos = data;
      if (s === 'evento') this.evento = data;
      if (s === 'servicio') this.servicio = data;
    });
}

  get filteredFaqs(): FaqItem[] {
    const q = this.query.trim().toLowerCase();
    return !q ? this.faqs : this.faqs.filter(f => f.text.toLowerCase().includes(q));
  }

  search() {
    console.log('Búsqueda:', this.query);
  }

  toggleFaq(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }
}
