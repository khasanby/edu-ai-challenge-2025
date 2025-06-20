from typing import Dict, Any, List

def get_summary_function_schema() -> Dict[str, Any]:
    """
    Define the OpenAI function schema for structured audio summary with analytics.
    
    Returns:
        OpenAI function schema dictionary
    """
    return {
        "name": "create_audio_summary",
        "description": "Create a structured summary and analytics of transcribed audio content",
        "parameters": {
            "type": "object",
            "properties": {
                "summary": {
                    "type": "string",
                    "description": "A concise summary of the main content and key points"
                },
                "word_count": {
                    "type": "integer",
                    "description": "Total number of words in the transcript"
                },
                "speaking_speed_wpm": {
                    "type": "integer",
                    "description": "Estimated speaking speed in words per minute"
                },
                "frequently_mentioned_topics": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "topic": {
                                "type": "string",
                                "description": "The topic or theme mentioned"
                            },
                            "mentions": {
                                "type": "integer",
                                "description": "Number of times this topic is mentioned"
                            }
                        },
                        "required": ["topic", "mentions"]
                    },
                    "description": "List of frequently mentioned topics with their mention counts (top 3+ topics)"
                },
                "key_points": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "List of important points or takeaways from the content"
                },
                "sentiment": {
                    "type": "string",
                    "enum": ["positive", "neutral", "negative", "mixed"],
                    "description": "The overall emotional tone of the content"
                }
            },
            "required": ["summary", "word_count", "speaking_speed_wpm", "frequently_mentioned_topics", "key_points", "sentiment"]
        }
    }

def format_summary_as_markdown(summary_data: Dict[str, Any]) -> str:
    """
    Format the structured summary as markdown.
    
    Args:
        summary_data: Dictionary containing the structured summary
        
    Returns:
        Formatted markdown string
    """
    markdown = "# Audio Content Summary\n\n"
    
    # Summary
    markdown += f"## Summary\n{summary_data.get('summary', 'N/A')}\n\n"
    
    # Analytics
    markdown += f"## Analytics\n"
    markdown += f"- **Word Count:** {summary_data.get('word_count', 'N/A')}\n"
    markdown += f"- **Speaking Speed:** {summary_data.get('speaking_speed_wpm', 'N/A')} words per minute\n"
    markdown += f"- **Sentiment:** {summary_data.get('sentiment', 'N/A')}\n\n"
    
    # Frequently Mentioned Topics
    topics = summary_data.get('frequently_mentioned_topics', [])
    if topics:
        markdown += "## Frequently Mentioned Topics\n"
        for topic_data in topics:
            topic = topic_data.get('topic', 'Unknown')
            mentions = topic_data.get('mentions', 0)
            markdown += f"- **{topic}:** {mentions} mentions\n"
        markdown += "\n"
    
    # Key Points
    key_points = summary_data.get('key_points', [])
    if key_points:
        markdown += "## Key Points\n"
        for i, point in enumerate(key_points, 1):
            markdown += f"{i}. {point}\n"
        markdown += "\n"
    
    return markdown

def format_summary_as_json(summary_data: Dict[str, Any]) -> str:
    """
    Format the structured summary as JSON.
    
    Args:
        summary_data: Dictionary containing the structured summary
        
    Returns:
        Formatted JSON string
    """
    import json
    return json.dumps(summary_data, indent=2, ensure_ascii=False)

def format_analytics_as_json(summary_data: Dict[str, Any]) -> str:
    """
    Format only the analytics portion as JSON (for analysis.json output).
    
    Args:
        summary_data: Dictionary containing the structured summary
        
    Returns:
        Formatted JSON string with only analytics data
    """
    import json
    
    analytics = {
        "word_count": summary_data.get('word_count', 0),
        "speaking_speed_wpm": summary_data.get('speaking_speed_wpm', 0),
        "frequently_mentioned_topics": summary_data.get('frequently_mentioned_topics', [])
    }
    
    return json.dumps(analytics, indent=2, ensure_ascii=False) 