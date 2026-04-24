
# Series Tracker — Cliente (Frontend)

> Aplicación frontend desarrollada con JavaScript vanilla que consume una API REST para gestionar un tracker personal de series. No utiliza frameworks ni librerías externas.

🔗 **Repositorio Backend**: [https://github.com/camsandvl/Backend-Web](https://github.com/camsandvl/Backend-Web)
🌐 **Aplicación en producción**: [https://camsandvl.github.io/Frontend-Web/](https://camsandvl.github.io/Frontend-Web/)

---

## 📸 Screenshot

![App Screenshot](./screenshots/frontend.png)

---

## 🛠️ Tecnologías utilizadas

* **HTML5** — estructura semántica
* **CSS3** — variables CSS, grid, flexbox, animaciones
* **JavaScript ES2020** — módulos ES, `fetch()`, `FormData`, `Blob API`
* ❌ Sin frameworks
* ❌ Sin librerías externas
* ❌ Sin jQuery / axios

---

## ⚙️ Ejecución local

```bash
# 1. Clonar repositorio
git clone https://github.com/camsandvl/Frontend-Web.git
cd Frontend-Web

# 2. Configurar URL del backend
# Editar js/api.js
# BASE_URL = http://localhost:3000

# 3. Servir el proyecto (necesario para ES modules)
npx serve .
```

⚠️ Importante:
No abrir `index.html` directamente con `file://` — los módulos ES requieren servidor.

---

## 🧩 Estructura del proyecto

```
Frontend-Web/
├── index.html        # Estructura principal de la app
├── css/
│   └── styles.css    # Estilos globales
├── js/
│   ├── api.js        # Comunicación con la API (fetch)
│   ├── ui.js         # Renderizado del DOM
│   ├── app.js        # Lógica principal y eventos
│   ├── export.js     # Exportación CSV y Excel
│   └── rating.js     # Sistema de rating con estrellas
└── README.md
```

---

## 🔗 Comunicación cliente-servidor

Este frontend consume una API REST mediante `fetch()`.

Ejemplo:

```js
fetch("https://backend-web-7aqu.onrender.com/series")
```

El servidor responde únicamente con JSON, y el cliente se encarga de renderizar los datos.

Esto demuestra la separación completa entre:

* Cliente (UI)
* Servidor (lógica y datos)

---

## 🌐 Despliegue

El frontend está desplegado usando **GitHub Pages** (gratuito).

El backend se encuentra desplegado en **Render**, por lo que la variable:

```js
const BASE_URL = "https://backend-web-7aqu.onrender.com";
```

apunta a un servidor real en producción.

---

## 🧠 Funcionalidades principales

* ✔ Visualización de series en tarjetas
* ✔ Crear nuevas series desde la interfaz
* ✔ Editar series existentes
* ✔ Eliminar series
* ✔ Subida de imágenes con preview en tiempo real
* ✔ Persistencia en base de datos remota
* ✔ Búsqueda por nombre
* ✔ Ordenamiento (asc/desc)
* ✔ Paginación
* ✔ Sistema de rating con estrellas
* ✔ Exportación a CSV (sin librerías)
* ✔ Exportación a Excel (.xlsx) (manual, sin librerías)

---

## 📊 Challenges implementados

* [x] CRUD completo desde el frontend
* [x] Uso de `fetch()` (sin axios)
* [x] Subida de imágenes
* [x] Exportación CSV
* [x] Exportación Excel sin librerías
* [x] Sistema de rating con endpoints propios
* [x] Interfaz visual moderna (animaciones, UI limpia)

---

## ⚠️ Nota sobre imágenes

Las imágenes se almacenan en el servidor (Render) usando Multer.

Debido a que el almacenamiento en Render (plan gratuito) es temporal:

* las imágenes pueden desaparecer si el servidor se reinicia
* las imágenes deben subirse desde el entorno en producción

---

## 🔒 Sobre CORS

El backend permite solicitudes desde cualquier origen mediante:

```
Access-Control-Allow-Origin: *
```

Esto permite que el frontend (GitHub Pages) pueda comunicarse con el backend (Render), ya que están en dominios distintos.

---

## 🧠 Reflexión

Durante el desarrollo de este proyecto, comprendí la importancia de separar completamente el cliente y el servidor. A diferencia de enfoques anteriores donde el backend generaba HTML, en este caso el servidor actúa únicamente como proveedor de datos en formato JSON, y el cliente es responsable de la presentación.

Trabajar con JavaScript vanilla permitió reforzar conceptos fundamentales como el uso de `fetch()`, manipulación del DOM y manejo de eventos sin depender de frameworks. Además, implementar funcionalidades como exportación a CSV y Excel sin librerías fue un reto interesante que requirió investigar formatos como SpreadsheetML.

También aprendí sobre despliegue en producción usando Render y GitHub Pages, incluyendo aspectos importantes como CORS, variables de entorno y conexiones seguras a bases de datos.

Si tuviera que mejorar este proyecto, implementaría almacenamiento persistente de imágenes utilizando servicios como AWS S3 o Cloudinary, así como autenticación de usuarios.

Definitivamente utilizaría este stack nuevamente, ya que proporciona una base sólida para desarrollar aplicaciones web completas y escalables.

