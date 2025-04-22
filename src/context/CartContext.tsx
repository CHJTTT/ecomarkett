// src/context/CartContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect
} from 'react';

// --- 1. Cambiar price a number ---
interface CartItem {
  id: number;
  name: string;
  price: number; // <-- CAMBIO: de string a number
  imageUrl: string | null;
  quantity: number;
}

// --- 2. Añadir getTotal a CartContextType ---
interface CartContextType {
  cartItems: CartItem[];
  // Modificamos la entrada de addToCart para que acepte price como number
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number; // <-- AÑADIR getTotal
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // useEffect para cargar desde localStorage
  useEffect(() => {
    console.log("Intentando cargar carrito desde localStorage...");
    try {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as CartItem[]; // Tipar al parsear
        // --- Validación adicional ---
        if (Array.isArray(parsedCart) && parsedCart.every(item => typeof item.price === 'number')) {
           setCartItems(parsedCart);
           console.log("Carrito cargado desde localStorage:", parsedCart);
        } else {
            console.warn("El contenido de localStorage 'cartItems' es inválido o tiene precios incorrectos. Limpiando.");
            localStorage.removeItem('cartItems');
            setCartItems([]); // Asegura que el estado quede limpio
        }
      } else {
           console.log("No se encontró carrito en localStorage.");
      }
    } catch (error) {
      console.error("Error al parsear carrito desde localStorage:", error);
      localStorage.removeItem('cartItems');
      setCartItems([]); // Asegura que el estado quede limpio
    } finally {
        setIsInitialLoadComplete(true);
    }
  }, []);

  // useEffect para guardar en localStorage
  useEffect(() => {
     if (isInitialLoadComplete) {
      console.log("Guardando carrito en localStorage:", cartItems);
      try {
        // Asegurarse que sólo se guardan precios numéricos
        const validCartItems = cartItems.filter(item => typeof item.price === 'number');
        if(validCartItems.length !== cartItems.length) {
            console.warn("Se detectaron items con precios no numéricos antes de guardar. Se omitirán.");
        }
        localStorage.setItem('cartItems', JSON.stringify(validCartItems));
      } catch (error) {
        console.error("Error al guardar carrito en localStorage:", error);
      }
    }
  }, [cartItems, isInitialLoadComplete]);


  // --- 3. Asegurar que addToCart guarda price como number ---
  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>, quantityToAdd: number = 1) => {
      // --- Validación/Conversión del precio entrante ---
      // Idealmente, el componente que llama a addToCart ya debería pasar price como number.
      // Añadimos una salvaguarda por si acaso.
      const numericPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

      if (isNaN(numericPrice)) {
          console.error("Precio inválido recibido en addToCart:", product.price);
          return; // No añadir el item si el precio no es válido
      }
      // --- Fin Validación ---

      setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id);
          if (existingItem) {
              return prevItems.map(item =>
                  item.id === product.id
                  ? { ...item, quantity: item.quantity + quantityToAdd }
                  : item
              );
          } else {
              // Guardar el item con el precio numérico validado
              return [...prevItems, { ...product, price: numericPrice, quantity: quantityToAdd }];
          }
      });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems(prevItems => {
      return prevItems.filter(item => item.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    console.log("Carrito vaciado.");
  }, []);


  const getItemCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // --- 4. Implementar getTotal ---
  const getTotal = useCallback(() => {
    // Ahora item.price es number, la multiplicación es válida
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);


  // --- 5. Añadir getTotal al value ---
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotal, // <-- AÑADIR getTotal al objeto value
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook useCart (sin cambios)
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};