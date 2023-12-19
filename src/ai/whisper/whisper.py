from openai import OpenAI
from pydub import AudioSegment
import os
print(os.getcwd())
client = OpenAI(api_key="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")

audio_file = open("test_10.mp3", "rb");

transcript = client.audio.transcriptions.create(
  model="whisper-1", 
  file=audio_file, 
  response_format="text"
)

print(transcript)