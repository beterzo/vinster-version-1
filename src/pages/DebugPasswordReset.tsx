
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const DebugPasswordReset = () => {
  const [testUrl, setTestUrl] = useState('');
  const { toast } = useToast();

  const analyzeUrl = () => {
    if (!testUrl) {
      toast({
        title: 'No URL provided',
        description: 'Please enter a URL to analyze',
        variant: 'destructive'
      });
      return;
    }

    try {
      const url = new URL(testUrl);
      const searchParams = new URLSearchParams(url.search);
      const hashParams = new URLSearchParams(url.hash.substring(1));

      const analysis = {
        fullUrl: testUrl,
        origin: url.origin,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        searchParams: Object.fromEntries(searchParams.entries()),
        hashParams: Object.fromEntries(hashParams.entries()),
        hasTokens: !!(hashParams.get('access_token') && hashParams.get('refresh_token')),
        hasTypeRecovery: hashParams.get('type') === 'recovery' || searchParams.get('type') === 'recovery',
        hasRecoveryParam: searchParams.get('recovery') === 'true'
      };

      console.log('🔍 URL Analysis:', analysis);
      
      toast({
        title: 'URL Analysis Complete',
        description: 'Check console for detailed analysis'
      });

    } catch (error) {
      console.error('Error analyzing URL:', error);
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
        variant: 'destructive'
      });
    }
  };

  const testDirectNavigation = () => {
    if (!testUrl) return;
    
    console.log('🧪 Testing direct navigation to:', testUrl);
    window.location.href = testUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Password Reset Debug Tool</CardTitle>
            <CardDescription>
              Test and analyze password reset URLs to debug the redirect issue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Password Reset URL from Email:
              </label>
              <Input
                type="url"
                placeholder="Paste the URL from the password reset email here..."
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="mb-2"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={analyzeUrl} variant="outline">
                Analyze URL
              </Button>
              <Button onClick={testDirectNavigation}>
                Test Direct Navigation
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Go to /forgot-password and request a password reset</li>
                <li>2. Check your email for the reset link</li>
                <li>3. Copy the FULL URL from the email and paste it above</li>
                <li>4. Click "Analyze URL" to see what parameters are present</li>
                <li>5. Click "Test Direct Navigation" to see where it redirects</li>
                <li>6. Check browser console for detailed logs</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Environment Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Current Origin:</strong><br />
                {window.location.origin}
              </div>
              <div>
                <strong>Current URL:</strong><br />
                {window.location.href}
              </div>
              <div>
                <strong>User Agent:</strong><br />
                {navigator.userAgent.substring(0, 50)}...
              </div>
              <div>
                <strong>Time:</strong><br />
                {new Date().toISOString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebugPasswordReset;
