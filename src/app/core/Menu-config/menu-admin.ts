import { MenuItem } from "../Models/MenuItemModel";

export const menuAdmin: MenuItem[] = [
  {
    "id": "menu-principal",
    "title": "Menú Principal",
    "type": "group",
    "children": [
      { "id": "inicio", "title": "Inicio", "type": "item", "classes": "nav-item", "url": "/dashboard", "icon": "home" },
      { "id": "ayuda", "title": "Ayuda", "type": "item", "classes": "nav-item", "url": "/dashboard/ayuda", "icon": "help" },
      { "id": "cerrar-sesion", "title": "Cerrar Sesión", "type": "item", "classes": "nav-item", "url": "/auth/logout", "icon": "logout" }
    ]
  },

  {
    "id": "organizacional",
    "title": "Organizacional",
    "type": "group",
    "children": [
      {
        "id": "estructura-organizativa",
        "title": "Estructura Organizativa",
        "type": "collapse",
        "icon": "account_tree",
        "children": [
          { "id": "estructura-resumen", "title": "Resumen", "type": "item", "classes": "nav-item", "url": "/dashboard/organizational/structure", "icon": "dashboard_customize" },
          { "id": "sucursales", "title": "Sucursales", "type": "item", "classes": "nav-item", "url": "/dashboard/organizational/structure/branch", "icon": "store" },
          { "id": "unidades-organizativas", "title": "Unidades Organizativas", "type": "item", "classes": "nav-item", "url": "/dashboard/organizational/structure/unit", "icon": "schema" },
          { "id": "divisiones-internas", "title": "Divisiones Internas", "type": "item", "classes": "nav-item", "url": "/dashboard/organizational/structure/internal-division", "icon": "account_tree" },
          { "id": "perfiles", "title": "Perfiles", "type": "item", "classes": "nav-item", "url": "/dashboard/organizational/structure/profile", "icon": "badge" },
          { "id": "jornadas", "title": "Jornadas", "type": "item", "classes": "nav-item", "url": "/dashboard/organizational/structure/schedule", "icon": "schedule" }
        ]
      },
      {
        "id": "personas-carnets",
        "title": "Personas y Carnets",
        "type": "item",
        "classes": "nav-item",
        "url": "/dashboard/personas-carnets",
        "icon": "badge"
      },
      {
        "id": "solicitudes-modificacion",
        "title": "Solicitudes de Modificación",
        "type": "item",
        "classes": "nav-item",
        "url": "/dashboard/solicitudes-modificacion",
        "icon": "mail_outline"
      }
    ]
  },

  {
    "id": "operacional",
    "title": "Operacional",
    "type": "group",
    "children": [
      {
        "id": "eventos-control-acceso",
        "title": "Eventos y Control de Acceso",
        "type": "collapse",
        "icon": "event_available",
        "children": [
          { "id": "eventos", "title": "Eventos", "type": "item", "classes": "nav-item", "url": "/dashboard/operational/events", "icon": "event" },
          { "id": "tipos-evento", "title": "Tipos de Evento", "type": "item", "classes": "nav-item", "url": "/dashboard/operational/event-types", "icon": "category" },
          { "id": "audiencias-objetivo", "title": "Audiencias Objetivo", "type": "item", "classes": "nav-item", "url": "/dashboard/operational/event-target-audience", "icon": "group" },
          { "id": "puntos-acceso", "title": "Puntos de Acceso", "type": "item", "classes": "nav-item", "url": "/dashboard/operational/access-points", "icon": "sensor_door" },
          { "id": "asistencias", "title": "Asistencias", "type": "item", "classes": "nav-item", "url": "/dashboard/operational/attendance", "icon": "how_to_reg" }
        ]
      }
    ]
  },

  {
    "id": "parametros",
    "title": "Parámetros",
    "type": "group",
    "children": [
      {
        "id": "configuracion-general",
        "title": "Configuración General",
        "type": "collapse",
        "icon": "settings_applications",
        "children": [
          { "id": "estados", "title": "Estados", "type": "item", "classes": "nav-item", "url": "/dashboard/parametros/status", "icon": "check_circle_unread" },
          { "id": "tipos-categorias", "title": "Tipos y Categorías", "type": "item", "classes": "nav-item", "url": "/dashboard/parametros/types-category", "icon": "category" },
          { "id": "tipos-personalizados", "title": "Tipos Personalizados", "type": "item", "classes": "nav-item", "url": "/dashboard/parametros/custom-types", "icon": "tune" }
        ]
      },
      {
        "id": "ubicacion",
        "title": "Ubicación",
        "type": "collapse",
        "icon": "location_on",
        "children": [
          { "id": "departamentos", "title": "Departamentos", "type": "item", "classes": "nav-item", "url": "/dashboard/organizational/location/department", "icon": "flag" },
          { "id": "municipios", "title": "Municipios", "type": "item", "classes": "nav-item", "url": "/dashboard/organizational/location/municipality", "icon": "place" }
        ]
      }
    ]
  },

  {
    "id": "seguridad",
    "title": "Seguridad",
    "type": "group",
    "children": [
      {
        "id": "seguridad-collapse",
        "title": "Seguridad",
        "type": "collapse",
        "icon": "admin_panel_settings",
        "children": [
          { "id": "personas", "title": "Personas", "type": "item", "classes": "nav-item", "url": "/dashboard/seguridad/people", "icon": "person_pin_circle" },
          { "id": "usuarios", "title": "Usuarios", "type": "item", "classes": "nav-item", "url": "/dashboard/seguridad/users", "icon": "groups_2" },
          { "id": "roles", "title": "Roles", "type": "item", "classes": "nav-item", "url": "/dashboard/seguridad/roles", "icon": "add_moderator" },
          { "id": "gestion-permisos", "title": "Gestión de Permisos", "type": "item", "classes": "nav-item", "url": "/dashboard/seguridad/permission-forms", "icon": "folder_managed" },
          { "id": "permisos", "title": "Permisos", "type": "item", "classes": "nav-item", "url": "/dashboard/seguridad/permissions", "icon": "lock_open_circle" },
          { "id": "formularios", "title": "Formularios", "type": "item", "classes": "nav-item", "url": "/dashboard/seguridad/forms", "icon": "lists" },
          { "id": "modulos", "title": "Módulos", "type": "item", "classes": "nav-item", "url": "/dashboard/seguridad/modules", "icon": "dashboard_2" }
        ]
      }
    ]
  }


];
