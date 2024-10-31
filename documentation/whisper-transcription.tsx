"use client"; // <— Add this line

import { useState } from 'react';
import axios from 'axios';
import { Mic, Loader2, FileAudio, Square } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { AlertDescription } from "@/components/ui/alert";

interface TranscriptionResponse {
  text: string; 
  error?: string;
}

interface VoiceTranscriptionProps {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
}

export const useVoiceTranscription = ({
  onTranscriptionComplete,
  onError,
}: VoiceTranscriptionProps) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string>('');

  const transcribeAudio = async (audioFile: File): Promise<TranscriptionResponse> => {
    if (!audioFile) {
      return { text: '', error: 'No audio file provided' };
    }

    const fileName = `audio-${Date.now()}.mp3`;
    
    const formData = new FormData();
    formData.append('file', audioFile, fileName);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');
    formData.append('language', 'en');
    formData.append('temperature', '0.1');

    try {
      setIsTranscribing(true);

      const convertedFormData = await convertAudioIfNeeded(formData);

      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        convertedFormData,
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const transcribedText = response.data.text;
      setTranscribedText(transcribedText);
      onTranscriptionComplete?.(transcribedText);

      return { text: transcribedText };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to transcribe audio';
      onError?.(errorMessage);
      return { text: '', error: errorMessage };
    } finally {
      setIsTranscribing(false);
    }
  };

  const convertAudioIfNeeded = async (formData: FormData): Promise<FormData> => {
    const file = formData.get('file') as File;
    
    const supportedFormats = ['mp3', 'm4a', 'wav', 'mp4', 'mpeg', 'mpga', 'webm', 'ogg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !supportedFormats.includes(fileExtension)) {
      const audioData = new FormData();
      audioData.append('audio', file);
      
      const response = await axios.post('/api/convert-audio', audioData, {
        responseType: 'blob',
      });

      const convertedFile = new File([response.data], `converted-${Date.now()}.mp3`, {
        type: 'audio/mp3',
      });

      const newFormData = new FormData();
      newFormData.append('file', convertedFile);
      newFormData.append('model', formData.get('model') as string);
      newFormData.append('response_format', formData.get('response_format') as string);
      newFormData.append('language', formData.get('language') as string);
      newFormData.append('temperature', formData.get('temperature') as string);

      return newFormData;
    }

    return formData;
  };

  return {
    transcribeAudio,
    isTranscribing,
    transcribedText,
  };
};

export const VoiceTranscription: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  const {
    transcribeAudio,
    isTranscribing,
    transcribedText,
  } = useVoiceTranscription({
    onTranscriptionComplete: (text) => {
      setError('');
    },
    onError: (error) => {
      setError(error);
    },
  });

  // Handler to start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);

      recorder.start();
      setIsRecording(true);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.mp3`, {
          type: 'audio/mp3',
        });
        await transcribeAudio(audioFile);
        setIsRecording(false);
      };
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access denied or not available.');
    }
  };

  // Handler to stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await transcribeAudio(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Note Transcription</CardTitle>
        <CardDescription>
          Upload a voice note or record directly to transcribe it into text
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-4">
          {/* Existing Upload Button */}
          <div>
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              disabled={isTranscribing}
              className="hidden"
              id="voice-upload"
            />
            <label htmlFor="voice-upload">
              <Button 
                variant="outline" 
                disabled={isTranscribing}
                className="cursor-pointer"
                asChild
              >
                <span>
                  {isTranscribing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    <>
                      <FileAudio className="mr-2 h-4 w-4" />
                      Upload Voice Note
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>

          {/* New Recording Button */}
          <div>
            {!isRecording ? (
              <Button 
                variant="outline" 
                onClick={startRecording}
                className="cursor-pointer"
                disabled={isTranscribing}
              >
                <Mic className="mr-2 h-4 w-4" />
                {isTranscribing ? 'Transcribing...' : 'Record Voice'}
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={stopRecording}
                className="cursor-pointer"
                disabled={isTranscribing}
              >
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {transcribedText && (
          <div className="space-y-2">
            <h3 className="font-medium">Transcription Result:</h3>
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm whitespace-pre-wrap">{transcribedText}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};