export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  imagen_url?: string;
  disponible?: boolean;
}

export interface ProductoConCategoria {
  id: number;
  slug: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  precio_base?: number;
  precio_oferta?: number | null;
  precio_final: number;
  stock: number;
  imagen_url?: string;
  disponible: boolean;
  material?: string;
  medidas?: string;
  created_at?: string;
  categoria?: Categoria;
  atributos?: any[];
}


export type Producto = ProductoConCategoria;