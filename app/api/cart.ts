import { apiDelete, apiGet, apiPost } from ".";

interface ICartItem {
    "customer_id": string,
    "product_id": string,
    "quantity": number
}

export interface CartAggregation {
    _id: {
        customer_id: string;
        product_id: string;
    };
    count: number;
    total_quantity: number;
    total_sum: number;
    product: {
        id: string;
        name: string;
        price: number;
    };
    cart_ids: string[];
    customer_id: string;
    product_id: string;
}


export async function addItem(cartItem: ICartItem, errCallback?: any) {
    const res = await apiPost<
        {
            "cartId": string,
            "productId": string,
            "quantity": number
        },
        any
    >("/cart", cartItem, {
        operation: "Cart Item add",
        errCallback
    });
    return res;
}

export async function deleteItem(itemId: string,productId:string) {
    const res = await apiDelete<
        { id: string }
    >(`cart/${itemId}?productId=${productId}`, {
        operation: "Cart Item delete",
    });
    return res;
}
export async function getCartItems(customerId: string) {
    const res = await apiGet<
        CartAggregation[]
    >(`cart/${customerId}`, {
        operation: "Cart Item fetch",
    });
    return res;
}
