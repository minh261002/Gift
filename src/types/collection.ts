export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
  status: "ACTIVE" | "INACTIVE";
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CollectionsResponse {
  collections: Collection[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCollectionRequest {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured?: boolean;
  status?: "ACTIVE" | "INACTIVE";
  categoryId?: string;
}

export interface UpdateCollectionRequest {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  featured?: boolean;
  status?: "ACTIVE" | "INACTIVE";
  categoryId?: string;
}
