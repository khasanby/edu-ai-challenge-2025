#!/usr/bin/env python3
"""
Test Application for Audio Transcription and Summarization
Demonstrates functionality and provides sample outputs.
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime

# Add src to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from openai_client import OpenAIClient
from functions import get_summary_function_schema, format_summary_as_markdown, format_analytics_as_json

def test_without_api():
    """Test the application structure without making API calls."""
    print("🧪 Testing Audio Transcription and Summarization Application Structure")
    print("=" * 70)
    
    # Test 1: Check if required files exist
    print("📁 Checking project structure...")
    required_files = [
        "main.py",
        "src/openai_client.py", 
        "src/functions.py",
        "requirements.txt",
        "README.md",
        "sample_outputs.md"
    ]
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - Missing!")
    
    # Test 2: Test function schema
    print("\n🔧 Testing function schema...")
    try:
        schema = get_summary_function_schema()
        print(f"✅ Function schema created successfully")
        print(f"   - Name: {schema['name']}")
        print(f"   - Required fields: {len(schema['parameters']['required'])}")
        required_fields = schema['parameters']['required']
        print(f"   - Fields: {', '.join(required_fields)}")
    except Exception as e:
        print(f"❌ Function schema error: {e}")
    
    # Test 3: Test formatting functions
    print("\n📝 Testing formatting functions...")
    sample_data = {
        "summary": "This is a test summary of audio content.",
        "word_count": 150,
        "speaking_speed_wpm": 125,
        "frequently_mentioned_topics": [
            {"topic": "test topic 1", "mentions": 3},
            {"topic": "test topic 2", "mentions": 2}
        ],
        "key_points": ["Point 1", "Point 2", "Point 3"],
        "sentiment": "positive"
    }
    
    try:
        markdown_output = format_summary_as_markdown(sample_data)
        print(f"✅ Markdown formatting: {len(markdown_output)} characters")
        
        analytics_output = format_analytics_as_json(sample_data)
        print(f"✅ Analytics JSON formatting: {len(analytics_output)} characters")
    except Exception as e:
        print(f"❌ Formatting error: {e}")
    
    # Test 4: Check audio files
    print("\n🎵 Checking audio files...")
    audios_dir = Path("audios")
    if audios_dir.exists():
        audio_files = list(audios_dir.glob("*"))
        if audio_files:
            for audio_file in audio_files:
                print(f"✅ {audio_file}")
        else:
            print("⚠️  No audio files found in audios/ directory")
    else:
        print("❌ audios/ directory not found")
    
    # Test 5: Check outputs directory
    print("\n📂 Checking outputs directory...")
    outputs_dir = Path("outputs")
    if outputs_dir.exists():
        print("✅ outputs/ directory exists")
    else:
        print("⚠️  outputs/ directory not found (will be created automatically)")
    
    print("\n" + "=" * 70)
    print("🎉 Structure test completed!")

def test_with_api():
    """Test the application with actual API calls (requires API key)."""
    print("🚀 Testing Audio Transcription and Summarization with OpenAI API")
    print("=" * 70)
    
    # Check for API key
    if not os.path.exists(".env"):
        print("❌ .env file not found!")
        print("💡 Please create a .env file with your OPENAI_API_KEY")
        return
    
    try:
        # Initialize client
        print("🔑 Initializing OpenAI client...")
        client = OpenAIClient()
        print("✅ OpenAI client initialized successfully")
        
        # Test with all audio files
        audios_dir = Path("audios")
        if not audios_dir.exists():
            print("❌ No audios directory found")
            return
        
        audio_files = list(audios_dir.glob("*"))
        if not audio_files:
            print("❌ No audio files found for testing")
            return
        
        print(f"\n🎵 Found {len(audio_files)} audio file(s) to process:")
        for audio_file in audio_files:
            print(f"   - {audio_file}")
        
        # Process each audio file
        for i, audio_file in enumerate(audio_files, 1):
            print(f"\n{'='*70}")
            print(f"🎤 Processing {i}/{len(audio_files)}: {audio_file}")
            print(f"{'='*70}")
            
            try:
                # Transcribe
                print("📝 Transcribing audio...")
                transcript = client.transcribe_audio(str(audio_file))
                print(f"✅ Transcription complete: {len(transcript)} characters")
                
                # Save transcription
                outputs_dir = Path("outputs")
                outputs_dir.mkdir(exist_ok=True)
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                
                transcription_file = outputs_dir / f"{audio_file.stem}_transcription_{timestamp}.md"
                with open(transcription_file, 'w', encoding='utf-8') as f:
                    f.write(f"# Transcription\n\n")
                    f.write(f"**Audio File:** {audio_file}\n")
                    f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                    f.write(f"## Content\n\n{transcript}\n")
                
                # Get function schema
                schema = get_summary_function_schema()
                
                # Summarize
                print("🧠 Creating summary and analytics...")
                summary_data = client.summarize_text(transcript, schema)
                print("✅ Summary and analytics created successfully")
                
                # Display results
                print("\n📊 Generated Summary:")
                print("-" * 40)
                print(format_summary_as_markdown(summary_data))
                
                print("\n📈 Analytics (JSON):")
                print("-" * 40)
                print(format_analytics_as_json(summary_data))
                
                # Save summary and analytics
                summary_file = outputs_dir / f"{audio_file.stem}_summary_{timestamp}.md"
                with open(summary_file, 'w', encoding='utf-8') as f:
                    f.write(format_summary_as_markdown(summary_data))
                
                analytics_file = outputs_dir / f"{audio_file.stem}_analysis_{timestamp}.json"
                with open(analytics_file, 'w', encoding='utf-8') as f:
                    f.write(format_analytics_as_json(summary_data))
                
                print(f"\n💾 Files saved:")
                print(f"   - Transcription: {transcription_file}")
                print(f"   - Summary: {summary_file}")
                print(f"   - Analytics: {analytics_file}")
                
            except Exception as e:
                print(f"❌ Error processing {audio_file}: {e}")
                continue
        
        print(f"\n{'='*70}")
        print("🎉 All audio files processed!")
        print(f"📁 Check the outputs/ folder for results")
        
    except ValueError as e:
        print(f"❌ Configuration error: {e}")
        print("💡 Please check your .env file and API key")
    except Exception as e:
        print(f"❌ API test error: {e}")

def show_sample_outputs():
    """Display sample outputs without API calls."""
    print("📋 Sample Outputs")
    print("=" * 60)
    
    sample_data = {
        "summary": "The speaker discusses their morning routine, emphasizing the importance of starting the day with structure and positive habits. They share practical tips for productivity and wellness.",
        "word_count": 1280,
        "speaking_speed_wpm": 132,
        "frequently_mentioned_topics": [
            {"topic": "Morning routines", "mentions": 6},
            {"topic": "Productivity tips", "mentions": 4},
            {"topic": "Health habits", "mentions": 3}
        ],
        "key_points": [
            "Wake up early at 6 AM",
            "Start with hydration",
            "Include light exercise",
            "Plan your day ahead",
            "Maintain consistency"
        ],
        "sentiment": "positive"
    }
    
    print("📝 Summary (Markdown):")
    print("-" * 30)
    print(format_summary_as_markdown(sample_data))
    
    print("\n📈 Analytics (JSON):")
    print("-" * 30)
    print(format_analytics_as_json(sample_data))

def main():
    """Main test function."""
    print("🎵 Audio Transcription and Summarization - Test Application")
    print("=" * 70)
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "api":
            test_with_api()
        elif command == "sample":
            show_sample_outputs()
        else:
            print("❌ Unknown command. Use: api, sample, or no arguments for structure test")
    else:
        # Default: test structure
        test_without_api()
        
        print("\n" + "=" * 70)
        print("📚 Available test commands:")
        print("  python test_app.py          - Test project structure")
        print("  python test_app.py api      - Test with OpenAI API (requires .env)")
        print("  python test_app.py sample   - Show sample outputs")
        print("\n💡 To test with real audio files, create a .env file with your OPENAI_API_KEY")

if __name__ == "__main__":
    main()
