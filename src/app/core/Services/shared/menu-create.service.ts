import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from '../../Models/MenuItemModel';
import { MenuService } from '../api/menu/menu.service';

@Injectable({
  providedIn: 'root'
})
export class MenuCreateService {

  private menu$ = new BehaviorSubject<MenuItem[] | null>(null);
  private loaded = false;

  constructor(private http: HttpClient, private menuService: MenuService) {}

  // Llamada que carga una sola vez
  getMenu(): Observable<MenuItem[] | null> {
    if (!this.loaded) {
      this.menuService.GetMenuByUser().subscribe(items => {
        this.menu$.next(items);
        this.loaded = true;
      });
    }
    return this.menu$.asObservable();
  }

  // Forzar recarga (tras login)
  reload(): void {
    this.loaded = false;
    this.getMenu().subscribe();
  }

  clear(): void {
    this.loaded = false;
    this.menu$.next(null);
  }
}
