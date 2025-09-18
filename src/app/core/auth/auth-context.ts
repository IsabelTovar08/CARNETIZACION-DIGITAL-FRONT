import { HttpContextToken } from '@angular/common/http';

// Por defecto todo request requiere autenticación
export const CHECK_AUTH = new HttpContextToken<boolean>(() => true);
