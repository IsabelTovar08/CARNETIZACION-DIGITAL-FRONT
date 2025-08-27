import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core'; 
import { CommonModule } from '@angular/common';  

export type CardSize = 'small' | 'medium' | 'large'; 
export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled' | 'organizational';

@Component({   
  selector: 'app-generic-cards',   
  imports: [CommonModule ],   
  templateUrl: './generic-cards.component.html',   
  styleUrl: './generic-cards.component.css' 
}) 
export class GenericCardsComponent {   
  @Input() title?: string;   
  @Input() subtitle?: string;   
  @Input() content?: string;   
  @Input() imageUrl?: string;   
  @Input() imageAlt?: string;   
  @Input() size: CardSize = 'medium';   
  @Input() variant: CardVariant = 'default';   
  @Input() width?: string;   
  @Input() height?: string;   
  @Input() clickable = false;   
  @Input() showHeader = true;   
  @Input() showContent = true;   
  @Input() showActions = true;    

  @Output() cardClick = new EventEmitter<void>();    

  @ContentChild('header') headerTemplate?: TemplateRef<any>;   
  @ContentChild('actions') actionsTemplate?: TemplateRef<any>;    

  get cardClasses(): string {     
    const classes = [       
      'card',       
      `card--${this.variant}`,       
      `card--${this.size}`     
    ];          
    
    if (this.clickable) {       
      classes.push('card--clickable');     
    }          
    
    return classes.join(' ');   
  }    

  get hasHeaderContent(): boolean {     
    return !!this.headerTemplate;   
  }    

  get hasContent(): boolean {     
    return !!this.headerTemplate;   
  }    

  onCardClick(): void {     
    if (this.clickable) {       
      this.cardClick.emit();     
    }   
  } 
}