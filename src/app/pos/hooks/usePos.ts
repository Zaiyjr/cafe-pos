"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

// 🚀 ປັບປຸງ Type ຂອງສິນຄ້າໃຫ້ຮອງຮັບ ຮູບພາບ ແລະ ປະເພດ
interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  } | null;
}

// 🚀 ເພີ່ມ Type ຂອງປະເພດສິນຄ້າ (Category)
interface Category {
  id: string;
  name: string;
}

export function usePos() {
  const [products, setProducts] = useState<Product[]>([]);
  // 🚀 ເພີ່ມ State ສຳລັບເກັບຂໍ້ມູນ ປະເພດສິນຄ້າ
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 🚀 ເພີ່ມ States ສຳລັບຄວບຄຸມ Modal ການຊຳລະເງິນ
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] =
    useState<boolean>(false);
  const [checkoutStatus, setCheckoutStatus] = useState<
    "idle" | "scanning" | "success" | "error"
  >("idle");
  // ດຶງ Functions ມາຈາກ Zustand Store ທີ່ເຮົາສ້າງໄວ້
  const { cart, addToCart, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();

  // 1. Logic ໃນການດຶງຂໍ້ມູນເມນູ ແລະ ປະເພດສິນຄ້າມາຈາກ API
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // 🚀 Fetch ພ້ອມກັນທັງ Products ແລະ Categories ເພື່ອຄວາມໄວ
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
      } catch (error) {
        console.error("Failed to fetch POS data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // 🚀 1. ຟັງຊັນຕອນກົດ Checkout ຢູ່ໜ້າຕະກ້າ: ໃຫ້ເປີດໜ້າຕ່າງ QR Code ຂຶ້ນມາກ່ອນ
  const openCheckoutModal = () => {
    if (cart.length === 0) return;
    setCheckoutStatus("scanning");
    setIsCheckoutModalOpen(true);
  };

  // 🚀 2. ຟັງຊັນຢືນຢັນການຈ່າຍເງິນ (ຕອນພະນັກງານກົດ "ຢືນຢັນການຮັບເງິນ/ສະແກນສຳເລັດ")
  const confirmPayment = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
      
          })),
          totalAmount: getTotalPrice(),
        }),
      });

      if (response.ok) {
        setCheckoutStatus("success");
        clearCart(); // ລ້າງຕະກ້າ
      } else {
        setCheckoutStatus("error");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutStatus("error");
    }
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    setCheckoutStatus("idle");
  };

  // 2. Logic ຕອນກົດຊຳລະເງິນ (Checkout)
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: getTotalPrice(),
        }),
      });

      if (response.ok) {
        alert("🎉 ບັນທຶກອໍເດີ້ ແລະ ອອກໃບບິນສຳເລັດ!");
        clearCart(); // ລ້າງຕະກ້າເມື່ອຈ່າຍເງິນແລ້ວ
      } else {
        alert("❌ ມີຂໍ້ຜິດພາດໃນການຊຳລະເງິນ");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  // 🚀 Return logic ທັງໝົດ ແລະ categories ອອກໄປໃຫ້ UI ໃຊ້
  return {
    products,
    categories, // 👈 ເພີ່ມໂຕນີ້ອອກໄປໃຫ້ໜ້າ page.tsx ຂອງ POS ເອົາໄປເຮັດແທັບເລືອກ
    isLoading,
    cart,
    isCheckoutModalOpen,
    checkoutStatus,
    addToCart,
    updateQuantity,
    getTotalPrice,
    handleCheckout,

    openCheckoutModal,
    confirmPayment,
    closeCheckoutModal,
  };
}
