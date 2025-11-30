import "axios";



declare module "axios" {
  export interface AxiosRequestConfig {
    operation?: string;
    errCallback?: any;
  }
}
