/** @type {import('tailwindcss').Config} */ 
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#171717',
        surfaceHighlight: '#262626',
        primary: '#00ffcc', // Neon Cyan
        secondary: '#bf00ff', // Neon Purple
        accent: '#ff0055', // Neon Pink
        crmGreen: '#3E8E7E', // CRM specific teal
        crmSand: '#E6D5BE', // CRM specific beige
        text: '#f3f4f6',
        textMuted: '#9ca3af',
        // ---- Paleta de marca SISTEMA GM ----
        marcaArena: '#FBE5C8',
        marcaTerracota: '#B4551A',
        marcaAzul: '#2F6DA0',
        fondo: '#FAF6F0',
        texto: '#2A2118',
        // Nuevos colores Light Mode para CRM
        crmTeal: '#3E9B94',
        crmPeach: '#FBE5C8',
        crmAqua: '#A7E0DB',
        crmLightBg: '#F8F9FA',
        crmDarkText: '#1F2937',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 255, 204, 0.5), 0 0 20px rgba(0, 255, 204, 0.3)',
        'neon-purple': '0 0 10px rgba(191, 0, 255, 0.5), 0 0 20px rgba(191, 0, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
