'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Plus, Trash2, Edit2, Package, X, Save, Upload, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  category?: Category;
}

type FormMode = 'list' | 'create' | 'edit';

export default function AdminPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mode, setMode] = useState<FormMode>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      const adminUser = (session.user as any).isAdmin;
      setIsAdmin(adminUser);
      if (!adminUser) router.push('/');
    }
  }, [session, router]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchCategories();
    }
  }, [isAdmin, fetchProducts, fetchCategories]);

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormStock('');
    setFormCategoryId('');
    setFormImageUrl('');
    setEditingProduct(null);
  };

  const openCreate = () => {
    resetForm();
    if (categories.length > 0) setFormCategoryId(categories[0].id);
    setMode('create');
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormPrice(product.price.toString());
    setFormStock(product.stock.toString());
    setFormCategoryId(product.categoryId);
    setFormImageUrl(product.imageUrl);
    setMode('edit');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const presignRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type })
      });

      if (!presignRes.ok) throw new Error('Error al obtener URL de subida');
      const { uploadUrl, cloud_storage_path } = await presignRes.json();

      const urlObj = new URL(uploadUrl);
      const signedHeaders = urlObj.searchParams.get('X-Amz-SignedHeaders') || '';
      const headers: Record<string, string> = { 'Content-Type': file.type };
      if (signedHeaders.includes('content-disposition')) {
        headers['Content-Disposition'] = 'attachment';
      }

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers,
        body: file
      });

      if (!uploadRes.ok) throw new Error('Error al subir imagen');

      const bucketHost = urlObj.hostname;
      const publicUrl = `https://${bucketHost}/${cloud_storage_path}`;
      setFormImageUrl(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formName || !formDescription || !formPrice || !formCategoryId) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setSaving(true);
    try {
      const body = {
        name: formName,
        description: formDescription,
        price: formPrice,
        stock: formStock || '0',
        imageUrl: formImageUrl,
        categoryId: formCategoryId
      };

      let res;
      if (mode === 'create') {
        res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } else {
        res = await fetch(`/api/admin/products/${editingProduct!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      }

      if (!res.ok) throw new Error('Error al guardar');

      await fetchProducts();
      setMode('list');
      resetForm();
    } catch (error) {
      console.error('Save error:', error);
      alert('Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      await fetchProducts();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error al eliminar el producto');
    } finally {
      setDeleting(null);
    }
  };

  if (status === 'loading' || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-blue-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Panel Admin</h1>
              <p className="text-gray-500 text-sm">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <p className="text-sm text-gray-500">Total Productos</p>
            <p className="text-2xl font-bold text-blue-600">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <p className="text-sm text-gray-500">Stock Total</p>
            <p className="text-2xl font-bold text-amber-500">{products.reduce((s, p) => s + p.stock, 0)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {mode === 'list' ? (
            <>
              <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Productos</h2>
                </div>
                <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Producto
                </Button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-500">Cargando...</div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No hay productos. ¡Agrega el primero!</div>
              ) : (
                <div className="divide-y">
                  {products.map((product) => (
                    <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-blue-600 font-bold text-sm">${product.price.toLocaleString()} COP</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            Stock: {product.stock}
                          </span>
                          <span className="text-xs text-gray-400 hidden sm:inline">{product.category?.name}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {mode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
                </h2>
                <button
                  onClick={() => { setMode('list'); resetForm(); }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
                  <div className="flex items-start gap-4">
                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex-shrink-0">
                      {formImageUrl ? (
                        <Image src={formImageUrl} alt="Preview" fill className="object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                          <span className="text-xs mt-1">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition text-sm">
                        <Upload className="w-4 h-4" />
                        {uploadingImage ? 'Subiendo...' : 'Subir Imagen'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500">O pega una URL directamente:</p>
                      <Input
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://... o /uploads/imagen.jpg"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nombre del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Descripción del producto"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio (COP) *</label>
                    <Input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="195000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <Input
                      type="number"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Guardando...' : (mode === 'create' ? 'Crear Producto' : 'Guardar Cambios')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setMode('list'); resetForm(); }}
                    className="flex-1 sm:flex-none"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
