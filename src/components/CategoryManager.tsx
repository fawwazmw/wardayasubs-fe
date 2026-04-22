import { useState, useEffect } from 'react';
import { categoryService } from '../services/categories';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  color?: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        toast.success('Category updated');
      } else {
        await categoryService.create(formData);
        toast.success('Category created');
      }
      setFormData({ name: '', color: '#3B82F6' });
      setShowForm(false);
      setEditingCategory(null);
      loadCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, color: category.color || '#3B82F6' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Subscriptions will not be deleted.')) return;
    try {
      await categoryService.delete(id);
      toast.success('Category deleted');
      loadCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete category');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', color: '#3B82F6' });
  };

  const predefinedColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Categories</h3>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm border border-purple-500/30"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="Entertainment, Productivity, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color ? 'border-white scale-110' : 'border-slate-600 hover:border-slate-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-10 h-10 rounded-lg border-2 border-slate-600 cursor-pointer bg-slate-800"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all text-sm font-medium"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium border border-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-8">
          <Tag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No categories yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 bg-slate-900/30 border border-slate-700/50 rounded-lg hover:border-slate-600 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-lg shadow-lg"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium text-white">{category.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-purple-300 hover:bg-purple-500/20 rounded-lg transition-colors border border-transparent hover:border-purple-500/30"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/20 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
