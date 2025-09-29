import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Section = 'faq' | 'productos' | 'evento' | 'servicio';

interface FaqItem { 
  id: string; 
  text: string; 
}

interface SideItem { 
  id: Section; 
  label: string; 
  icon: string; 
}

@Component({
  standalone: true,
  selector: 'app-help-user-container',
  imports: [CommonModule, FormsModule],
  templateUrl: './help-user-container.component.html',
  styleUrls: ['./help-user-container.component.css']
})
export class HelpUserContainerComponent {
  // Buscador
  query = '';
  
  search() { 
    // El filtro es reactivo a través del getter filteredFaqs
    // El botón existe por consistencia de UI
    console.log('Búsqueda:', this.query);
  }

  // Menú lateral
  section: Section = 'faq';
  
  sections: SideItem[] = [
    { id: 'faq',       label: 'Consultas Frecuentes',     icon: 'description' },
    { id: 'productos', label: 'Consulta sobre productos', icon: 'shopping_bag' },
    { id: 'evento',    label: 'Como creo un evento',      icon: 'event_note' },
    { id: 'servicio',  label: 'Servicio ofrecido',        icon: 'handshake' },
  ];
  
  setSection(s: Section) { 
    this.section = s; 
    // Scroll suave al inicio cuando cambie de sección
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }

  // Datos FAQ
  faqs: FaqItem[] = [
    { id: 'f1', text: '¿Cómo puedo generar un nuevo carnet para un usuario?' },
    { id: 'f2', text: '¿Qué hago si un carnet tiene un error en la información?' },
    { id: 'f3', text: '¿Qué hago si un usuario pierde su carnet digital?' },
    { id: 'f4', text: '¿Quiénes pueden acceder al sistema de carnetización?' },
    { id: 'f5', text: '¿Puedo descargar o imprimir el carnet digital?' },
    { id: 'f6', text: '¿Cómo restablezco la contraseña de acceso al sistema?' },
  ];
  
  // Getter reactivo para filtrar FAQs
  get filteredFaqs(): FaqItem[] {
    const q = this.query.trim().toLowerCase();
    return !q ? this.faqs : this.faqs.filter(f => f.text.toLowerCase().includes(q));
  }
}