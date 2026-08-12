export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  imagen?: string;
  disponible?: boolean;
  activo?: boolean;
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
  imagen?: string;
  disponible: boolean;
  material?: string;
  medidas?: string;
  created_at?: string;
  categoria?: Categoria;
  atributos?: any[];
}

// Exportamos también Producto para componer componentes antiguos
export type Producto = ProductoConCategoria;