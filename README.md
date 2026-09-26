# Rifa Segundo Medio · Colegio Waldorf Michelangelo

Página web estática (HTML, CSS y JS) para la rifa del Segundo Medio.

## Editar la rifa

Todo el contenido (premios, precio, fecha del sorteo, números vendidos, datos de transferencia y WhatsApp) está en **`js/config.js`**. Para marcar un número como vendido, agrégalo a la lista `vendidos` y sube el cambio: Vercel publica la nueva versión automáticamente.

## Estructura

```
index.html      Página principal
css/styles.css  Estilos
js/config.js    Datos de la rifa (editar aquí)
js/app.js       Lógica: grilla de números, cuenta regresiva, carro y WhatsApp
```

## Publicar en Vercel

1. Entra a [vercel.com](https://vercel.com) con tu cuenta de GitHub.
2. **Add New → Project** e importa el repositorio `Rifa-Michelangelo`.
3. Framework Preset: **Other**. No necesita comando de build.
4. **Deploy**. Cada `git push` a `main` actualiza el sitio.

## Ver en local

Abre `index.html` en el navegador.
