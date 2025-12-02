import { apiDelete, apiGet, apiPatch, apiPost } from ".";
export interface PaginationResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface IProduct {
    _id: string;
    name: string;
    description?: string;
    price: number;
    stock_quantity: number;
    category_id?: string;
    created_by?: string;
    updated_by?: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface ICreateProduct {
  "name": string,
  "description"?: string,
  "price":number,
  "stock_quantity": number,
  "category_id": string
}

const base  = "products";


export async function getProducts() {
    const res = await apiGet<
        PaginationResult<IProduct>
    >(`/${base}`, {
        operation: "getProducts",
    });
    return res;
}

export async function addProduct(payload:ICreateProduct) {
    const res = await apiPost<
        {},
        ICreateProduct
    >(`/${base}`,payload , {
        operation: "Product add"
    });
    return res;
}
export async function updateProduct(id:string,payload:Partial<ICreateProduct>,errCallback?: any) {
    const res = await apiPatch<
        {},
        Partial<ICreateProduct>
    >(`/${base}/${id}`,payload , {
        operation: "Product update",
        errCallback
    });
    return res;
}

export async function deleteProduct(productId: string) {
    const res = await apiDelete<
        { id: string }
    >(`${base}/${productId}`, {
        operation: "Product delete",
    });
    return res;
}

