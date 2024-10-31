# Project Overview
Arguments AI is a tool designed to help couples and partners navigate arguments and improve communication by providing data-driven insights into their conversations. Users can manually submit text, screenshots, or voice notes that describe their interactions, allowing the app to deliver conflict resolution guidance, sentiment analysis, and communication style feedback.

You will be using the following technologies:
- Next.js
- Tailwind CSS
- Shadcn UI
- Lucide Icons
- Clerk (Authentication)
- OpenAI (API)


# Core Functionalities for Situationship AI
1. Multi-Modal Venting Input
   - Text journal/diary entries
   - Screenshot analysis of texts/DMs with OCR
   - Voice note recording & transcription (Whisper API)
     * One-tap voice recording for emotional release
     * Auto-transcription for analysis
   - Quick situation templates (e.g., "He hasn't texted back in 2 days", "We had a great date but...")

2. Behavioral Pattern Analysis
   - Male psychology insights
   - Red flag detection
   - Attachment style identification
   - Dating pattern recognition
   - Mixed signals interpretation

3. Empathetic Response Framework
   - Three support modes:
     * Emotional Support: Validation and understanding
     * Strategic Advice: Action-oriented guidance
     * Reality Check: Honest, friend-like perspective
   - Personalized advice based on:
     * Relationship stage (talking, dating, situationship, etc.)
     * User's attachment style
     * Man's demonstrated behavior patterns
     * Relationship history

4. Situation-Specific Analysis Dashboard
   - Communication style assessment
   - Investment level analysis (both parties)
   - Future potential evaluation
   - Risk assessment (emotional investment vs. shown commitment)
   - Dating timeline tracking

5. Action Guidance
   - **Response suggestions for common scenarios:**
     - Text message drafting
     - Setting boundaries
     - Having "the talk"
     - Walking away gracefully
   - **"What to do next" recommendations**
   - **Self-care reminders and activities**
   - **Boundary setting templates**
   - **Communication Suggestions**
     - How to effectively communicate your feelings
     - Strategies for healthy dialogue

6. Personal Growth Tools
   - Dating journal with mood tracking
   - Pattern recognition in your dating history
   - Self-worth reinforcement
   - Attachment style insights
   - Personal boundaries workshop
   - Values alignment check

7. Smart Features
   - "Should I text him?" decision helper
   - "What does this mean?" message analyzer
   - "Is this a red flag?" assessment
   - "Am I overthinking?" reality check
   - "What's his perspective?" insight generator

8. Analysis Metrics
   - Emotional investment score
   - Reciprocity measurement
   - Communication health index
   - Red flag count
   - Green flag identification
   - Compatibility indicators

9. User Flow
   1. User inputs situation (text/voice/screenshots)
   2. AI analyzes context and patterns
   3. User selects support mode needed
   4. System provides personalized insights and advice
   5. User gets actionable next steps
   6. Follow-up prompts for updates and journaling



# AI Packages
### 1. **Optical Character Recognition (OCR)**
   - **[Tesseract.js](https://github.com/naptha/tesseract.js)**: Works well for extracting text from screenshots.

### 2. **Natural Language Processing & Sentiment Analysis**
   - **[OpenAI API (GPT-4, etc.)](https://platform.openai.com/docs/)**: Ideal for sentiment analysis, communication style assessment, and generating constructive suggestions.


### 3. **Voice-to-Text Transcription**
   - **[OpenAI Whisper](https://github.com/openai/whisper)**: Offers accurate voice-to-text conversion, which can be integrated server-side for privacy and better performance on larger devices.

### 4. **Pattern Recognition & Topic Analysis**
   - **[TensorFlow.js](https://www.tensorflow.org/js)**: Enables custom deep learning models for client-side usage, which can handle unique tasks like relationship pattern recognition.
   - **[Node-RED for NLP](https://flows.nodered.org/)**: Useful for chaining and orchestrating various ML/NLP pipelines, including pattern recognition workflows across multiple libraries.

### 5. **Data Visualization & Insights**
   - **[D3.js](https://d3js.org/)**: For interactive, visual insights into argument patterns over time.
   - **[Chart.js](https://www.chartjs.org/)**: Lightweight and ideal for displaying data such as mood tracking or sentiment analysis in charts and graphs.


# Documentation
- Documentation of how to use Tesseract.js for extracting the text from screenshots
- Documentation of how to use the Relationship Analysis feature
  - **Input:** User-provided text describing relationship situations.
  - **Output:** AI-generated analysis including behavioral patterns, empathetic responses, and action guidance.

## Code Sample for Tesseract.js and Screenshot Analysis: OCR (Optical Character Recognition) technology extracts text from screenshots of conversations.


# File Structure
Arguments AI
├── README.md
├── app
│   ├── api
│   ├── favicon.ico
│   ├── fonts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
├── components.json
├── documentation
│   ├── ai-analysis.tsx
│   ├── api-analyze.ts
│   ├── api-transcribe.ts
│   ├── instructions.md
│   ├── tesseract-ocr.tsx
│   └── whisper-transcription.tsx
├── lib
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── tailwind.config.ts
└── tsconfig.json