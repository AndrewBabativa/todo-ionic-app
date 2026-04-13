import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFab,
  IonFabButton, IonIcon, IonSearchbar, IonSegment,
  IonSegmentButton, IonLabel, IonModal, IonButton,
  IonInput, IonSelect, IonSelectOption, IonTextarea,
  IonButtons, IonItem, IonList, IonChip, AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, checkmarkDone, listOutline,
         closeOutline, saveOutline } from 'ionicons/icons';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { FeatureFlagService } from '../../services/feature-flag.service';
import { TaskCardComponent } from '../../shared/components/task-card/task-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { Task, TaskPriority } from '../../models/task.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonFab,
    IonFabButton, IonIcon, IonSearchbar, IonSegment,
    IonSegmentButton, IonLabel, IonModal, IonButton,
    IonInput, IonSelect, IonSelectOption, IonTextarea,
    IonButtons, IonItem, IonList, IonChip,
    TaskCardComponent, EmptyStateComponent
  ],
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss']
})
export class TasksPage implements OnInit {

  // Estado del modal
  isModalOpen = signal(false);
  isEditing   = signal(false);
  editingTask = signal<Task | null>(null);

  // Formulario
  taskTitle       = '';
  taskDescription = '';
  taskPriority: TaskPriority = 'medium';
  taskCategoryId  = '';
  searchText      = '';
  activeFilter    = 'all';
  selectedCategoryFilter = '';

  constructor(
    public taskService: TaskService,
    public categoryService: CategoryService,
    public flagService: FeatureFlagService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, checkmarkDone, listOutline, closeOutline, saveOutline });
  }

  ngOnInit() {
    // Cargar categoría por defecto
    const cats = this.categoryService.categories();
    if (cats.length > 0) this.taskCategoryId = cats[0].id;
  }

  // ── Filtros ──────────────────────────────────────────
  onSearch(event: any) {
    this.searchText = event.detail.value;
    this.taskService.updateFilter({ searchText: this.searchText });
  }

  onSegmentChange(event: any) {
    this.activeFilter = event.detail.value;
    if (this.activeFilter === 'all')       this.taskService.updateFilter({ completed: undefined });
    if (this.activeFilter === 'pending')   this.taskService.updateFilter({ completed: false });
    if (this.activeFilter === 'completed') this.taskService.updateFilter({ completed: true });
  }

  onCategoryFilter(categoryId: string) {
    if (this.selectedCategoryFilter === categoryId) {
      this.selectedCategoryFilter = '';
      this.taskService.updateFilter({ categoryId: undefined });
    } else {
      this.selectedCategoryFilter = categoryId;
      this.taskService.updateFilter({ categoryId });
    }
  }

  // ── Modal ────────────────────────────────────────────
  openAddModal() {
    this.resetForm();
    this.isEditing.set(false);
    this.editingTask.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(task: Task) {
    this.taskTitle       = task.title;
    this.taskDescription = task.description ?? '';
    this.taskPriority    = task.priority;
    this.taskCategoryId  = task.categoryId;
    this.isEditing.set(true);
    this.editingTask.set(task);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.resetForm();
  }

  private resetForm() {
    this.taskTitle       = '';
    this.taskDescription = '';
    this.taskPriority    = 'medium';
    const cats = this.categoryService.categories();
    this.taskCategoryId  = cats.length > 0 ? cats[0].id : '';
  }

  // ── CRUD ─────────────────────────────────────────────
  async saveTask() {
    if (!this.taskTitle.trim()) {
      const toast = await this.toastCtrl.create({
        message: 'El título es obligatorio', duration: 2000, color: 'warning'
      });
      await toast.present();
      return;
    }

    if (this.isEditing() && this.editingTask()) {
      await this.taskService.updateTask(this.editingTask()!.id, {
        title:       this.taskTitle,
        description: this.taskDescription,
        priority:    this.taskPriority,
        categoryId:  this.taskCategoryId
      });
      await this.showToast('Tarea actualizada ✅', 'success');
    } else {
      await this.taskService.addTask(
        this.taskTitle, this.taskCategoryId,
        this.taskPriority, this.taskDescription
      );
      await this.showToast('Tarea agregada ✅', 'success');
    }
    this.closeModal();
  }

  async deleteTask(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: '¿Estás seguro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar', role: 'destructive',
          handler: async () => {
            await this.taskService.deleteTask(id);
            await this.showToast('Tarea eliminada', 'danger');
          }
        }
      ]
    });
    await alert.present();
  }

  async toggleComplete(id: string) {
    await this.taskService.toggleComplete(id);
  }

  async clearCompleted() {
    const alert = await this.alertCtrl.create({
      header: 'Limpiar completadas',
      message: '¿Eliminar todas las tareas completadas?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Limpiar', handler: async () => {
            await this.taskService.clearCompleted();
            await this.showToast('Tareas completadas eliminadas', 'medium');
          }
        }
      ]
    });
    await alert.present();
  }

  getCategoryForTask(task: Task): Category | undefined {
    return this.categoryService.getCategoryById(task.categoryId);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    await toast.present();
  }
}