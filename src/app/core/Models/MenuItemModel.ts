export interface MenuItem {
  id: string;
  title: string;
  type: 'group' | 'item' | 'collapse';
  icon?: string;
  url?: string;
  classes?: string;
  children?: MenuItem[];
}

export interface MenuStructure {
  title?: string;
  icon?: string;
  url?: string;
  id: number;
  parentMenuId?: number | null;
  moduleId?: number | null;
  formId?: number | null;
  type: 'Module' | 'Group' | 'Item'; // ← ajusta a tus tipos reales
  orderIndex: number;
  children?: [];
}
