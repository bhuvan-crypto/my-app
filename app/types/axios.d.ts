import "axios";

export type IOpTypes =  ICart | IUser | IProducts;
export type ICart = "Ecommerce API" | "Cart Item add" | "Cart Item delete" | "Cart Item fetch";
export type IUser = "Login"
export type IProducts = "getProducts"



declare module "axios" {
  export interface AxiosRequestConfig {
    operation: IOpTypes;
    errCallback?: any;
  }
}
