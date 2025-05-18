import { useState } from "react";
import { CartItem } from "../types";

export default function CartPage(){
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    
}