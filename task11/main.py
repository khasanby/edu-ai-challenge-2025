#!/usr/bin/env python3
"""
Audio Transcription and Summarization - Task 11 EDU AI Challenge
A Python console app that transcribes audio, summarizes content, and extracts analytics.
"""

import os
import sys
import argparse
from datetime import datetime
from pathlib import Path

# Add src to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from openai_client import OpenAIClient
from functions import get_summary_function_schema, format_summary_as_markdown, format_analytics_as_json

def validate_audio_file(file_path: str) -> bool:
    """Validate that the audio file exists and has a supported format."""
    if not os.path.exists(file_path):
        print(f"❌ Error: File '{file_path}' does not exist.")
        return False
    
    supported_formats = ['.wav', '.mp3']
    file_ext = Path(file_path).suffix.lower()
    
    if file_ext not in supported_formats:
        print(f"❌ Error: Unsupported audio format '{file_ext}'. Supported formats: {', '.join(supported_formats)}")
        return False
    
    return True

def save_transcription(transcript: str, audio_file: str):
    """Save the transcription to a separate file."""
    # Create outputs directory if it doesn't exist
    outputs_dir = Path("outputs")
    outputs_dir.mkdir(exist_ok=True)
    
    # Generate filename
    audio_name = Path(audio_file).stem
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{audio_name}_transcription_{timestamp}.md"
    
    output_path = outputs_dir / filename
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f"# Transcription\n\n")
            f.write(f"**Audio File:** {audio_file}\n")
            f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"## Content\n\n{transcript}\n")
        print(f"💾 Transcription saved to: {output_path}")
        return str(output_path)
    except Exception as e:
        print(f"⚠️  Warning: Could not save transcription to file: {e}")
        return None

def save_outputs(summary_data: dict, audio_file: str):
    """Save the summary and analytics to files."""
    # Create outputs directory if it doesn't exist
    outputs_dir = Path("outputs")
    outputs_dir.mkdir(exist_ok=True)
    
    # Generate filename base
    audio_name = Path(audio_file).stem
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save summary as markdown
    summary_filename = f"{audio_name}_summary_{timestamp}.md"
    summary_path = outputs_dir / summary_filename
    
    try:
        with open(summary_path, 'w', encoding='utf-8') as f:
            f.write(format_summary_as_markdown(summary_data))
        print(f"💾 Summary saved to: {summary_path}")
    except Exception as e:
        print(f"⚠️  Warning: Could not save summary to file: {e}")
    
    # Save analytics as JSON
    analytics_filename = f"{audio_name}_analysis_{timestamp}.json"
    analytics_path = outputs_dir / analytics_filename
    
    try:
        with open(analytics_path, 'w', encoding='utf-8') as f:
            f.write(format_analytics_as_json(summary_data))
        print(f"💾 Analytics saved to: {analytics_path}")
    except Exception as e:
        print(f"⚠️  Warning: Could not save analytics to file: {e}")

def main():
    """Main function to handle CLI and process audio files."""
    parser = argparse.ArgumentParser(
        description="Audio Transcription and Summarization - Transcribe audio and create structured summaries with analytics",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py audios/hometown.wav
  python main.py audios/routine.mp3 --no-save
  python main.py audios/sample.wav --verbose
        """
    )
    
    parser.add_argument(
        "audio_file",
        help="Path to the audio file to process (WAV, MP3)"
    )
    
    parser.add_argument(
        "--no-save",
        action="store_true",
        help="Don't save output to files, only display to console"
    )
    
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show detailed progress information"
    )
    
    args = parser.parse_args()
    
    # Validate input file
    if not validate_audio_file(args.audio_file):
        sys.exit(1)
    
    print("🎵 Audio Transcription and Summarization - Task 11 EDU AI Challenge")
    print("=" * 60)
    print(f"📁 Processing: {args.audio_file}")
    print()
    
    try:
        # Initialize OpenAI client
        if args.verbose:
            print("🔑 Initializing OpenAI client...")
        client = OpenAIClient()
        
        # Transcribe audio
        if args.verbose:
            print("🎤 Transcribing audio with Whisper...")
        transcript = client.transcribe_audio(args.audio_file)
        
        if args.verbose:
            print(f"📄 Transcript length: {len(transcript)} characters")
            print("📄 Transcript preview:")
            print("-" * 40)
            print(transcript[:200] + "..." if len(transcript) > 200 else transcript)
            print("-" * 40)
            print()
        
        # Save transcription separately
        if not args.no_save:
            save_transcription(transcript, args.audio_file)
        
        # Get function schema
        function_schema = get_summary_function_schema()
        
        # Summarize with GPT
        if args.verbose:
            print("🧠 Creating structured summary and analytics with GPT-4...")
        summary_data = client.summarize_text(transcript, function_schema)
        
        # Display results
        print("✅ Processing complete!")
        print("=" * 60)
        
        # Display summary
        print(format_summary_as_markdown(summary_data))
        
        # Display analytics separately
        print("\n📊 Analytics (JSON):")
        print("-" * 40)
        print(format_analytics_as_json(summary_data))
        
        # Save to files if requested
        if not args.no_save:
            save_outputs(summary_data, args.audio_file)
        
        print("\n🎉 Audio processing completed successfully!")
        
    except ValueError as e:
        print(f"❌ Configuration error: {e}")
        print("💡 Make sure you have set your OPENAI_API_KEY in the .env file")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 