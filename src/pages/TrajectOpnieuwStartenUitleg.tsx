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

      // Get user profile data for webhook
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, language')
        .eq('id', user.id)
        .single();

      // Send webhook data for second journey payment
      const webhookUrl = 'https://hook.eu2.make.com/awyjkik7t2we4k6efpq8t844dyl3h11e';
      const webhookData = {
        firstName: profileData?.first_name || user.user_metadata?.first_name || '',
        lastName: profileData?.last_name || user.user_metadata?.last_name || '',
        email: user.email || '',
        userId: user.id,
        language: profileData?.language || language || 'nl'
      };

      console.log('Sending webhook data for second journey:', webhookData);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });

      console.log('Webhook response status:', response.status);
      
      if (response.ok) {
        console.log('Webhook successfully sent');
        let responseData;
        try {
          responseData = await response.json();
          console.log('Webhook response data:', responseData);
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          throw new Error('Invalid JSON response from webhook');
        }

        if (responseData && responseData.checkout_url) {
          console.log('Opening checkout URL in new tab:', responseData.checkout_url);
          const newWindow = window.open(responseData.checkout_url, '_blank');
          if (newWindow) {
            toast({
              title: t('common.success'),
              description: t('journey.restart_explanation.checkout_opened'),
            });
          } else {
            console.log('Popup blocked, using direct redirect');
            window.location.href = responseData.checkout_url;
          }
        } else {
          console.error('No checkout_url in response:', responseData);
          toast({
            title: t('common.error'),
            description: t('journey.restart_explanation.errors.no_checkout_url'),
            variant: 'destructive'
          });
        }
      } else {
        console.error('Webhook failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        toast({
          title: t('common.error'),
          description: t('journey.restart_explanation.errors.webhook_failed'),
          variant: 'destructive'
        });
      }
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img
                src="/vinster-logo.png"
                alt="Vinster"
                className="h-16 cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => navigate('/home')}
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t('journey.restart_explanation.title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('journey.restart_explanation.subtitle')}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="space-y-8">
            {/* Warning Card */}
            <Card className="border-orange-200/60 bg-gradient-to-r from-orange-50/80 to-orange-100/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <div className="p-2 rounded-full bg-orange-100">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <span className="text-xl">
                    {t('journey.restart_explanation.warning_card.title')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-orange-700">
                <p className="mb-4 text-base leading-relaxed">
                  {t('journey.restart_explanation.warning_card.description')}
                </p>
                <ul className="space-y-3">
                  {t('journey.restart_explanation.warning_card.points').map((point: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                      <span>
                        {point.includes('€29') || point.includes('333 kroner') 
                          ? point.replace(/€29|333 kroner/, t('journey.restart_explanation.price'))
                          : point
                        }
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Process Steps */}
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 rounded-full bg-primary/10">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  {t('journey.restart_explanation.process_card.title')}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {t('journey.restart_explanation.process_card.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {t('journey.restart_explanation.process_card.steps').map((step: any, index: number) => (
                    <div key={index} className="flex gap-4 group">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-lg flex items-center gap-3 group-hover:text-primary transition-colors">
                          {index === 0 && <CreditCard className="h-5 w-5" />}
                          {index === 1 && <FileX className="h-5 w-5" />}
                          {index === 2 && <RefreshCw className="h-5 w-5" />}
                          {step.title}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                variant="outline"
                onClick={() => navigate('/home')}
                disabled={isLoading}
                className="min-w-[200px] h-12 text-base border-2 hover:bg-muted/50 transition-all duration-200"
              >
                {t('journey.restart_explanation.buttons.back')}
              </Button>
              <Button
                onClick={handleStartReset}
                disabled={isLoading}
                className="min-w-[240px] h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {t('journey.restart_explanation.buttons.loading')}
                  </div>
                ) : (
                  t('journey.restart_explanation.buttons.confirm')
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrajectOpnieuwStartenUitleg;