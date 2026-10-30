# DeliSmart Admin

Panel de DeliSmart en React, Vite, TypeScript y Tailwind CSS, sobre la API de `delismart-admin-saas-back`. Los superusuarios ven la administración global, y los dueños de restaurante ven **Mi Plan**.

## Desarrollo

```bash
cp .env.example .env.local
npm install
npm run dev
```

El panel abre en `http://localhost:5173`. No tiene login propio: quien llega sin sesión va al login de `delismart-landing`, que al autenticarlo vuelve aquí con los tokens en el fragmento de la URL.
