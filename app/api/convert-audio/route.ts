import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import { nanoid } from 'nanoid';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    // Validate the audio file
    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json({ error: 'Invalid or missing audio file.' }, { status: 400 });
    }
    
    // Generate unique file names using nanoid for better security
    const uniqueId = nanoid();
    const tempDir = os.tmpdir(); // Use platform-independent temp directory
    const inputExtension = audioFile.name.split('.').pop() || 'tmp';
    const inputPath = path.join(tempDir, `input-${uniqueId}.${inputExtension}`);
    const outputPath = path.join(tempDir, `output-${uniqueId}.mp3`);
    
    // Write input file
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    fs.writeFileSync(inputPath, buffer);
    
    // Check if ffmpeg is installed
    try {
      await execAsync('ffmpeg -version');
    } catch {
      throw new Error('ffmpeg is not installed on the server.');
    }
    
    // Convert to MP3 using ffmpeg with sanitized paths
    await execAsync(`ffmpeg -i "${inputPath}" -acodec libmp3lame "${outputPath}"`);
    
    // Read the converted file
    const convertedBuffer = fs.readFileSync(outputPath);
    
    // Cleanup temporary files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
    
    return new NextResponse(convertedBuffer, {
      headers: {
        'Content-Type': 'audio/mp3',
      },
    });
  } catch (error: any) {
    console.error('Error converting audio:', error.message);
    return NextResponse.json({ error: error.message || 'Failed to convert audio.' }, { status: 500 });
  }
} 