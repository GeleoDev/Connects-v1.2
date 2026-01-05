# Connects Website

Sitio web de Connects - Soluciones en Telecomunicaciones, Fibra Óptica y Energías Renovables

## 🚀 Inicio Rápido

### Opción 1: Servidor Local (Recomendado)

1. **Instalar http-server** (si no está instalado):
   ```bash
   npm install -g http-server
   ```

2. **Iniciar servidor**:
   ```bash
   cd "C:\Users\Tomas Dev\Downloads\htdocs"
   http-server -p 8080 -c-1
   ```

3. **Abrir navegador**:
   - Visita: `http://localhost:8080`

### Opción 2: Abrir directamente
- Abre `index.html` directamente en el navegador
- Nota: Algunas funcionalidades pueden no funcionar correctamente

## 📁 Estructura del Proyecto

```
htdocs/
├── index.html                 # Página principal
├── styles/
│   └── styles.css            # Estilos globales
├── js/
│   └── main.js               # JavaScript principal
├── component/                # Componentes reutilizables
│   ├── Navbar/
│   ├── Footer/
│   ├── Promobanner/
│   └── ...
├── Productos/               # Páginas de productos
│   ├── Kit/
│   │   ├── index.html
│   │   └── styles/product.css
│   └── Inversor Solar/
│       ├── index.html
│       └── styles/product.css
├── img/                     # Imágenes
├── favicon.png
└── ...
```

## ✨ Mejoras Recientes

### Optimización de Formularios (v2.0)
- **Diseño renovado**: Formularios modales ahora tienen el mismo estilo elegante que el formulario de contacto principal
- **Labels flotantes**: Labels que se elevan al hacer foco o completar campos
- **Validación visual**: Estados de éxito/error con colores intuitivos
- **Animaciones suaves**: Transiciones optimizadas con GPU acceleration
- **Rendimiento mejorado**: Throttling, lazy loading y optimizaciones de CSS

### Optimización de Rendimiento (v1.5)
- **GPU Acceleration**: Animaciones usan `transform3d` y `will-change`
- **Throttling**: Control de frecuencia en cambios de imagen
- **Lazy Loading**: Imágenes se cargan solo cuando son necesarias
- **Animaciones optimizadas**: Eliminación de `max-height` ineficiente
- **RequestAnimationFrame**: Animaciones más suaves

## 🎯 Características

### Formularios Interactivos
- **Validación en tiempo real**: Feedback instantáneo
- **Estados visuales**: Indicadores de carga y confirmación
- **Responsive**: Funciona en desktop y móvil
- **Accesibilidad**: Labels apropiados y navegación por teclado

### Animaciones Optimizadas
- **Smooth scrolling**: Navegación fluida
- **Hover effects**: Interacciones visuales elegantes
- **Modal transitions**: Entradas/salidas suaves
- **Image galleries**: Carruseles optimizados

### SEO y Performance
- **Schema.org**: Datos estructurados para motores de búsqueda
- **Open Graph**: Compartir en redes sociales
- **Meta tags**: Optimización completa
- **Preload**: Recursos críticos cargados anticipadamente

## 🛠️ Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Animaciones y diseño responsive
- **JavaScript (Vanilla)**: Interactividad sin frameworks
- **Font Awesome**: Iconos vectoriales
- **Google Fonts**: Tipografía optimizada

## 📱 Responsive Design

El sitio está completamente optimizado para:
- 💻 Desktop (1200px+)
- 💻 Laptop (992px - 1199px)
- 📱 Tablet (768px - 991px)
- 📱 Mobile (320px - 767px)

## 🔧 Desarrollo

### Requisitos
- Node.js (para servidor local)
- Navegador moderno con soporte ES6+

### Comandos Útiles
```bash
# Instalar servidor global
npm install -g http-server

# Iniciar servidor de desarrollo
http-server -p 8080 -c-1 -o

# Verificar archivos
ls -la
```

## 📞 Contacto

**Connects**
- 📧 ventas@connects.com.ar
- 📍 Av. Montes de Oca 501, CABA
- 🌐 https://connects.com.ar

---

*Última actualización: Enero 2026*
