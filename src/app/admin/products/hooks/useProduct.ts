'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  categoryId: string;
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export function useProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // States ຟອມ
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  
  // States ຮູບພາບ (ລວມກັນເປັນ object ຈະຈັດການງ່າຍກວ່າ)
  const [imageType, setImageType] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [imageBase64, setImageBase64] = useState('');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([fetch('/api/products'), fetch('/api/categories')]);
      setProducts(await pRes.json());
      setCategories(await cRes.json());
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const resetImages = () => {
    setImageUrl('');
    setImageBase64('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showToast('ຮູບພາບໃຫຍ່ເກີນ 2MB!', 'error');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      resetImages();
      setImageBase64(reader.result as string);
      setImageType('file');
    };
    reader.readAsDataURL(file);
  };

  const clearForm = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setCategoryId('');
    setDescription('');
    setImageType('file');
    resetImages();
  };

  const setEditForm = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setCategoryId(product.categoryId);
    setDescription(product.description || '');
    
    resetImages();
    if (product.image?.startsWith('data:image')) {
      setImageType('file');
      setImageBase64(product.image);
    } else {
      setImageType('url');
      setImageUrl(product.image || '');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) return showToast('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ', 'error');

    const finalImage = (imageType === 'file' ? imageBase64 : imageUrl) || null;
    const isEditing = !!editingId;

    try {
      const res = await fetch(isEditing ? `/api/products/${editingId}` : '/api/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price), categoryId, description, image: finalImage }),
      });

      if (res.ok) {
        showToast(isEditing ? 'ແກ້ໄຂສຳເລັດ!' : 'ບັນທຶກສຳເລັດ!', 'success');
        clearForm();
        fetchData();
      } else {
        throw new Error();
      }
    } catch { showToast('ເກີດຂໍ້ຜິດພາດ', 'error'); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('ຢືນຢັນການລົບ?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('ລົບສຳເລັດ!', 'success');
      fetchData();
    }
  };

  const handleCreateCategoryQuick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('ເພີ່ມປະເພດສຳເລັດ!', 'success');
        setNewCategoryName('');
        setIsCategoryModalOpen(false);
        fetchData();
        setCategoryId(data.id); 
      } else {
        showToast(`ບໍ່ສາມາດເພີ່ມໄດ້: ${data.error || 'ຂໍ້ມູນຊ້ຳ'}`, 'error');
      }
    } catch (error) { showToast('ຂໍ້ຜິດພາດ Server', 'error'); }
  };

  return {
    products, categories, isLoading, toast, editingId,
    form: { 
      name, setName, price, setPrice, categoryId, setCategoryId, description, setDescription,
      imageType, setImageType, imageUrl, setImageUrl, imageBase64, setImageBase64, 
      handleFileChange, clearForm 
    },
    categoryModal: { 
      isOpen: isCategoryModalOpen, setIsOpen: setIsCategoryModalOpen, 
      name: newCategoryName, setName: setNewCategoryName, handleCreate: handleCreateCategoryQuick
    },
    handleSaveProduct, setEditForm, handleDeleteProduct,
  };
}