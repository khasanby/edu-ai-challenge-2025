# Audio Transcription and Summarization - Task 11 EDU AI Challenge

🎵 A Python console application that transcribes audio files, creates summaries, and extracts meaningful analytics using OpenAI's Whisper and GPT models.

## Features

- 🎤 **Audio Transcription**: Supports WAV and MP3 formats using OpenAI's Whisper model
- 🧠 **AI-Powered Summarization**: Uses GPT-3.5-turbo for intelligent content analysis
- 📊 **Structured Analytics**: Provides word count, speaking speed, and frequently mentioned topics
- 💾 **Multiple Output Files**: Saves transcription, summary, and analytics separately
- 🔧 **Modular Design**: Clean, testable code structure
- 📁 **Flexible Input**: Process files from audios/ folder or specify custom file paths

## Project Structure

```
task11/
├── main.py                 # Main entry point
├── src/
│   ├── openai_client.py    # OpenAI API client wrapper
│   └── functions.py        # Function schemas and formatting
├── audios/                 # Input audio files
├── outputs/                # Generated files (transcription, summary, analytics)
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Quick Start

### 1. Setup Environment

```bash
# Clone or navigate to the project directory
cd task11

# Install dependencies
pip install -r requirements.txt

# Copy environment template and add your API key
cp .env.example .env
```

### 2. Configure API Key

Edit the `.env` file and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Get your API key from:** https://platform.openai.com/api-keys

⚠️ **Important:** Never commit your `.env` file to GitHub or share your API key publicly.

### 3. Audio File Input

The application supports **two modes of audio input**:

#### Mode 1: Default Folder Processing
Place your audio files in the `audios/` folder and run:
```bash
# Process all audio files in the audios/ folder
python test_app.py api
```

#### Mode 2: CLI Mode (Single File)
Process a specific audio file by providing its path:
```bash
# Process a specific audio file
python main.py audios/hometown.wav

# Process with verbose output
python main.py audios/routine.mp3 --verbose

# Console output only (no file saving)
python main.py audios/sample.wav --no-save
```

### 4. Supported Audio Formats

- WAV (.wav)
- MP3 (.mp3)

**Note:** The application is capable of processing **any new audio file**, not just the provided samples. Simply place your audio files in the `audios/` folder or specify the file path when running the application.

## Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `audio_file` | Path to audio file (required for CLI mode) | - |
| `--no-save` | Don't save to files, console output only | `False` |
| `--verbose, -v` | Show detailed progress information | `False` |

## Output Structure

The application generates three types of output files for each audio processing:

### 1. Transcription File (`*_transcription_*.md`)
Contains the raw transcribed text from the audio file.

### 2. Summary File (`*_summary_*.md`)
Contains a structured summary with:
- **Summary**: Concise overview of the content
- **Analytics**: Word count, speaking speed, and sentiment
- **Frequently Mentioned Topics**: Top topics with mention counts
- **Key Points**: Important takeaways from the content

### 3. Analytics File (`*_analysis_*.json`)
Contains structured analytics data in JSON format:
```json
{
  "word_count": 1280,
  "speaking_speed_wpm": 132,
  "frequently_mentioned_topics": [
    { "topic": "Customer Onboarding", "mentions": 6 },
    { "topic": "Q4 Roadmap", "mentions": 4 },
    { "topic": "AI Integration", "mentions": 3 }
  ]
}
```

## Example Outputs

### Summary (Markdown)
```markdown
# Audio Content Summary

## Summary
The speaker discusses their daily morning routine and productivity habits...

## Analytics
- **Word Count:** 1280
- **Speaking Speed:** 132 words per minute
- **Sentiment:** positive

## Frequently Mentioned Topics
- **Morning routines:** 6 mentions
- **Productivity tips:** 4 mentions
- **Health habits:** 3 mentions

## Key Points
1. Start with hydration
2. Exercise before breakfast
3. Plan the day ahead
```

### Analytics (JSON)
```json
{
  "word_count": 1280,
  "speaking_speed_wpm": 132,
  "frequently_mentioned_topics": [
    { "topic": "Morning routines", "mentions": 6 },
    { "topic": "Productivity tips", "mentions": 4 },
    { "topic": "Health habits", "mentions": 3 }
  ]
}
```

## Testing

Run the test application to see sample outputs:

```bash
# Test project structure (no API key needed)
python test_app.py

# Test with all audio files (requires .env with API key)
python test_app.py api

# Show sample outputs without API calls
python test_app.py sample
```

### Test App Features

The test application provides comprehensive testing capabilities:

- **Structure Test**: Verifies all required files and directories exist
- **API Test**: Processes ALL audio files in the `audios/` folder
- **Sample Outputs**: Shows example summaries without API calls

### API Test Details

When running `python test_app.py api`, the application will:

1. Process every audio file in the `audios/` folder
2. Generate transcription, summary, and analytics files for each
3. Save results with timestamps to the `outputs/` folder
4. Display progress and results in the console
5. Continue processing even if one file fails

**Example output:**
```
🎵 Found 3 audio file(s) to process:
   - audios/hometown.wav
   - audios/routine.mp3
   - audios/CAR0004.mp3

============================================================
🎤 Processing 1/3: audios/hometown.wav
============================================================
📝 Transcribing audio...
✅ Transcription complete: 1028 characters
🧠 Creating summary and analytics...
✅ Summary created successfully

💾 Files saved:
   - Transcription: outputs/hometown_transcription_20241201_143022.md
   - Summary: outputs/hometown_summary_20241201_143022.md
   - Analytics: outputs/hometown_analysis_20241201_143022.json
```

## Requirements

- Python 3.7+
- OpenAI API key
- Internet connection for API calls

## Dependencies

- `openai>=1.0.0` - OpenAI API client
- `python-dotenv>=1.0.0` - Environment variable management

## Error Handling

The application includes comprehensive error handling for:
- Missing API keys
- Invalid audio files
- Network connectivity issues
- API rate limits
- Unsupported file formats

## Contributing

This project is part of the EDU AI Challenge. Feel free to:
- Report bugs
- Suggest improvements
- Add new features
- Improve documentation

## License

This project is created for educational purposes as part of the EDU AI Challenge.

---

**Happy transcribing and analyzing! 🎉**
