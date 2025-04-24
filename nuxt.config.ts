// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },



  runtimeConfig: {
    // Server-side variabelen (niet beschikbaar in de client)
    openaiApiKey: process.env.OPENAI_API_KEY,
  },
});


