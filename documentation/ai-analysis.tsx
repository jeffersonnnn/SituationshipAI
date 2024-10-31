"use client";

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import AIResponse from './ai-response';

interface AnalysisResponse {
  behavioralPatterns: {
    maleInsights: string;
    redFlags: string[];
    attachmentStyle: string;
    datingPatterns: string[];
    mixedSignals: string[];
  };
  emphatheticResponse: {
    emotionalSupport: string;
    strategicAdvice: string;
    realityCheck: string;
  };
  actionGuidance: {
    nextSteps: string[];
    boundaries: string[];
    communicationSuggestions: string[];
  };
}

export default function RelationshipAnalysis() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/analyze', { text });
      setAnalysis(response.data);
    } catch (err) {
      setError('Failed to analyze the text. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Relationship Situation Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your situation..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px]"
          />
          <Button 
            onClick={analyzeText}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Situation'
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Behavioral Patterns</h3>
                <div className="space-y-2">
                  <p><strong>Male Psychology:</strong> {analysis.behavioralPatterns.maleInsights}</p>
                  <div>
                    <strong>Red Flags:</strong>
                    <ul className="list-disc pl-5">
                      {analysis.behavioralPatterns.redFlags.map((flag, i) => (
                        <li key={i}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Attachment Style:</strong> {analysis.behavioralPatterns.attachmentStyle}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Empathetic Response</h3>
                <div className="space-y-2">
                  <p><strong>Emotional Support:</strong> {analysis.emphatheticResponse.emotionalSupport}</p>
                  <p><strong>Strategic Advice:</strong> {analysis.emphatheticResponse.strategicAdvice}</p>
                  <p><strong>Reality Check:</strong> {analysis.emphatheticResponse.realityCheck}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Action Guidance</h3>
                <div className="space-y-2">
                  <div>
                    <strong>Next Steps:</strong>
                    <ul className="list-disc pl-5">
                      {analysis.actionGuidance.nextSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Boundaries to Set:</strong>
                    <ul className="list-disc pl-5">
                      {analysis.actionGuidance.boundaries.map((boundary, i) => (
                        <li key={i}>{boundary}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Communication Suggestions:</strong>
                    <ul className="list-disc pl-5">
                      {analysis.actionGuidance.communicationSuggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <AIResponse situationText={text} />
        </>
      )}
    </div>
  );
} 