import "axios";

export type IOpTypes =  ICart | IUser | IProducts | IOrders | IAnalytics;
export type ICart = "Ecommerce API" | "Cart Item add" | "Cart Item delete" | "Cart Item fetch";
export type IUser = "Login" | "Signup"
export type IProducts = "getProducts" | "Product add" | "Product update" | "Product delete"
export type IOrders = "Order placing" | "Order delete" | "Order fetching"
export type IAnalytics = "Analytics fetch";


declare module "axios" {
  export interface AxiosRequestConfig {
    operation: IOpTypes;
    errCallback?: any;
  }
}
