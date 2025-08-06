import { MenuItem } from "../Models/MenuItemModel";

export const menuAdmin: MenuItem[] = [
  {
    id: 'main',
    title: 'Menú Principal',
    type: 'group',
    children: [
      {
        id: 'inicio',
        title: 'Inicio',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/inicio',
        icon: 'home',
        target: false,
        breadcrumbs: true
      },
      {
        id: 'estructura-organizativa',
        title: 'Estructura Organizativa',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/estructura-organizativa',
        icon: 'account_tree',
        target: false,
        breadcrumbs: true
      },
      {
        id: 'personas-carnets',
        title: 'Personas y Carnets',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/personas-carnets',
        icon: 'badge',
        target: false,
        breadcrumbs: true
      },
      {
        id: 'solicitudes-modificacion',
        title: 'Solicitudes de Modificación',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/solicitudes-modificacion',
        icon: 'mail_outline',
        target: false,
        breadcrumbs: true
      },
      {
        id: 'eventos-control-acceso',
        title: 'Eventos y Control de Acceso',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/eventos-control-acceso',
        icon: 'vpn_key',
        target: false,
        breadcrumbs: true
      },
      {
        id: 'configuracion-general',
        title: 'Configuración General',
        type: 'collapse',
        classes: 'nav-item',
        url: '/dashboard/configuracion-general',
        icon: 'settings',
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
        ]
      },
      {
        id: 'ayuda',
        title: 'Ayuda',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/ayuda',
        icon: 'help',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'cerrar-sesion',
        title: 'Cerrar Sesión',
        type: 'item',
        classes: 'nav-item',
        url: '/auth/logout',
        icon: 'logout',
        target: false,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'modulos',
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
    ]
  }
];
