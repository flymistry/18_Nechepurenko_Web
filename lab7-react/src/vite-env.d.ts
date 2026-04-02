/// <reference types="vite/client" />

// Разрешаем импорт CSS файлов
declare module '*.css' {
  const content: string;
  export default content;
}