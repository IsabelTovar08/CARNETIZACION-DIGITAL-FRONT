import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { GenericCardsComponent, CardVariant, CardSize } from '../generic-cards/generic-cards.component';
import { CommonModule } from '@angular/common';

//Aqui exporta la interfaz CardItem que define la estructura de un elemento de carta

export interface CardItem {
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
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

  // nos ayuda a actualizar los elementos paginados

  updatePagedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.items.slice(start, end);
  }

  // sive para navegar a la pagina siguiente

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedItems();
    }
  }

  // esto hace que se pueda navegar a la pagina anterior

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedItems();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.items.length / this.pageSize);
  }

  // aqui se coloca el metodo para emitir el evento al hacer click en una carta

  onCardClicked(item: CardItem) {
    this.cardClick.emit(item);
  }
}
