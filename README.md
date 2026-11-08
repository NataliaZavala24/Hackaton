<img width="32" height="32" alt="image" src="https://github.com/user-attachments/assets/9a59b7ce-7f68-4d54-93c4-1ebf8d54700b" />
## Gestor de Finanzas Personales  
### Autores

- Palomeque Agustín Nicolás
- Zavala Mónica Natalia
  
## Descripción
Aplicación web interactiva que permite gestionar las finanzas personales mediante el registro y visualización de ingresos y gastos.

El proyecto fue desarrollado como parte de una actividad académica, aplicando conceptos de Programación Orientada a Objetos (POO), JavaScript, manipulación del DOM y almacenamiento de datos en el navegador.

## Funcionalidades
- Registrar ingresos y gastos.
- Clasificar las transacciones por categorías.
- Visualizar el historial de movimientos.
- Calcular ingresos, gastos y balance total.
- Mostrar gráficos para analizar las finanzas.
- Eliminar transacciones individuales.
- Eliminar todo el historial.
- Guardar los datos utilizando localStorage, para conservarlos al cerrar o actualizar la página.

## Tecnologías utilizadas
- HTML5
- JavaScript (ES6)
- Tailwind CSS
- ApexCharts
- SweetAlert2
- localStorage

## Estructura del proyecto

```text
Hackaton/
├── classes/
│   └── transaccion.js
├── src/
│   ├── input.css
│   └── output.css
├── app.js
├── index.html
├── icon-dolar.png
├── icons8-delete-trash-48.png
```

## Cómo ejecutar el proyecto
1. Clonar o descargar el repositorio.
2. Abrir la carpeta del proyecto.
3. Ejecutar `index.html` en el navegador, preferentemente utilizando Live Server desde Visual Studio Code.

## Almacenamiento de datos
La aplicación utiliza `localStorage` para guardar las transacciones en el navegador, permitiendo que la información permanezca disponible al volver a ingresar desde el mismo navegador.

