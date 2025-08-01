
import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEnthousiasmeResponses } from "./useEnthousiasmeResponses";
import { useWensberoepenResponses } from "./useWensberoepenResponses";
import { useExtraInformatieResponses } from "./useExtraInformatieResponses";
import { usePrioriteitenResponses } from "./usePrioriteitenResponses";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MakeWebhookData } from "@/services/webhookService";

export const useMakeWebhookData = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
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

  // New function to collect webhook data directly from database
  const collectMakeWebhookDataFromDB = async (): Promise<MakeWebhookData | null> => {
    if (!user) {
      console.error("No user found for Make webhook data collection");
      return null;
    }

    try {
      console.log('🔄 Fetching fresh webhook data from database for user:', user.id);

      // Fetch profile data with AI keywords
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, ai_lievelings_activiteiten, ai_werkomstandigheden, ai_interesses')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile data:', profileError);
        throw profileError;
      }

      // Fetch prioriteiten responses
      const { data: prioriteitenData, error: prioriteitenError } = await supabase
        .from('prioriteiten_responses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (prioriteitenError) {
        console.error('Error fetching prioriteiten data:', prioriteitenError);
        throw prioriteitenError;
      }

      // Fetch extra informatie responses
      const { data: extraInfoData, error: extraInfoError } = await supabase
        .from('extra_informatie_responses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (extraInfoError) {
        console.error('Error fetching extra informatie data:', extraInfoError);
        throw extraInfoError;
      }

      const webhookData: MakeWebhookData = {
        user_id: user.id,
        first_name: profileData?.first_name || "",
        last_name: profileData?.last_name || "",
        email: user.email || "",
        language: language,
        
        // AI-generated keywords (stored as JSON strings in database)
        ai_lievelings_activiteiten: profileData?.ai_lievelings_activiteiten || "",
        ai_werkomstandigheden: profileData?.ai_werkomstandigheden || "",
        ai_interesses: profileData?.ai_interesses || "",
        
        // User-selected keywords from prioriteiten (converted to JSON strings)
        selected_activiteiten_keywords: JSON.stringify(prioriteitenData?.selected_activiteiten_keywords || []),
        selected_werkomstandigheden_keywords: JSON.stringify(prioriteitenData?.selected_werkomstandigheden_keywords || []),
        selected_interesses_keywords: JSON.stringify(prioriteitenData?.selected_interesses_keywords || []),
        
        // Extra text from prioriteiten
        extra_activiteiten_tekst: prioriteitenData?.extra_activiteiten_tekst || "",
        extra_werkomstandigheden_tekst: prioriteitenData?.extra_werkomstandigheden_tekst || "",
        extra_interesses_tekst: prioriteitenData?.extra_interesses_tekst || "",
        
        // Extra informatie data
        opleidingsniveau: extraInfoData?.opleidingsniveau || "",
        beroepsopleiding: extraInfoData?.beroepsopleiding || "",
        fysieke_beperkingen: extraInfoData?.fysieke_beperkingen || "",
        sector_voorkeur: extraInfoData?.sector_voorkeur || "",
      };

      console.log('✅ Fresh webhook data collected from database:', {
        selected_activiteiten_count: prioriteitenData?.selected_activiteiten_keywords?.length || 0,
        selected_werkomstandigheden_count: prioriteitenData?.selected_werkomstandigheden_keywords?.length || 0,
        selected_interesses_count: prioriteitenData?.selected_interesses_keywords?.length || 0,
        selected_interesses_keywords: prioriteitenData?.selected_interesses_keywords
      });

      return webhookData;
    } catch (error) {
      console.error('❌ Error collecting webhook data from database:', error);
      // Fallback to original method if database fetch fails
      console.log('🔄 Falling back to hook state data');
      return collectMakeWebhookData();
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
      language: language,
      
      // AI-generated keywords (stored as JSON strings in database)
      ai_lievelings_activiteiten: profileData?.ai_lievelings_activiteiten || "",
      ai_werkomstandigheden: profileData?.ai_werkomstandigheden || "",
      ai_interesses: profileData?.ai_interesses || "",
      
      // User-selected keywords from prioriteiten (converted to JSON strings)
      selected_activiteiten_keywords: JSON.stringify(prioriteitenResponses?.selected_activiteiten_keywords || []),
      selected_werkomstandigheden_keywords: JSON.stringify(prioriteitenResponses?.selected_werkomstandigheden_keywords || []),
      selected_interesses_keywords: JSON.stringify(prioriteitenResponses?.selected_interesses_keywords || []),
      
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
    collectMakeWebhookDataFromDB,
    refreshProfileData: loadProfileData
  };
};
