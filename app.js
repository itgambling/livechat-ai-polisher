const openaiKey = 'YOUR_OPENAI_API_KEY'; // NEVER expose this in production

document.getElementById('polishBtn').addEventListener('click', async () => {
  const inputBox = document.getElementById('agentInput');
  const status = document.getElementById('status');
  const originalText = inputBox.value.trim();

  if (!originalText) {
    alert("Please type a message to polish.");
    return;
  }

  status.textContent = "Polishing...";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that rewrites customer service messages to sound clear, friendly, and professional."
          },
          {
            role: "user",
            content: originalText
          }
        ]
      })
    });

    const data = await response.json();
    const polished = data.choices?.[0]?.message?.content?.trim();

    if (polished) {
      inputBox.value = polished;
      status.textContent = "✅ Polished!";
    } else {
      throw new Error("Empty response from OpenAI.");
    }
  } catch (error) {
    console.error(error);
    status.textContent = "❌ Failed to polish the message. Check your API key or connection.";
  }
});
