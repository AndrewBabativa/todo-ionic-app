export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Personal',  color: '#6C63FF', icon: 'person-outline',   createdAt: new Date() },
  { id: '2', name: 'Trabajo',   color: '#FF6584', icon: 'briefcase-outline', createdAt: new Date() },
  { id: '3', name: 'Compras',   color: '#43C6AC', icon: 'cart-outline',      createdAt: new Date() },
  { id: '4', name: 'Salud',     color: '#F7971E', icon: 'fitness-outline',   createdAt: new Date() },
];