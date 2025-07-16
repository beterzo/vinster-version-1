
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import type { Tables } from "@/integrations/supabase/types";

type WensberoepenResponse = Tables<"wensberoepen_responses">;

export const useWensberoepenResponses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [responses, setResponses] = useState<WensberoepenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Stable getFieldValue function using useCallback
  const getFieldValue = useCallback((field: keyof WensberoepenResponse): string => {
    return responses?.[field] as string || "";
  }, [responses]);

  // Load existing responses on mount
  useEffect(() => {
    if (user) {
      loadResponses();
    }
  }, [user?.id]); // Only depend on user.id to prevent unnecessary re-loads

  const loadResponses = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log("Loading wensberoepen responses for user:", user.id);
      
      const { data, error } = await supabase
        .from("wensberoepen_responses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading wensberoepen responses:", error);
        toast({
          title: t('common.toast.load_error'),
          description: t('common.toast.load_error_description'),
          variant: "destructive",
        });
        return;
      }

      console.log("Loaded wensberoepen responses:", data);
      setResponses(data);
    } catch (error) {
      console.error("Error loading wensberoepen responses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveResponse = async (field: keyof WensberoepenResponse, value: string) => {
    if (!user) {
      console.error("No user found for saving response");
      return;
    }

    try {
      setIsSaving(true);
      console.log(`Saving ${field}:`, value);
      
      const updateData = {
        [field]: value,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("wensberoepen_responses")
        .upsert(updateData, { 
          onConflict: "user_id",
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving wensberoepen response:", error);
        toast({
          title: t('common.toast.save_error'),
          description: t('common.toast.save_error_description'),
          variant: "destructive",
        });
        return;
      }

      console.log(`Successfully saved ${field}:`, data);
      setResponses(data);
    } catch (error) {
      console.error("Error saving wensberoepen response:", error);
      toast({
        title: t('common.toast.save_error'),
        description: t('common.toast.save_error_description'),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    responses,
    isLoading,
    isSaving,
    saveResponse,
    getFieldValue,
    loadResponses,
  };
};
