"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AIResponseProps {
  situationText: string;
}

type SupportMode = 'emotional' | 'strategic' | 'reality';

interface ResponseData {
  response: string;
  suggestions: string[];
  nextSteps: string[];
}

export default function AIResponse({ situationText }: AIResponseProps) {
  const [supportMode, setSupportMode] = useState<SupportMode>('emotional');
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getResponse = async () => {
    if (!situationText.trim()) {
      setError('No situation text provided');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/get-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: situationText,
          mode: supportMode,
        }),
      });

      if (!res.ok) throw new Error('Failed to get response');
      
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError('Failed to get AI response. Please try again.');
      console.error('Response error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Choose Your Support Mode</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={supportMode}
          onValueChange={(value) => setSupportMode(value as SupportMode)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="emotional" id="emotional" />
            <Label htmlFor="emotional">
              Emotional Support
              <p className="text-sm text-muted-foreground">
                Get validation and understanding for your feelings
              </p>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="strategic" id="strategic" />
            <Label htmlFor="strategic">
              Strategic Advice
              <p className="text-sm text-muted-foreground">
                Receive action-oriented guidance and practical steps
              </p>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="reality" id="reality" />
            <Label htmlFor="reality">
              Reality Check
              <p className="text-sm text-muted-foreground">
                Get an honest, friend-like perspective on the situation
              </p>
            </Label>
          </div>
        </RadioGroup>

        <Button 
          onClick={getResponse}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Response...
            </>
          ) : (
            'Get Guidance'
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && (
          <div className="space-y-4">
            <div className="prose">
              <h3 className="text-lg font-semibold">Response</h3>
              <p className="text-gray-700">{response.response}</p>
            </div>

            {response.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Suggestions</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {response.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {response.nextSteps.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Next Steps</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {response.nextSteps.map((step, i) => (
                    <li key={i} className="text-gray-700">{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 