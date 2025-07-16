import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, CreditCard, FileX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const TrajectOpnieuwStartenUitleg = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartReset = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Create a journey reset record
      const { error } = await supabase
        .from('journey_resets')
        .insert({
          user_id: user.id,
          webhook_processed: false,
          reset_completed: false
        });

      if (error) {
        console.error('Error creating journey reset:', error);
        toast({
          title: t('common.error'),
          description: 'Er ging iets mis bij het starten van het reset proces.',
          variant: 'destructive'
        });
        return;
      }

      // Redirect to Make webhook with user data
      const webhookUrl = 'https://hook.eu2.make.com/';
      const params = new URLSearchParams({
        email: user.email || '',
        user_id: user.id,
        first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || ''
      });

      window.location.href = `${webhookUrl}?${params}`;
    } catch (error) {
      console.error('Error starting reset process:', error);
      toast({
        title: t('common.error'),
        description: 'Er ging iets mis bij het starten van het reset proces.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/vinster-logo.png"
                alt="Vinster"
                className="h-12 cursor-pointer"
                onClick={() => navigate('/')}
              />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Traject opnieuw starten
            </h1>
            <p className="text-muted-foreground">
              Wil je het Vinster traject nog een keer doorlopen? Hier lees je hoe dat werkt.
            </p>
          </div>

          {/* Warning Card */}
          <Card className="mb-6 border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Belangrijk om te weten
              </CardTitle>
            </CardHeader>
            <CardContent className="text-orange-700">
              <p className="mb-2">
                Wanneer je het traject opnieuw start, gebeurt het volgende:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Al je huidige antwoorden worden permanent gewist</li>
                <li>Je huidige rapport wordt verwijderd</li>
                <li>Je zoekprofiel wordt verwijderd</li>
                <li>Je betaalt opnieuw €29 voor een nieuw traject</li>
                <li>Je begint volledig opnieuw bij de eerste stap</li>
              </ul>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Hoe werkt het proces?
              </CardTitle>
              <CardDescription>
                Het reset proces gebeurt in deze stappen:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Betaling
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Je wordt doorgestuurd naar de betaalpagina om €29 te betalen voor het nieuwe traject.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <FileX className="h-4 w-4" />
                      Data wissen
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Na succesvolle betaling worden al je oude antwoorden automatisch gewist.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Opnieuw beginnen
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Je kunt het traject opnieuw starten vanaf het begin met verse inzichten.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              Terug naar dashboard
            </Button>
            <Button
              onClick={handleStartReset}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Bezig...' : 'Ja, ik wil opnieuw starten'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrajectOpnieuwStartenUitleg;