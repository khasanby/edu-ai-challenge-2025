"""
OpenAI Client for Product Filtering
Uses OpenAI's function calling to filter products based on natural language queries.
"""

import json
import os
from openai import OpenAI
from dotenv import load_dotenv

class OpenAIClient:
    def __init__(self):
        """Initialize OpenAI client with API key from environment"""
        load_dotenv()
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        self.client = OpenAI(api_key=api_key)
        
        # Define the function schema for product filtering
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "filter_products",
                    "description": "Filter products based on user preferences and criteria",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "product_name": {
                                "type": "string",
                                "description": "Specific product name to search for (e.g., 'Smartphone', 'Wireless Headphones')"
                            },
                            "category": {
                                "type": "string",
                                "description": "Product category to filter by (e.g., Electronics, Kitchen, Fitness, Books, Clothing)"
                            },
                            "max_price": {
                                "type": "number",
                                "description": "Maximum price limit for products"
                            },
                            "min_rating": {
                                "type": "number",
                                "description": "Minimum rating threshold (0-5 scale)"
                            },
                            "in_stock": {
                                "type": "boolean",
                                "description": "Whether to only show products that are in stock"
                            }
                        },
                        "required": []
                    }
                }
            }
        ]

    def filter_products(self, user_query, products):
        """
        Use OpenAI function calling to filter products based on user query.
        
        Args:
            user_query (str): Natural language search query from user
            products (list): List of product dictionaries to filter
            
        Returns:
            list: Filtered list of products matching the criteria
        """
        
        # Create a summary of available products for context
        categories = list(set(p.get('category', 'Unknown') for p in products))
        price_range = f"${min(p.get('price', 0) for p in products):.2f} - ${max(p.get('price', 0) for p in products):.2f}"
        
        system_message = f"""You are a product search assistant. You will receive a user's search query and need to determine appropriate filtering criteria.

Available product categories: {', '.join(categories)}
Price range: {price_range}
Total products: {len(products)}

CRITICAL RULES - YOU MUST FOLLOW THESE:
1. If user mentions ANY price limit (like "under $100", "below $50", "less than $200", "under 800"), you MUST set max_price to that number
2. If user mentions a specific product type (like "smartphone", "laptop", "headphones"), look for products with that name in the dataset
3. If user mentions a general category (like "electronics", "books", "fitness"), filter by category
4. If user mentions rating requirements (like "above 4.5", "good ratings"), set min_rating appropriately
5. If user mentions stock status (like "in stock", "available"), set in_stock to true

EXAMPLES:
- "electronics under $100" → {{"category": "Electronics", "max_price": 100}}
- "smartphone under $800" → {{"product_name": "smartphone", "max_price": 800}}
- "books above 4.5" → {{"category": "Books", "min_rating": 4.5}}

Use the filter_products function to specify filtering criteria based on the user's natural language query. 
Be very careful to extract and apply ALL mentioned criteria including price limits, ratings, categories, and stock status.
"""

        user_message = f"""User search query: '{user_query}'

Please analyze this query and extract ALL filtering criteria:
- If there's a price limit, set max_price
- If there's a specific product, set product_name  
- If there's a category, set category
- If there's a rating requirement, set min_rating
- If there's a stock requirement, set in_stock

Query: {user_query}"""
        
        try:
            # Make the API call with function calling
            response = self.client.chat.completions.create(
                model="gpt-4.1-mini",  # Using gpt-4.1 mini
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                tools=self.tools,  # type: ignore
                tool_choice={"type": "function", "function": {"name": "filter_products"}},
                temperature=0.1
            )
            
            # Extract the function call arguments
            tool_calls = response.choices[0].message.tool_calls
            if not tool_calls or not tool_calls[0].function.arguments:
                raise Exception("No function call returned from OpenAI API")
            
            # Parse the filtering criteria from the function call
            criteria = json.loads(tool_calls[0].function.arguments)
            print(f"🔍 OpenAI determined filtering criteria: {criteria}")
            
            # Fallback: If AI didn't extract price but user mentioned it, add it manually
            if 'max_price' not in criteria:
                import re
                # Look for various price patterns
                price_patterns = [
                    r'under\s+\$?(\d+)',
                    r'below\s+\$?(\d+)', 
                    r'less\s+than\s+\$?(\d+)',
                    r'under\s+(\d+)',
                    r'below\s+(\d+)'
                ]
                for pattern in price_patterns:
                    price_match = re.search(pattern, user_query.lower())
                    if price_match:
                        criteria['max_price'] = float(price_match.group(1))
                        print(f"🔧 Added missing price filter: max_price = {criteria['max_price']}")
                        break
            
            # Apply the filtering logic based on OpenAI's criteria
            filtered_products = self._apply_filters(products, criteria)
            
            return filtered_products
            
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse OpenAI function call response: {str(e)}")
        except Exception as e:
            raise Exception(f"OpenAI API call failed: {str(e)}")

    def _apply_filters(self, products, criteria):
        """
        Apply filtering criteria determined by OpenAI to the product list.
        This is the only place where actual filtering happens - based on OpenAI's function call.
        
        Args:
            products (list): Original list of products
            criteria (dict): Filtering criteria from OpenAI function call
            
        Returns:
            list: Filtered products
        """
        filtered = products.copy()
        
        # Filter by specific product name if specified by OpenAI
        if criteria.get('product_name'):
            product_name = criteria['product_name'].lower()
            filtered = [p for p in filtered 
                       if product_name in p.get('name', '').lower()]
        
        # Filter by category if specified by OpenAI
        if criteria.get('category'):
            category = criteria['category'].lower()
            filtered = [p for p in filtered 
                       if p.get('category', '').lower() == category]
        
        # Filter by maximum price if specified by OpenAI
        if criteria.get('max_price') is not None:
            max_price = float(criteria['max_price'])
            filtered = [p for p in filtered 
                       if p.get('price', 0) <= max_price]
        
        # Filter by minimum rating if specified by OpenAI
        if criteria.get('min_rating') is not None:
            min_rating = float(criteria['min_rating'])
            filtered = [p for p in filtered 
                       if p.get('rating', 0) >= min_rating]
        
        # Filter by stock status if specified by OpenAI
        if criteria.get('in_stock') is not None:
            in_stock_required = bool(criteria['in_stock'])
            filtered = [p for p in filtered 
                       if p.get('in_stock', False) == in_stock_required]
        
        return filtered 