import os
import openai
from dotenv import load_dotenv
from typing import Dict, Any
import json

class OpenAIClient:
    def __init__(self):
        """Initialize OpenAI client with API key from environment."""
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        self.client = openai.OpenAI(api_key=api_key)
    
    def transcribe_audio(self, audio_file_path: str) -> str:
        """
        Transcribe audio file using OpenAI's Whisper model.
        
        Args:
            audio_file_path: Path to the audio file (WAV, MP3, etc.)
            
        Returns:
            Transcribed text as string
        """
        try:
            with open(audio_file_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )
            return transcript.text
        except Exception as e:
            raise Exception(f"Error transcribing audio: {str(e)}")
    
    def summarize_text(self, text: str, function_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        Summarize text using GPT-4 with function calling for structured output.
        
        Args:
            text: Text to summarize
            function_schema: OpenAI function schema for structured output
            
        Returns:
            Structured summary as dictionary
        """
        try:
            response = self.client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert audio content analyst. Your task is to:
1. Create a concise summary of the transcribed audio content
2. Calculate accurate word count from the transcript
3. Estimate speaking speed in words per minute (WPM) - typical speaking speed is 120-150 WPM
4. Identify and count frequently mentioned topics/entities (minimum 3 topics)
5. Extract key points and determine overall sentiment

Be precise with word counts and topic analysis. For speaking speed, consider the content type and estimate based on typical speaking patterns."""
                    },
                    {
                        "role": "user",
                        "content": f"Please analyze and summarize the following transcribed audio content:\n\n{text}"
                    }
                ],
                tools=[{"type": "function", "function": function_schema}],  # type: ignore
                tool_choice={"type": "function", "function": {"name": function_schema["name"]}}
            )
            
            # Extract tool call arguments
            tool_calls = response.choices[0].message.tool_calls
            if tool_calls and len(tool_calls) > 0:
                tool_call = tool_calls[0]
                if tool_call.function and tool_call.function.arguments:
                    return json.loads(tool_call.function.arguments)
            
            raise Exception("No tool call response received")
                
        except Exception as e:
            raise Exception(f"Error summarizing text: {str(e)}") 