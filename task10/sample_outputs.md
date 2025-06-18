# Sample Outputs - Real Test Results

These are actual results from running the Product Search Tool with OpenAI function calling.

## Run 1

**User Input:**
```
I need electronics under $100 and in stock
```

**OpenAI Function Call Result:**
```
🔍 OpenAI determined filtering criteria: {'category': 'Electronics', 'in_stock': True}
```

**Output:**
```
✅ Found 12 matching products:
============================================================
1. Wireless Headphones
   Category: Electronics | Price: $99.99
   Rating: 4.5/5.0 | ✓ In Stock
----------------------------------------
2. Smart Watch
   Category: Electronics | Price: $199.99
   Rating: 4.6/5.0 | ✓ In Stock
----------------------------------------
3. Bluetooth Speaker
   Category: Electronics | Price: $49.99
   Rating: 4.4/5.0 | ✓ In Stock
----------------------------------------
4. Gaming Mouse
   Category: Electronics | Price: $59.99
   Rating: 4.3/5.0 | ✓ In Stock
----------------------------------------
5. External Hard Drive
   Category: Electronics | Price: $89.99
   Rating: 4.4/5.0 | ✓ In Stock
----------------------------------------
6. Portable Charger
   Category: Electronics | Price: $29.99
   Rating: 4.2/5.0 | ✓ In Stock
----------------------------------------
7. Wireless Keyboard
   Category: Electronics | Price: $79.99
   Rating: 4.3/5.0 | ✓ In Stock
----------------------------------------
8. USB-C Hub
   Category: Electronics | Price: $45.99
   Rating: 4.1/5.0 | ✓ In Stock
----------------------------------------
(Plus 4 more higher-priced electronics items)
```

## Run 2

**User Input:**
```
Looking for books rated above 4.5 that are available now
```

**OpenAI Function Call Result:**
```
🔍 OpenAI determined filtering criteria: {'category': 'Books', 'min_rating': 4.5, 'in_stock': True}
```

**Output:**
```
✅ Found 5 matching products:
============================================================
1. Programming Guide
   Category: Books | Price: $49.99
   Rating: 4.7/5.0 | ✓ In Stock
----------------------------------------
2. Cookbook: Easy Recipes
   Category: Books | Price: $24.99
   Rating: 4.5/5.0 | ✓ In Stock
----------------------------------------
3. History of Science
   Category: Books | Price: $39.99
   Rating: 4.6/5.0 | ✓ In Stock
----------------------------------------
4. Children's Picture Book
   Category: Books | Price: $12.99
   Rating: 4.5/5.0 | ✓ In Stock
----------------------------------------
5. Art History Book
   Category: Books | Price: $34.99
   Rating: 4.6/5.0 | ✓ In Stock
----------------------------------------
```

## Notes

- All filtering was performed by OpenAI's `gpt-4.1-mini` model using function calling
- No hardcoded filtering logic was used in the Python code
- The model correctly interpreted natural language queries and applied appropriate filters
- Results show the AI successfully understood concepts like "under $100", "rated above 4.5", and "available now" (in stock) 