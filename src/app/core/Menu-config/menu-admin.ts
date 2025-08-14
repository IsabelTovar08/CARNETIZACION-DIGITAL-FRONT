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
        url: '/dashboard',
        icon: 'home',
        target: false,
        breadcrumbs: true
      },
      {
        id: 'estructura-organizativa',
        title: 'Estructura Organizativa',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/organizational/structure',
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
        id: 'configuracion-general',
        title: 'Configuración General',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/configuracion-general',
        icon: 'settings'
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
    id: 'param',
    title: 'Parámetros',
    type: 'group',
    children: [
      {
        id: 'menu-levels',
        title: 'Parámetros',
        type: 'collapse',
        icon: 'settings_applications',
        children: [
          {
            id: 'level-15-1',
            title: 'Ubicación',
            icon: 'location_on',
            type: 'collapse',
            children: [
              {
                id: '123',
                title: 'Departamentos',
                icon: 'person_pin_circle',
                type: 'item',
                url: '/dashboard/organizational/location/deparment'
              },
              {
                id: '456',
                title: 'Municipios',
                icon: 'person_pin_circle',
                type: 'item',
                url: '/dashboard/organizational/location/city'
              }
            ]
          },
          {
            id: 'level-1-162',
            title: 'Sistema',
            type: 'collapse',
            icon: 'apps_outage',
            children: [
              {
                id: '123',
                title: 'Estados',
                icon: 'check_circle_unread',
                type: 'item',
                url: '/dashboard/parametros/status'
              },
              {
                id: '456',
                title: 'Tipos y Categorías',
                icon: 'category',
                type: 'item',
                url: '/dashboard/parametros/types-category'
              }
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'modulos',
    title: 'Seguridad',
    type: 'group',
    children: [
      {
        id: 'menu-lev1els',
        title: 'Seguridad',
        type: 'collapse',
        icon: 'admin_panel_settings',
        children: [
          {
            id: 'level4-1-1',
            title: 'Personas',
            icon: 'person_pin_circle',
            type: 'item',
            url: '/dashboard/seguridad/people'
          },
          {
            id: 'level-15-2',
            title: 'Usuarios',
            type: 'item',
            icon: 'groups_2',
            url: '/dashboard/seguridad/users'
          },
          {
            id: 'level-1-tf2',
            title: 'Roles',
            type: 'item',
            icon: 'add_moderator',
            url: '/dashboard/seguridad/roles'
          },
          {
            id: 'level-1-f2',
            title: 'Gestión de Permisos',
            type: 'item',
            icon: 'folder_managed',
            url: '/dashboard/seguridad/permission-forms'
          },
          {
            id: 'level-1-2f',
            title: 'Permisos',
            type: 'item',
            icon: 'lock_open_circle',
            url: '/dashboard/seguridad/permissions'
          },
          {
            id: 'level-1-d2',
            title: 'Formularios',
            type: 'item',
            icon: 'lists',
            url: '/dashboard/seguridad/forms'
          },
          {
            id: 'level-1-d3',
            title: 'Módulos',
            type: 'item',
            icon: 'dashboard_2',
            url: '/dashboard/seguridad/modules'
          }
        ]
      },
    ]
  }
];
