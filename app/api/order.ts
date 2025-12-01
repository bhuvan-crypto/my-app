import { apiDelete, apiGet, apiPost } from ".";


export interface IOrders {
  _id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  is_deleted: boolean;
  sum: number;
  created_at: string;   // from DB
  __v: number;
  createdAt: string;    // mongoose timestamp
  updatedAt: string;    // mongoose timestamp
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
