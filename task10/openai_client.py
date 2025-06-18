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

Use the filter_products function to specify filtering criteria based on the user's natural language query. 
Only specify parameters that are clearly mentioned or implied in the user's request.
"""

        user_message = f"User search query: '{user_query}'"
        
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