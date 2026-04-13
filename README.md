# 📝 Todo Ionic App

Aplicación móvil de gestión de tareas construida con **Ionic + Angular**.  
Incluye categorías, filtros, Firebase Remote Config y compilación nativa Android/iOS.

---

## 🛠️ Stack Tecnológico

| Tecnología | Propósito |
|---|---|
| Ionic 8 + Angular 17 | Framework híbrido |
| Capacitor 6 | Compilación nativa Android/iOS |
| Firebase Remote Config | Feature flags en tiempo real |
| Capacitor Preferences | Almacenamiento local |
| Angular Signals | Estado reactivo optimizado |

---

## ✨ Funcionalidades

- ✅ Agregar, editar y eliminar tareas
- ✅ Marcar tareas como completadas
- ✅ Crear, editar y eliminar categorías
- ✅ Asignar categoría y prioridad a cada tarea
- ✅ Filtrar tareas por categoría y estado
- ✅ Búsqueda en tiempo real
- ✅ Feature flags con Firebase Remote Config
- ✅ Almacenamiento local persistente
- ✅ Conexión con API de franquicias (backend)

---

## ⚙️ Prerrequisitos

```bash
node --version   # v18+
ionic --version  # 7+
java --version   # 17+ (para Android)
```

---

## 🚀 Ejecutar en desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/todo-ionic-app.git
cd todo-ionic-app

# Instalar dependencias
npm install

# Correr en navegador
ionic serve
```

Abre: `http://localhost:8100`

---

## 📱 Compilar para Android

```bash
# Build de producción
ionic build --prod

# Sincronizar con Capacitor
npx cap sync android

# Opción 1: Abrir Android Studio y generar APK
npx cap open android
# Build → Build APK(s)

# Opción 2: Generar APK directo (requiere Android SDK)
cd android && ./gradlew assembleDebug
```

APK generado en: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🍎 Compilar para iOS (requiere macOS + Xcode)

```bash
npx cap add ios
npx cap sync ios
npx cap open ios
# Product → Archive → Distribute App
```

---

## 🔥 Firebase Remote Config

Los feature flags se gestionan desde Firebase Console:

| Flag | Descripción | Default |
|---|---|---|
| `showPriority` | Muestra prioridad en tareas | `true` |
| `showDescription` | Muestra descripción en tareas | `true` |
| `enableSearch` | Habilita búsqueda | `true` |
| `enableStatistics` | Habilita página de stats | `false` |

Para probar un feature flag:
1. Ve a Firebase Console → Remote Config
2. Cambia el valor de cualquier flag
3. Publica los cambios
4. Recarga la app → el cambio se aplica en tiempo real

---

## 🏗️ Estructura del Proyecto
src/app/
├── models/          ← Interfaces TypeScript
├── services/        ← Lógica de negocio y datos
├── pages/
│   ├── tasks/       ← Lista de tareas con filtros
│   ├── categories/  ← Gestión de categorías
│   └── stats/       ← Estadísticas y feature flags
└── shared/
├── components/  ← TaskCard, EmptyState
└── pipes/       ← FilterByCategory

---

## ❓ Preguntas Técnicas

### ¿Cuáles fueron los principales desafíos?

Integrar Firebase Remote Config con el sistema de signals de Angular 17 fue el mayor reto, ya que ambos manejan reactividad de forma diferente. La solución fue encapsular los flags en un signal que se actualiza al recibir la respuesta de Firebase, permitiendo que la UI reaccione automáticamente sin suscripciones manuales.

### ¿Qué técnicas de optimización aplicaste?

- **Lazy loading** de páginas: cada página se carga solo cuando el usuario la visita, reduciendo el bundle inicial de ~1MB a ~200KB.
- **Angular Signals**: reemplazan los Observables para el estado local, eliminando memory leaks por suscripciones no canceladas.
- **Pure pipes**: el pipe `filterByCategory` solo recalcula cuando cambian los inputs, evitando re-renders innecesarios.
- **TrackBy en ngFor**: optimiza el re-render de la lista de tareas identificando cada ítem por su `id`.
- **Capacitor Preferences**: API nativa de almacenamiento, más rápida que `localStorage` en dispositivos reales.

### ¿Cómo aseguraste la calidad y mantenibilidad?

- **Separación de responsabilidades**: servicios independientes para tareas, categorías y feature flags.
- **Tipado fuerte**: interfaces TypeScript para todos los modelos de datos.
- **Componentes standalone**: arquitectura modular de Angular 17 que elimina NgModules innecesarios.
- **Manejo de errores**: try/catch en todos los métodos async con fallback a valores por defecto.

---

## 👤 Autor

Desarrollado como prueba técnica para **Accenture**  
Stack: Ionic 8 · Angular 17 · Firebase · Capacitor · TypeScript