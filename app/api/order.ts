import { apiDelete, apiGet, apiPost } from ".";
import { IProduct } from "./products";


export interface IOrders {
    _id: string;
    customer_id: string;
    product: IProduct;
    quantity: number;
    is_deleted: boolean;
    sum: number;
    created_at: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
}


export async function addItem() {
    const res = await apiPost<
        {},
        any
    >("/orders", {}, {
        operation: "Order placing"
    });
    return res;
}

export async function deleteItem(orderId: string) {
    const res = await apiDelete<
        { id: string }
    >(`orders/${orderId}`, {
        operation: "Order delete",
    });
    return res;
}
export async function getItems() {
    const res = await apiGet<
        IOrders[]
    >(`orders`, {
        operation: "Order fetching",
    });
    return res;
}
