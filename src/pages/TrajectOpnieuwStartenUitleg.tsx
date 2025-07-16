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
  const { t, language } = useTranslation();
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
          description: t('journey.restart_explanation.errors.general'),
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
        description: t('journey.restart_explanation.errors.general'),
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
              {t('journey.restart_explanation.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('journey.restart_explanation.subtitle')}
            </p>
          </div>

          {/* Warning Card */}
          <Card className="mb-6 border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                {t('journey.restart_explanation.warning_card.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-orange-700">
              <p className="mb-2">
                {t('journey.restart_explanation.warning_card.description')}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {t('journey.restart_explanation.warning_card.points').map((point: string, index: number) => (
                  <li key={index}>
                    {point.includes('€29') || point.includes('333 kroner') 
                      ? point.replace(/€29|333 kroner/, t('journey.restart_explanation.price'))
                      : point
                    }
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                {t('journey.restart_explanation.process_card.title')}
              </CardTitle>
              <CardDescription>
                {t('journey.restart_explanation.process_card.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {t('journey.restart_explanation.process_card.steps').map((step: any, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {index === 0 && <CreditCard className="h-4 w-4" />}
                        {index === 1 && <FileX className="h-4 w-4" />}
                        {index === 2 && <RefreshCw className="h-4 w-4" />}
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description.includes('€29') || step.description.includes('333 kroner')
                          ? step.description.replace(/€29|333 kroner/, t('journey.restart_explanation.price'))
                          : step.description
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/home')}
              disabled={isLoading}
            >
              {t('journey.restart_explanation.buttons.back')}
            </Button>
            <Button
              onClick={handleStartReset}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? t('journey.restart_explanation.buttons.loading') : t('journey.restart_explanation.buttons.confirm')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrajectOpnieuwStartenUitleg;