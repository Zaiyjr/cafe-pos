import { create } from 'zustand';

// ນິຍາມປະເພດຂໍ້ມູນຂອງສິນຄ້າໃນຕະກ້າ
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: { id: string; name: string; price: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  // ເພີ່ມສິນຄ້າເຂົ້າຕະກ້າ (ຖ້າມີແລ້ວໃຫ້ບວກຈຳນວນເພີ່ມ)
  addToCart: (product) => {
    const currentCart = get().cart;
    const existingItem = currentCart.find((item) => item.id === product.id);

    if (existingItem) {
      set({
        cart: currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      });
    } else {
      set({ cart: [...currentCart, { ...product, quantity: 1 }] });
    }
  },

  // ລົບສິນຄ້າອອກຈາກຕະກ້າ
  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.id !== productId) });
  },

  // ອັບເດດຈຳນວນສິນຄ້າ (ກໍລະນີກົດບວກ/ລົບ ຫຼື ປ້ອນຕົວເລກຢູ່ໜ້າ POS)
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      cart: get().cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    });
  },

  // ລ້າງຕະກ້າ (ໃຊ້ຫຼັງຈາກ Checkout ຫຼື ກົດຍົກເລີກອໍເດີ້)
  clearCart: () => set({ cart: [] }),

  // ຄິດໄລ່ລາຄາລວມທັງໝົດໃນຕະກ້າ
  getTotalPrice: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));