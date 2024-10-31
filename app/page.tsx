import React from 'react';
import ConversationInput from '../documentation/tesseract-ocr';
import { VoiceTranscription } from '../documentation/whisper-transcription';
import RelationshipAnalysis from '@/documentation/ai-analysis';

export default function Home() {
  return (
    <div className="App">
      <ConversationInput />
      <VoiceTranscription />
      <RelationshipAnalysis />
    </div>
  );
}