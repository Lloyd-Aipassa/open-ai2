<template>
  <div class="chat-container">
    <p>stel een vraag als <i>"Analyseer de doelgroep voor een senior Java developer in Amsterdam."</i> </p>
    <div class="input-area">
      <input 
        v-model="userInput" 
        @keyup.enter="sendMessage" 
        id="userInput" 
        placeholder="Stel een vraag..." 
        class="input"
      />
      <button @click="sendMessage" class="button">Stuur</button>
    </div>
    <div v-if="isLoading" class="loading">GPT denkt na...</div>
    <pre v-else id="chatResponse" class="response">{{ chatResponse }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userInput = ref('');
const chatResponse = ref('');
const isLoading = ref(false);

// Chat geschiedenis
const chatHistory = ref([
  {
    role: 'system',
    content: `Je bent een senior recruitment data-analist en arbeidsmarktstrateeg. 
Je volgt de vaste structuur van doelgroepanalyse in 11 onderdelen en geeft 10 sourcingstrategieën. 
Je taalgebruik is professioneel, analytisch maar vlot en begrijpelijk.`,
  }
]);

const sendMessage = async () => {
  if (!userInput.value.trim()) return;
  
  isLoading.value = true;
  
  // Voeg vraag van gebruiker toe aan gespreksgeschiedenis
  chatHistory.value.push({ role: 'user', content: userInput.value });
  
  try {
    // Gebruik van de nieuwe server API-route in plaats van rechtstreeks naar OpenAI
    const response = await fetch('/api/open', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: chatHistory.value
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      const reply = data.choices[0].message.content;
      
      // Voeg GPT's antwoord toe aan de geschiedenis
      chatHistory.value.push({ role: 'assistant', content: reply });
      chatResponse.value = reply;
    } else {
      chatResponse.value = 'Geen antwoord ontvangen.';
    }
  } catch (err) {
    chatResponse.value = `Fout: ${err.message}`;
  } finally {
    isLoading.value = false;
    // Wis inputveld
    userInput.value = '';
  }
};
</script>

<style scoped>
/* Stijl blijft hetzelfde */
</style>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.input-area {
  display: flex;
  margin-bottom: 20px;
}

.input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.button {
  padding: 10px 20px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0055aa;
}

.response {
  white-space: pre-wrap;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  min-height: 100px;
}

.loading {
  color: #666;
  font-style: italic;
}
</style>