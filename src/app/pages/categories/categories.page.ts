import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonFab, IonFabButton, IonModal, IonButtons,
  IonInput, IonSelect, IonSelectOption,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline,
         closeOutline, saveOutline } from 'ionicons/icons';
import { CategoryService } from '../../services/category.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { Category } from '../../models/category.model';

const COLORS = ['#6C63FF','#FF6584','#43C6AC','#F7971E','#4ECDC4','#FF6B6B','#45B7D1'];
const ICONS  = ['folder-outline','star-outline','heart-outline','home-outline',
                'briefcase-outline','cart-outline','fitness-outline','person-outline'];

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButtons,
    IonInput, IonSelect, IonSelectOption,
    EmptyStateComponent
  ],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss']
})
export class CategoriesPage {

  isModalOpen  = signal(false);
  isEditing    = signal(false);
  editingId    = signal<string | null>(null);

  catName  = '';
  catColor = COLORS[0];
  catIcon  = ICONS[0];

  colors = COLORS;
  icons  = ICONS;

  constructor(
    public categoryService: CategoryService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, createOutline, trashOutline, closeOutline, saveOutline });
  }

  openAddModal() {
    this.resetForm();
    this.isEditing.set(false);
    this.isModalOpen.set(true);
  }

  openEditModal(cat: Category) {
    this.catName  = cat.name;
    this.catColor = cat.color;
    this.catIcon  = cat.icon;
    this.isEditing.set(true);
    this.editingId.set(cat.id);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.resetForm();
  }

  private resetForm() {
    this.catName  = '';
    this.catColor = COLORS[0];
    this.catIcon  = ICONS[0];
    this.editingId.set(null);
  }

  async saveCategory() {
    if (!this.catName.trim()) {
      const toast = await this.toastCtrl.create({
        message: 'El nombre es obligatorio', duration: 2000, color: 'warning'
      });
      await toast.present();
      return;
    }

    if (this.isEditing() && this.editingId()) {
      await this.categoryService.updateCategory(this.editingId()!, {
        name: this.catName, color: this.catColor, icon: this.catIcon
      });
      await this.showToast('Categoría actualizada ✅', 'success');
    } else {
      await this.categoryService.addCategory(this.catName, this.catColor, this.catIcon);
      await this.showToast('Categoría creada ✅', 'success');
    }
    this.closeModal();
  }

  async deleteCategory(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar categoría',
      message: 'Las tareas de esta categoría quedarán sin categoría.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar', role: 'destructive',
          handler: async () => {
            await this.categoryService.deleteCategory(id);
            await this.showToast('Categoría eliminada', 'danger');
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    await toast.present();
  }
}