'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
}

export function useCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 ເພີ່ມ State ສຳລັບ Custom Toast Alert
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ດຶງຂໍ້ມູນ Category
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ສ້າງ Category ໃໝ່
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const data = await res.json(); // 🚀 ອ່ານຂໍ້ມູນ JSON ທີ່ Server ສົ່ງກັບມາ

      if (res.ok) {
        showToast('ເພີ່ມປະເພດສິນຄ້າສຳເລັດ!', 'success');
        setNewCategoryName('');
        fetchCategories(); // ໂຫຼດຂໍ້ມູນໃໝ່
      } else {
        // 🚀 ແນບ Error ແທ້ຈິງທີ່ສົ່ງມາຈາກ Backend ເຂົ້າໄປໃນ Toast
        showToast(`ບໍ່ສາມາດເພີ່ມໄດ້: ${data.error || 'ຂໍ້ມູນອາດຈະຊ້ຳກັນ'}`, 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ກັບ Server', 'error');
    }
  };

  return {
    categories,
    newCategoryName,
    setNewCategoryName,
    isLoading,
    toast, // 🚀 ສົ່ງ Toast ອອກໄປໃຫ້ໜ້າ UI render
    handleCreateCategory,
    fetchCategories
  };
}