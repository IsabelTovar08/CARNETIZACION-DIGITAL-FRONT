// dashboard-footer.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface FooterLink {
  label: string;
  route: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: string;
  url: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-dashboard-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-footer.component.html',
  styleUrl: './dashboard-footer.component.css'
})
export class DashboardFooterComponent {
  currentYear = new Date().getFullYear();
  
  // Configuración de columnas del footer
  footerColumns: FooterColumn[] = [
    {
      title: 'SOBRE EL PROYECTO',
      links: [
        { label: 'Quiénes Somos', route: '/quienes-somos' },
        { label: 'Nuestra Tecnología', route: '/nuestra-tecnologia' },
        { label: 'Casos de Uso', route: '/casos-de-uso' },
        { label: 'Preguntas Frecuentes', route: '/preguntas-frecuentes' }
      ]
    },
    {
      title: 'SERVICIOS',
      links: [
        { label: 'Emisión de Carnets Digitales', route: '/emision-carnets' },
        { label: 'Validación en Línea', route: '/validacion-linea' },
        { label: 'Roles y Perfiles Personalizados', route: '/roles-perfiles' },
        { label: 'Integración con Sistemas', route: '/integracion-sistemas' },
        { label: 'Soporte Técnico', route: '/soporte-tecnico' }
      ]
    },
    {
      title: 'RECURSOS',
      links: [
        { label: 'Blog / Noticias', route: '/blog' },
        { label: 'Documentación Técnica', route: '/documentacion' },
        { label: 'Tutoriales y Guías', route: '/tutoriales' },
        { label: 'Descarga de App', route: '/descarga-app' }
      ]
    },
    {
      title: 'CONTACTO',
      links: [
        { label: 'Correo', route: 'mailto:info@carnetizacion.com', external: true },
        { label: 'Teléfono', route: 'tel:+573001234567', external: true },
        { label: 'Dirección', route: '/direccion' },
        { label: 'Formulario de Contacto', route: '/formulario-contacto' }
      ]
    }
  ];

  // Enlaces de redes sociales
  socialLinks: SocialLink[] = [
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/company/carnetizacion-digital',
      ariaLabel: 'Síguenos en LinkedIn'
    },
    {
      platform: 'facebook',
      url: 'https://facebook.com/carnetizaciondigital',
      ariaLabel: 'Síguenos en Facebook'
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com/carnetizaciondigital',
      ariaLabel: 'Síguenos en Instagram'
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/carnetizacion',
      ariaLabel: 'Síguenos en Twitter/X'
    }
  ];

  // Enlaces del footer inferior
  bottomLinks: FooterLink[] = [
    { label: 'Términos de Servicio', route: '/terminos-servicio' },
    { label: 'Política de Privacidad', route: '/politica-privacidad' },
    { label: 'Protección de Datos', route: '/proteccion-datos' },
    { label: 'Accesibilidad', route: '/accesibilidad' }
  ];

  // Información de la empresa
  companyInfo = {
    name: 'Carnetización Digital',
    description: 'Plataforma integral para la emisión, gestión y validación de carnets digitales con tecnología blockchain.',
    email: 'info@carnetizacion.com',
    phone: '+57 300 123 4567',
    address: 'Bogotá, Colombia'
  };

  constructor() {}

  /**
   * Maneja el clic en enlaces externos (mailto, tel, URLs externas)
   */
  handleExternalLink(url: string): void {
    if (url.startsWith('mailto:') || url.startsWith('tel:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Maneja la navegación interna
   */
  handleInternalLink(route: string): void {
    // La navegación se maneja automáticamente con RouterModule
    // Aquí puedes agregar lógica adicional si es necesario
    console.log(`Navegando a: ${route}`);
  }

  /**
   * Determina si un enlace es externo
   */
  isExternalLink(link: FooterLink): boolean {
    return link.external === true || 
           link.route.startsWith('http') || 
           link.route.startsWith('mailto:') || 
           link.route.startsWith('tel:');
  }

  /**
   * Scroll to top functionality
   */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Maneja errores de carga de imágenes
   */
  onImageError(event: any): void {
    console.warn('Error cargando imagen del logo', event);
    // Puedes agregar una imagen de fallback aquí
  }

  /**
   * Abre el enlace de red social
   */
  openSocialLink(socialLink: SocialLink): void {
    this.handleExternalLink(socialLink.url);
  }

  /**
   * Obtiene el año actual para el copyright
   */
  getCurrentYear(): number {
    return this.currentYear;
  }

  /**
   * Maneja el click en enlaces del footer
   */
  onFooterLinkClick(link: FooterLink, event?: Event): void {
    if (this.isExternalLink(link)) {
      if (event) {
        event.preventDefault();
      }
      this.handleExternalLink(link.route);
    } else {
      // Para enlaces internos, RouterModule maneja la navegación automáticamente
      this.handleInternalLink(link.route);
    }
  }

  /**
   * Obtiene el icono para cada plataforma social
   */
  getSocialIcon(platform: string): string {
    const icons: { [key: string]: string } = {
      linkedin: 'linkedin-icon',
      facebook: 'facebook-icon',
      instagram: 'instagram-icon',
      twitter: 'twitter-icon'
    };
    return icons[platform] || 'social-icon';
  }
}