
export interface WebhookData {
  user_id: string;
  [key: string]: string;
}

export const sendWebhookData = async (data: WebhookData): Promise<void> => {
  const webhookUrl = "https://beterzotech.app.n8n.cloud/webhook-test/dc567df2-3b19-40dc-a893-fd6fccb55587";
  
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook call failed with status: ${response.status}`);
    }

    console.log("Webhook data sent successfully:", data);
  } catch (error) {
    console.error("Error sending webhook data:", error);
    throw error;
  }
};
