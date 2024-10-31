"use client"; // <— Add this line

import React, { useState, ChangeEvent } from 'react';
import { Upload, FileText, Loader2, Copy, PlusCircle, X, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AIAnalysis from './ai-analysis';

interface Snippet {
  id: number;
  content: string;
}

const ConversationInput = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [manualText, setManualText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSnippets, setActiveSnippets] = useState<Snippet[]>([]);
  const [currentTab, setCurrentTab] = useState<'manual' | 'image'>('manual');

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        } else {
          setImageUrl('');
          console.error('Unexpected result type from FileReader.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const extractText = async () => {
    try {
      setIsLoading(true);
      const Tesseract = await import('tesseract.js');
      const result = await Tesseract.recognize(
        imageUrl,
        'eng',
        {
          logger: m => console.log(m)
        }
      );
      setExtractedText(result.data.text);
      addSnippet(result.data.text);
    } catch (error) {
      console.error('Error extracting text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData?.getData('text');
    if (pastedText) {
      e.preventDefault();
      addSnippet(pastedText);
    }
  };

  const addSnippet = (text: string) => {
    if (text.trim()) {
      setActiveSnippets(prev => [
        ...prev,
        {
          id: Date.now(),
          content: text.trim(),
        },
      ]);
    }
  };

  const removeSnippet = (id) => {
    setActiveSnippets(prev => prev.filter(snippet => snippet.id !== id));
  };

  const addManualText = () => {
    if (manualText.trim()) {
      addSnippet(manualText);
      setManualText('');
    }
  };

  const getCombinedText = () => {
    return activeSnippets.map(snippet => snippet.content).join('\n\n');
  };

  const handleManualTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setManualText(e.target.value);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Add Your Conversation</CardTitle>
          <CardDescription>
            Share the conversation or argument you'd like help with. You can type directly, paste text, or extract from screenshots.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">
                <FileText className="w-4 h-4 mr-2" />
                Write or Paste Text
              </TabsTrigger>
              <TabsTrigger value="image">
                <ImageIcon className="w-4 h-4 mr-2" />
                Image OCR
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <div className="grid gap-4">
                <Textarea
                  placeholder="Share what happened in your conversation...
Example:
- What was said
- How it started
- Key points of disagreement
- Your perspective"
                  value={manualText}
                  onChange={handleManualTextChange}
                  onPaste={handlePaste}
                  className="min-h-48"
                />
                <Button 
                  onClick={addManualText}
                  disabled={!manualText.trim()}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add to Analysis
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Click or drag and drop to upload an image
                  </p>
                </div>

                {imageUrl && (
                  <>
                    <img 
                      src={imageUrl} 
                      alt="Uploaded image" 
                      className="max-h-64 object-contain rounded-lg"
                    />
                    
                    <Button
                      onClick={extractText}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Extracting text...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Extract Text
                        </>
                      )}
                    </Button>
                  </>
                )}

                {extractedText && (
                  <Textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="min-h-32"
                    placeholder="Extracted text will appear here..."
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>

          {activeSnippets.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Conversation Segments</h3>
              <div className="space-y-2">
                {activeSnippets.map((snippet) => (
                  <Alert key={snippet.id}>
                    <AlertDescription className="flex justify-between items-start gap-2">
                      <div className="whitespace-pre-wrap flex-1">
                        {snippet.content}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSnippet(snippet.id)}
                        className="h-6 w-6 p-0 hover:bg-destructive/90 hover:text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={() => navigator.clipboard.writeText(getCombinedText())}
              disabled={activeSnippets.length === 0}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy All
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeSnippets.length > 0 && (
        <AIAnalysis conversationText={getCombinedText()} />
      )}
    </div>
  );
};

export default ConversationInput;