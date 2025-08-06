import { MenuItem } from "../Models/MenuItemModel";

export const menuAdmin: MenuItem[] = [

     {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          classes: 'nav-item',
          url: '/dashboard',
          icon: 'dashboard',
          target: false,
          breadcrumbs: true
        }
      ]
    },
    {
      id: 'auths',
      title: 'Authentication',
      type: 'group',
      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          classes: 'nav-item',
          url: '/dashboard/login', // <-- Cambia esto
          icon: 'login',
          target: true,
          breadcrumbs: false
        },
        {
          id: 'forgotten-password',
          title: 'Olvido de contraseña',
          type: 'item',
          classes: 'nav-item',
          url: '/dashboard/forgotten-password', // <-- Cambia esto
          icon: 'login',
          target: true,
          breadcrumbs: false
        },
        {
          id: 'inicio',
          title: 'Inicio',
          type: 'item',
          classes: 'nav-item',
          url: '/dashboard/inicio',
          icon: 'person_add',
          target: true,
          breadcrumbs: false
        },
        {
          id: 'contact',
          title: 'Contacto',
          type: 'item',
          classes: 'nav-item',
          url: '/dashboard/contact',
          icon: 'person_add',
          target: true,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'ui-components',
      title: 'Organizaciones',
      type: 'group',
      children: [
        {
          id: 'typography',
          title: 'Eventos y Control de Acceso',
          type: 'item',
          classes: 'nav-item',
          url: '/dashboard/organizational/organization',
          icon: 'event_available',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'color',
          title: 'Color',
          type: 'item',
          classes: 'nav-item',
          url: '/ui/color',
          icon: 'palette',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'tables',
          title: 'Tables',
          type: 'item',
          classes: 'nav-item',
          url: '/ui/tables',
          icon: 'table_chart',
          target: false,
          breadcrumbs: true
        }
      ]
    },
    {
      id: 'Módulos',
      title: 'Seguridad',
      type: 'group',
      children: [
        {
          id: 'menu-levels',
          title: 'Security',
          type: 'collapse',
          icon: 'layers',
          children: [
            {
              id: 'level-1-1',
              title: 'Personas',
              icon: 'layers',
              type: 'item',
              url: '/dashboard/security/people'
            },
            {
              id: 'level-1-2',
              title: 'Usuarios',
              type: 'item',
              url: '/dashboard/security/users'
            },
            {
              id: 'level-1-f2',
              title: 'Roles',
              type: 'item',
              url: '/dashboard/security/roles'
            },
            {
              id: 'level-1-2f',
              title: 'Permisos',
              type: 'item',
              url: '/dashboard/security/permissions'
            },
            {
              id: 'level-1-d2',
              title: 'Formularios',
              type: 'item',
              url: '/dashboard/security/forms'
            },
            {
              id: 'level-1-d3',
              title: 'Módulos',
              type: 'item',
              url: '/dashboard/security/modules'
            }
          ]
        },
        {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          classes: 'nav-item',
          url: '/sample-page',
          icon: 'description',
          target: false,
          breadcrumbs: true
        }
      ]
    }
]
