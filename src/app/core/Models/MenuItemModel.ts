export interface MenuItem {
  id: string;
  title: string;
  type: 'group' | 'item' | 'collapse';
  icon?: string;
  url?: string;
  classes?: string;
  children?: MenuItem[];
}
