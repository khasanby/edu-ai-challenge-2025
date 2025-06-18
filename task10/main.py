#!/usr/bin/env python3
"""
Product Search Application - EDU AI Challenge Task 10
Uses OpenAI function calling to filter products based on natural language input.
"""

import json
import os
from dotenv import load_dotenv
from openai_client import OpenAIClient

def load_products(file_path="products.json"):
    """Load products from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: {file_path} not found!")
        return []
    except json.JSONDecodeError:
        print(f"❌ Error: Invalid JSON in {file_path}")
        return []

def display_products(products):
    """Display filtered products in a clean, formatted way"""
    if not products:
        print("\n❌ No products matched your criteria.")
        return
    
    print(f"\n✅ Found {len(products)} matching products:")
    print("=" * 60)
    
    for i, product in enumerate(products, 1):
        name = product.get('name', 'Unknown')
        category = product.get('category', 'Unknown')
        price = product.get('price', 0)
        rating = product.get('rating', 0)
        in_stock = product.get('in_stock', False)
        stock_status = "✓ In Stock" if in_stock else "✗ Out of Stock"
        
        print(f"{i}. {name}")
        print(f"   Category: {category} | Price: ${price:.2f}")
        print(f"   Rating: {rating}/5.0 | {stock_status}")
        print("-" * 40)

def main():
    """Main application entry point"""
    print("🔍 Product Search Tool - OpenAI Function Calling")
    print("=" * 55)
    
    # Load environment variables
    load_dotenv()
    
    # Check if OpenAI API key is set
    if not os.getenv('OPENAI_API_KEY'):
        print("❌ Error: OPENAI_API_KEY not found in .env file!")
        print("Please create a .env file with your OpenAI API key:")
        print("OPENAI_API_KEY=your_openai_api_key_here")
        return
    
    # Load product dataset
    products = load_products()
    if not products:
        print("❌ No products available to search.")
        return
    
    print(f"📦 Loaded {len(products)} products from dataset.")
    
    # Show example queries
    print("\n💡 Example search queries:")
    print("• 'I need electronics under $100 and in stock'")
    print("• 'Looking for books rated above 4.5 that are available now'")
    print("• 'Show me fitness products under $50 with a rating above 4'")
    print("• 'Kitchen appliances with good ratings'")
    print()
    
    # Get user input
    user_query = input("🔎 Enter your search query: ").strip()
    if not user_query:
        print("❌ No search query provided. Exiting.")
        return
    
    # Initialize OpenAI client and perform search
    try:
        print(f"\n🤖 Processing: '{user_query}'")
        print("⏳ Calling OpenAI API with function calling...")
        
        client = OpenAIClient()
        filtered_products = client.filter_products(user_query, products)
        display_products(filtered_products)
        
    except Exception as e:
        print(f"\n❌ Error during search: {str(e)}")
        print("Please check your OpenAI API key and internet connection.")

if __name__ == "__main__":
    main() 