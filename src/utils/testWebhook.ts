// Direct webhook call functie voor echte data
export const sendWebhookDirectly = async (data: any) => {
  const webhookUrl = "https://beterzotech.app.n8n.cloud/webhook-test/dc567df2-3b19-40dc-a893-fd6fccb55587";
  
  try {
    console.log("🚀 Sending webhook data to:", webhookUrl);
    console.log("📦 Data being sent:", data);
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("📊 Webhook response status:", response.status);
    console.log("📋 Webhook response headers:", Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log("📄 Webhook response body:", responseText);

    if (!response.ok) {
      throw new Error(`Webhook call failed with status: ${response.status} - ${responseText}`);
    }

    console.log("✅ Webhook sent successfully!");
    return { success: true, response: responseText };
  } catch (error) {
    console.error("❌ Error sending webhook:", error);
    return { success: false, error: error };
  }
};

// Test webhook functie
export const testWebhook = async () => {
  const testData = {
    user_id: "test-user-123",
    language: "nl",
    first_name: "Test",
    last_name: "User", 
    email: "test@test.com",
    enthousiasme_eerste_werk_leukste_taken: "Test data voor webhook",
    wensberoepen_wensberoep_1_titel: "Test beroep",
    test_timestamp: new Date().toISOString()
  };

  return await sendWebhookDirectly(testData);
};

// Maak de functie beschikbaar op window voor console testing
if (typeof window !== 'undefined') {
  (window as any).testWebhook = testWebhook;
  (window as any).sendWebhookDirectly = sendWebhookDirectly;
}