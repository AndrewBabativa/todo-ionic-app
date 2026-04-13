import { Injectable, signal, computed } from '@angular/core';
import { Category, DEFAULT_CATEGORIES } from '../models/category.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'app_categories';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categoriesSignal = signal<Category[]>([]);
  categories = computed(() => this.categoriesSignal());
  totalCategories = computed(() => this.categoriesSignal().length);

  constructor(private storage: StorageService) {
    this.loadFromStorage();
  }

  private async loadFromStorage(): Promise<void> {
    const saved = await this.storage.get<Category[]>(STORAGE_KEY);
    this.categoriesSignal.set(saved ?? DEFAULT_CATEGORIES);
    if (!saved) await this.saveToStorage();
  }

  private async saveToStorage(): Promise<void> {
    await this.storage.set(STORAGE_KEY, this.categoriesSignal());
  }

  async addCategory(name: string, color: string, icon: string): Promise<Category> {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      icon,
      createdAt: new Date()
    };
    this.categoriesSignal.update(cats => [...cats, newCategory]);
    await this.saveToStorage();
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    this.categoriesSignal.update(cats =>
      cats.map(c => c.id === id ? { ...c, ...updates } : c)
    );
    await this.saveToStorage();
  }

  async deleteCategory(id: string): Promise<void> {
    this.categoriesSignal.update(cats => cats.filter(c => c.id !== id));
    await this.saveToStorage();
  }

  getCategoryById(id: string): Category | undefined {
    return this.categoriesSignal().find(c => c.id === id);
  }
}