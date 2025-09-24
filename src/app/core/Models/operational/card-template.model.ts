// models/template.model.ts

// Un elemento genérico que siempre tiene x e y
export interface ElementPosition {
  x: number;
  y: number;
}

// JSON del frente de la tarjeta
export interface FrontElements {
  qr: ElementPosition;
  underQrText: ElementPosition;
  companyName: ElementPosition;
  logo: ElementPosition;
  userPhoto: ElementPosition;
  name: ElementPosition;
  profile: ElementPosition;
  categoryArea: ElementPosition;
  phoneNumber: ElementPosition;
  bloodTypeValue: ElementPosition;
  email: ElementPosition;
  cardId: ElementPosition;

  [key: string]: ElementPosition;
}

// JSON del reverso de la tarjeta
export interface BackElements {
  title: ElementPosition;
  guides: ElementPosition;
  address: ElementPosition;
  phoneNumber: ElementPosition;
  email: ElementPosition;

  [key: string]: ElementPosition;
}

// Plantilla completa
export interface Template {
  id: number;
  frontBackgroundUrl: string;
  backBackgroundUrl: string;
  frontElementsJson: FrontElements;  // ya parseado
  backElementsJson: BackElements;    // ya parseado
  isDeleted: boolean;
  code: string | null;
}

// Respuesta del API
export interface TemplateResponse {
  success: boolean;
  message: string;
  data: Template[];
  totalRows: number | null;
  errors: any;
}
