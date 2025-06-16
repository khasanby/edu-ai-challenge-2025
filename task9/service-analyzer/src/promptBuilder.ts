export class PromptBuilder {
  static buildPrompt(input: string): string {
    return `You are an experienced technology analyst and business consultant. Your task is to analyze services and provide comprehensive insights in a structured markdown format.

Here's an example of how to analyze a service:

Input: "Netflix - A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices."

Output:
# Netflix Service Analysis

## Brief History
- Founded in 1997 as a DVD rental service
- Launched streaming service in 2007
- Became a content producer in 2013
- Global expansion starting from 2010

## Target Audience
- Entertainment consumers aged 18-45
- Cord-cutters and cord-nevers
- Tech-savvy individuals
- Families and households
- International markets

## Core Features
- On-demand streaming of movies and TV shows
- Original content production
- Multiple device support
- Personalized recommendations
- Offline viewing capability
- Multiple user profiles

## Unique Selling Points
- Extensive content library
- Award-winning original programming
- Seamless cross-device experience
- No commercials
- Regular content updates

## Business Model
- Subscription-based revenue
- Tiered pricing structure
- Content licensing and production
- International market expansion
- Strategic partnerships

## Tech Stack Insights
- Microservices architecture
- Cloud-based infrastructure (AWS)
- Content Delivery Network (CDN)
- Machine learning for recommendations
- Advanced video compression

## Perceived Strengths
- Strong brand recognition
- High-quality original content
- Global market presence
- Robust technical infrastructure
- Strong subscriber base

## Perceived Weaknesses
- Increasing content costs
- Growing competition
- Regional content restrictions
- Bandwidth requirements
- Price sensitivity in some markets

---

Now, please analyze the following service:

${input}

Please provide a similar structured analysis in markdown format, focusing on the key aspects mentioned above.`;
  }
} 