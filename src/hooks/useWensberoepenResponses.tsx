
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import type { Tables } from "@/integrations/supabase/types";

type WensberoepenResponse = Tables<"wensberoepen_responses">;

export const useWensberoepenResponses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<WensberoepenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing responses on mount
  useEffect(() => {
    if (user) {
      loadResponses();
    }
  }, [user]);

  const loadResponses = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("wensberoepen_responses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading wensberoepen responses:", error);
        toast({
          title: "Fout bij laden",
          description: "Er ging iets mis bij het laden van je antwoorden.",
          variant: "destructive",
        });
        return;
      }

      setResponses(data);
    } catch (error) {
      console.error("Error loading wensberoepen responses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveResponse = async (field: keyof WensberoepenResponse, value: string) => {
    if (!user) return;

    try {
      setIsSaving(true);
      
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
          title: "Fout bij opslaan",
          description: "Er ging iets mis bij het opslaan van je antwoord.",
          variant: "destructive",
        });
        return;
      }

      setResponses(data);
      console.log(`Saved ${field}:`, value);
    } catch (error) {
      console.error("Error saving wensberoepen response:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFieldValue = (field: keyof WensberoepenResponse): string => {
    return responses?.[field] as string || "";
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
