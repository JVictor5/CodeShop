export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  capaUrl: {
    lg: string;
    sm: string;
  };
  description: string[];
  maximumQuantity: number;
  type: string;
}
