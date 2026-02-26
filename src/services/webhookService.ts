
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
  // Wensberoep 1
  wensberoep_1_titel: string;
  wensberoep_1_werkweek_activiteiten: string;
  wensberoep_1_werklocatie_omgeving: string;
  wensberoep_1_samenwerking_contacten: string;
  wensberoep_1_fluitend_thuiskomen: string;
  wensberoep_1_werk_doel: string;
  wensberoep_1_leukste_onderdelen: string;
  wensberoep_1_belangrijke_aspecten: string;
  wensberoep_1_kennis_focus: string;
  // Wensberoep 2
  wensberoep_2_titel: string;
  wensberoep_2_werkweek_activiteiten: string;
  wensberoep_2_werklocatie_omgeving: string;
  wensberoep_2_samenwerking_contacten: string;
  wensberoep_2_fluitend_thuiskomen: string;
  wensberoep_2_werk_doel: string;
  wensberoep_2_leukste_onderdelen: string;
  wensberoep_2_belangrijke_aspecten: string;
  wensberoep_2_kennis_focus: string;
  // Wensberoep 3
  wensberoep_3_titel: string;
  wensberoep_3_werkweek_activiteiten: string;
  wensberoep_3_werklocatie_omgeving: string;
  wensberoep_3_samenwerking_contacten: string;
  wensberoep_3_fluitend_thuiskomen: string;
  wensberoep_3_werk_doel: string;
  wensberoep_3_leukste_onderdelen: string;
  wensberoep_3_belangrijke_aspecten: string;
  wensberoep_3_kennis_focus: string;
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
