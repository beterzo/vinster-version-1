
import { useEnthousiasmeResponses } from "./useEnthousiasmeResponses";
import { useWensberoepenResponses } from "./useWensberoepenResponses";
import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { WebhookData } from "@/services/webhookService";

export const useWebhookData = () => {
  const { user } = useAuth();
  const { responses: enthousiasmeResponses } = useEnthousiasmeResponses();
  const { responses: wensberoepenResponses } = useWensberoepenResponses();
  const [profileData, setProfileData] = useState<any>(null);

  // Load profile data including the new AI columns
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
        .select('first_name, last_name, gender, ai_lievelings_activiteiten, ai_werkomstandigheden, ai_interesses')
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

  const collectWebhookData = (): WebhookData | null => {
    if (!user) {
      console.error("No user found for webhook data collection");
      return null;
    }

    const data: WebhookData = {
      user_id: user.id,
      
      // Profile data
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      gender: profileData?.gender || "",
      
      // AI-generated fields (will be empty initially, can be filled by N8N)
      ai_lievelings_activiteiten: profileData?.ai_lievelings_activiteiten || "",
      ai_werkomstandigheden: profileData?.ai_werkomstandigheden || "",
      ai_interesses: profileData?.ai_interesses || "",
      
      // Enthousiasme responses mapping
      enthusiasm_childhood_1: enthousiasmeResponses?.kindertijd_liefste_activiteiten || "",
      enthusiasm_childhood_2: enthousiasmeResponses?.kindertijd_favoriete_plekken || "",
      enthusiasm_childhood_3: enthousiasmeResponses?.kindertijd_interesses || "",
      
      enthusiasm_teen_1: enthousiasmeResponses?.school_interessantste_vakken || "",
      enthusiasm_teen_2: enthousiasmeResponses?.school_thuiskomst_activiteiten || "",
      enthusiasm_teen_3: enthousiasmeResponses?.school_naschoolse_activiteiten || "",
      
      enthusiasm_earlywork_1: enthousiasmeResponses?.eerste_werk_leukste_aspecten || "",
      enthusiasm_earlywork_2: enthousiasmeResponses?.werkomgeving_aantrekkelijke_elementen || "",
      enthusiasm_earlywork_3: enthousiasmeResponses?.samenwerking_prettige_aspecten || "",
      
      enthusiasm_recentwork_1: enthousiasmeResponses?.plezierige_werkperiode_beschrijving || "",
      enthusiasm_recentwork_2: enthousiasmeResponses?.leuk_project_en_rol || "",
      enthusiasm_recentwork_3: enthousiasmeResponses?.fluitend_thuiskomen_dag || "",

      // Wensberoepen responses mapping
      // Wensberoep 1
      wensberoep_1_titel: wensberoepenResponses?.wensberoep_1_titel || "",
      wensberoep_1_vraag_1: wensberoepenResponses?.wensberoep_1_werkweek_activiteiten || "",
      wensberoep_1_vraag_2: wensberoepenResponses?.wensberoep_1_werklocatie_omgeving || "",
      wensberoep_1_vraag_3: wensberoepenResponses?.wensberoep_1_binnen_buiten_verhouding || "",
      wensberoep_1_vraag_4: wensberoepenResponses?.wensberoep_1_samenwerking_contacten || "",
      wensberoep_1_vraag_5: wensberoepenResponses?.wensberoep_1_fluitend_thuiskomen_dag || "",
      wensberoep_1_vraag_6: wensberoepenResponses?.wensberoep_1_werk_doel || "",
      wensberoep_1_vraag_7: wensberoepenResponses?.wensberoep_1_reistijd || "",
      wensberoep_1_vraag_8: wensberoepenResponses?.wensberoep_1_werkuren || "",
      wensberoep_1_vraag_9: wensberoepenResponses?.wensberoep_1_werksfeer || "",
      wensberoep_1_vraag_10: wensberoepenResponses?.wensberoep_1_leukste_onderdelen || "",
      wensberoep_1_vraag_11: wensberoepenResponses?.wensberoep_1_belangrijke_aspecten || "",
      wensberoep_1_vraag_12: wensberoepenResponses?.wensberoep_1_kennis_focus || "",

      // Wensberoep 2
      wensberoep_2_titel: wensberoepenResponses?.wensberoep_2_titel || "",
      wensberoep_2_vraag_1: wensberoepenResponses?.wensberoep_2_werkweek_activiteiten || "",
      wensberoep_2_vraag_2: wensberoepenResponses?.wensberoep_2_werklocatie_omgeving || "",
      wensberoep_2_vraag_3: wensberoepenResponses?.wensberoep_2_binnen_buiten_verhouding || "",
      wensberoep_2_vraag_4: wensberoepenResponses?.wensberoep_2_samenwerking_contacten || "",
      wensberoep_2_vraag_5: wensberoepenResponses?.wensberoep_2_fluitend_thuiskomen_dag || "",
      wensberoep_2_vraag_6: wensberoepenResponses?.wensberoep_2_werk_doel || "",
      wensberoep_2_vraag_7: wensberoepenResponses?.wensberoep_2_reistijd || "",
      wensberoep_2_vraag_8: wensberoepenResponses?.wensberoep_2_werkuren || "",
      wensberoep_2_vraag_9: wensberoepenResponses?.wensberoep_2_werksfeer || "",
      wensberoep_2_vraag_10: wensberoepenResponses?.wensberoep_2_leukste_onderdelen || "",
      wensberoep_2_vraag_11: wensberoepenResponses?.wensberoep_2_belangrijke_aspecten || "",
      wensberoep_2_vraag_12: wensberoepenResponses?.wensberoep_2_kennis_focus || "",

      // Wensberoep 3
      wensberoep_3_titel: wensberoepenResponses?.wensberoep_3_titel || "",
      wensberoep_3_vraag_1: wensberoepenResponses?.wensberoep_3_werkweek_activiteiten || "",
      wensberoep_3_vraag_2: wensberoepenResponses?.wensberoep_3_werklocatie_omgeving || "",
      wensberoep_3_vraag_3: wensberoepenResponses?.wensberoep_3_binnen_buiten_verhouding || "",
      wensberoep_3_vraag_4: wensberoepenResponses?.wensberoep_3_samenwerking_contacten || "",
      wensberoep_3_vraag_5: wensberoepenResponses?.wensberoep_3_fluitend_thuiskomen_dag || "",
      wensberoep_3_vraag_6: wensberoepenResponses?.wensberoep_3_werk_doel || "",
      wensberoep_3_vraag_7: wensberoepenResponses?.wensberoep_3_reistijd || "",
      wensberoep_3_vraag_8: wensberoepenResponses?.wensberoep_3_werkuren || "",
      wensberoep_3_vraag_9: wensberoepenResponses?.wensberoep_3_werksfeer || "",
      wensberoep_3_vraag_10: wensberoepenResponses?.wensberoep_3_leukste_onderdelen || "",
      wensberoep_3_vraag_11: wensberoepenResponses?.wensberoep_3_belangrijke_aspecten || "",
      wensberoep_3_vraag_12: wensberoepenResponses?.wensberoep_3_kennis_focus || "",
    };

    return data;
  };

  return {
    collectWebhookData,
    refreshProfileData: loadProfileData
  };
};
