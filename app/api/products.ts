import { apiGet } from ".";
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


export async function getProducts() {
    const res = await apiGet<
        PaginationResult<IProduct>
    >("/products", {
        operation: "getProducts",
    });
    return res;
}
