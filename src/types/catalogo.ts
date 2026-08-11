export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
}

export interface ValorAtributo {
  id: number;
  atributo_nombre: string;
  valor: string;
  precio_adicional: string;
}

export interface ProductoConCategoria {
  id: number;
  slug: string;
  nombre: string;
  descripcion?: string;
  precio: number;       
  precio_oferta?: number | null;
  precio_final: number;
  stock: number;
  imagen_url?: string;
  disponible: boolean;
  categoria?: {
    id: number;
    nombre: string;
    slug: string;
  };
  atributos?: any[];
}