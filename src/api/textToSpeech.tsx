'use server'

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const ELEVEN_LABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

const ELEVEN_LABS_VOICE_ID = "TX3LPaxmHKxFdv7VOQHJ";//Xb7hH8MSUJpSbSDYk0k2, pFZP5JQG7iQjIQuC4Bku, TX3LPaxmHKxFdv7VOQHJ

const elevenLabs = new ElevenLabsClient({
  apiKey: ELEVEN_LABS_API_KEY
});

class TextToSpeech {
  constructor() {}

  async generateAudio(text: string, lang: string) {
    const audio = await elevenLabs.textToSpeech.convert(ELEVEN_LABS_VOICE_ID, {
        text: text,
        modelId: "eleven_multilingual_v2",
    });

    return audio;
  }

  async generateAudioAPI(text: string, lang: string) {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`, {//pcm_44100, pcm_24000, pcm_16000
      method: 'POST',
      body: JSON.stringify({
        text: text,
        language_code: lang
      }),
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY || "",
        'Content-Type': 'application/json'
      }
    });
    const audioData = await (await response.blob()).arrayBuffer();
    console.log(audioData);
    return audioData;
  }
}

export default TextToSpeech;