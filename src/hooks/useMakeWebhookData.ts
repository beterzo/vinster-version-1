
import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEnthousiasmeResponses } from "./useEnthousiasmeResponses";
import { useWensberoepenResponses } from "./useWensberoepenResponses";
import { useExtraInformatieResponses } from "./useExtraInformatieResponses";
import { usePrioriteitenResponses } from "./usePrioriteitenResponses";
import type { MakeWebhookData } from "@/services/webhookService";

export const useMakeWebhookData = () => {
  const { user } = useAuth();
  const { responses: enthousiasmeResponses } = useEnthousiasmeResponses();
  const { responses: wensberoepenResponses } = useWensberoepenResponses();
  const { responses: extraInformatieResponses } = useExtraInformatieResponses();
  const { responses: prioriteitenResponses } = usePrioriteitenResponses();
  const [profileData, setProfileData] = useState<any>(null);

  // Load profile data including the AI columns
  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, ai_lievelings_activiteiten, ai_werkomstandigheden, ai_interesses')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile data:', error);
        return;
      }

      setProfileData(data);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const collectMakeWebhookData = (): MakeWebhookData | null => {
    if (!user) {
      console.error("No user found for Make webhook data collection");
      return null;
    }

    const data: MakeWebhookData = {
      user_id: user.id,
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      email: user.email || "",
      
      // AI-generated keywords (stored as JSON strings in database)
      ai_lievelings_activiteiten: profileData?.ai_lievelings_activiteiten || "",
      ai_werkomstandigheden: profileData?.ai_werkomstandigheden || "",
      ai_interesses: profileData?.ai_interesses || "",
      
      // User-selected keywords from prioriteiten
      selected_activiteiten_keywords: prioriteitenResponses?.selected_activiteiten_keywords || [],
      selected_werkomstandigheden_keywords: prioriteitenResponses?.selected_werkomstandigheden_keywords || [],
      selected_interesses_keywords: prioriteitenResponses?.selected_interesses_keywords || [],
      
      // Extra text from prioriteiten
      extra_activiteiten_tekst: prioriteitenResponses?.extra_activiteiten_tekst || "",
      extra_werkomstandigheden_tekst: prioriteitenResponses?.extra_werkomstandigheden_tekst || "",
      extra_interesses_tekst: prioriteitenResponses?.extra_interesses_tekst || "",
      
      // Extra informatie data
      opleidingsniveau: extraInformatieResponses?.opleidingsniveau || "",
      beroepsopleiding: extraInformatieResponses?.beroepsopleiding || "",
      fysieke_beperkingen: extraInformatieResponses?.fysieke_beperkingen || "",
      sector_voorkeur: extraInformatieResponses?.sector_voorkeur || "",
    };

    return data;
  };

  return {
    collectMakeWebhookData,
    refreshProfileData: loadProfileData
  };
};
