import "axios";

export type IOpTypes =  ICart | IUser | IProducts | IOrders;
export type ICart = "Ecommerce API" | "Cart Item add" | "Cart Item delete" | "Cart Item fetch";
export type IUser = "Login"
export type IProducts = "getProducts"
export type IOrders = "Order placing" | "Order delete" | "Order fetching"



declare module "axios" {
  export interface AxiosRequestConfig {
    operation: IOpTypes;
    errCallback?: any;
  }
}
