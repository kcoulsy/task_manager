import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css", "vue-sonner/style.css"],

  typescript: {
    typeCheck: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["shadcn-nuxt", "@nuxt/eslint", "@pinia/nuxt", "@nuxt/fonts"],

  fonts: {
    families: [
      { name: "Playfair Display", provider: "google", weights: ["700", "900"] },
      { name: "Inter", provider: "google", weights: ["400", "500", "600"] },
      { name: "JetBrains Mono", provider: "google", weights: ["400", "500"] },
    ],
  },
});
