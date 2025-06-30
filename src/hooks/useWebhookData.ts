
import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEnthousiasmeResponses } from "./useEnthousiasmeResponses";
import { useWensberoepenResponses } from "./useWensberoepenResponses";
import { useExtraInformatieResponses } from "./useExtraInformatieResponses";
import { usePrioriteitenResponses } from "./usePrioriteitenResponses";
import { useLanguage } from "@/contexts/LanguageContext";

export interface WebhookData {
  user_id: string;
  language: string;
  [key: string]: string;
}

export const useWebhookData = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { responses: enthousiasmeResponses } = useEnthousiasmeResponses();
  const { responses: wensberoepenResponses } = useWensberoepenResponses();
  const { responses: extraInformatieResponses } = useExtraInformatieResponses();
  const { responses: prioriteitenResponses } = usePrioriteitenResponses();
  const [profileData, setProfileData] = useState<any>(null);

  // Load profile data (removed gender column reference)
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
        .select('first_name, last_name')
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
      language: language,
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      email: user.email || "",
    };

    // Add enthousiasme data
    if (enthousiasmeResponses) {
      Object.keys(enthousiasmeResponses).forEach(key => {
        if (key !== 'user_id' && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
          data[`enthousiasme_${key}`] = enthousiasmeResponses[key as keyof typeof enthousiasmeResponses] || "";
        }
      });
    }

    // Add wensberoepen data
    if (wensberoepenResponses) {
      Object.keys(wensberoepenResponses).forEach(key => {
        if (key !== 'user_id' && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
          data[`wensberoepen_${key}`] = wensberoepenResponses[key as keyof typeof wensberoepenResponses] || "";
        }
      });
    }

    // Add extra informatie data
    if (extraInformatieResponses) {
      Object.keys(extraInformatieResponses).forEach(key => {
        if (key !== 'user_id' && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
          data[`extra_${key}`] = extraInformatieResponses[key as keyof typeof extraInformatieResponses] || "";
        }
      });
    }

    // Add prioriteiten data
    if (prioriteitenResponses) {
      Object.keys(prioriteitenResponses).forEach(key => {
        if (key !== 'user_id' && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
          const value = prioriteitenResponses[key as keyof typeof prioriteitenResponses];
          data[`prioriteiten_${key}`] = Array.isArray(value) ? JSON.stringify(value) : (value || "");
        }
      });
    }

    return data;
  };

  return {
    collectWebhookData,
    refreshProfileData: loadProfileData
  };
};
