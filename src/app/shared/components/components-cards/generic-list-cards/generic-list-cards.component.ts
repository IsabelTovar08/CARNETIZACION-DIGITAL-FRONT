import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { GenericCardsComponent, CardVariant, CardSize } from '../generic-cards/generic-cards.component';
import { CommonModule } from '@angular/common';

// Interfaz actualizada con soporte para variant individual
export interface CardItem {
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  variant?: CardVariant; // Nueva propiedad para variant individual
}

@Component({
  selector: 'app-generic-list-cards',
  imports: [CommonModule, GenericCardsComponent],
  standalone: true,
  templateUrl: './generic-list-cards.component.html',
  styleUrl: './generic-list-cards.component.css'
})
export class GenericListCardsComponent {
  @Input() items: CardItem[] = [];
  @Input() pageSize = 6;
  @Input() loading = false;
  @Input() gridClass?: string;
  @Input() showSkeleton = true;
  @Input() showPagination = true;
  @Input() variant: CardVariant = 'default'; 
  @Input() size: CardSize = 'medium';
  @Input() clickable = false;

  @Output() cardClick = new EventEmitter<CardItem>();
  @ContentChild('cardContent', { static: false }) customCardTemplate?: TemplateRef<any>;

  currentPage = 1;
  pagedItems: CardItem[] = [];

  ngOnInit() {
    this.updatePagedItems();
  }

  updatePagedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.items.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedItems();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedItems();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.items.length / this.pageSize);
  }

  onCardClicked(item: CardItem) {
    this.cardClick.emit(item);
  }

  // Método para obtener la variant de cada tarjeta
  getCardVariant(item: CardItem): CardVariant {
    return item.variant || this.variant;
  }
}