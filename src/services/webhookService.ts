
export interface WebhookData {
  user_id: string;
  language: string;
  [key: string]: string;
}

export interface MakeWebhookData {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  language: string;
  ai_lievelings_activiteiten: string;
  ai_werkomstandigheden: string;
  ai_interesses: string;
  selected_activiteiten_keywords: string;
  selected_werkomstandigheden_keywords: string;
  selected_interesses_keywords: string;
  extra_activiteiten_tekst: string;
  extra_werkomstandigheden_tekst: string;
  extra_interesses_tekst: string;
  opleidingsniveau: string;
  beroepsopleiding: string;
  fysieke_beperkingen: string;
  sector_voorkeur: string;
}

export const sendWebhookData = async (data: WebhookData): Promise<void> => {
  const webhookUrl = "https://beterzotech.app.n8n.cloud/webhook/dc567df2-3b19-40dc-a893-fd6fccb55587";
  
  try {
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });

    // Clear timeout if request completes successfully
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook call failed with status: ${response.status}`);
    }

    console.log("Webhook data sent successfully:", data);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error("Webhook request timed out after 15 seconds");
      throw new Error("Webhook request timed out - this is normal for long-running processes");
    }
    console.error("Error sending webhook data:", error);
    throw error;
  }
};

export const sendMakeWebhook = async (data: MakeWebhookData): Promise<void> => {
  const makeWebhookUrl = "https://hook.eu2.make.com/fi11tmiwdv0uc2ongoib86f35suq7mva";
  
  try {
    console.log("Sending data to Make.com webhook:", data);
    
    const response = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook call failed with status: ${response.status}`);
    }

    console.log("Make.com webhook data sent successfully:", data);
  } catch (error) {
    console.error("Error sending Make.com webhook data:", error);
    throw error;
  }
};
