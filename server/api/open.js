// import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        // model: 'gpt-3.5-turbo',
        // model: 'gpt-4.1-mini',
        // model: 'GPT-4o Mini',

        model: 'gpt-4.1',
        messages: body.messages,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return { error: 'Failed to get response from OpenAI' };
  }
});
