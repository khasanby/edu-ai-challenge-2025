# Product Search Tool - EDU AI Challenge Task 10

This Python console application uses OpenAI's **function calling** to filter a hardcoded dataset of products based on natural language input from users. The app leverages `gpt-4.1-mini` to intelligently parse user queries and determine appropriate filtering criteria.

## ✨ Features

- 🔍 Natural language product search
- 🤖 OpenAI function calling with `gpt-4.1-mini` 
- 📦 50+ diverse products across multiple categories
- 🎯 Intelligent filtering by category, price, rating, and stock status
- 💬 User-friendly console interface

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Create `.env` File
Create a `.env` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

**Important:** Never commit your `.env` file to version control!

### 3. Verify Setup
Ensure `products.json` is present in the project root (it should be included).

## 🚀 How to Run

```bash
python main.py
```

The application will:
1. Load the product dataset from `products.json`
2. Prompt you for a natural language search query
3. Send your query to OpenAI's `gpt-4.1-mini` model using function calling
4. Display filtered results based on the AI's interpretation

## 💡 Example User Queries

You can search using natural language like:

- `"I need electronics under $100 and in stock"`
- `"Looking for books rated above 4.5 that are available now"`
- `"Show me fitness products under $50 with a rating above 4"`
- `"Kitchen appliances with good ratings"`
- `"I want something in the clothing category that's affordable"`

## 📊 Product Categories

The dataset includes products from these categories:
- **Electronics** (headphones, laptops, monitors, etc.)
- **Fitness** (yoga mats, dumbbells, exercise bikes, etc.)
- **Kitchen** (blenders, air fryers, coffee makers, etc.)
- **Books** (novels, programming guides, cookbooks, etc.)
- **Clothing** (shirts, jeans, shoes, accessories, etc.)

## 🔧 Technical Details

- **Model**: `gpt-4o-mini` with function calling
- **Filtering Logic**: Entirely handled by OpenAI (no hardcoded Python filtering)
- **Function Schema**: Supports category, max_price, min_rating, and in_stock parameters
- **Error Handling**: Comprehensive error messages for API failures and missing files

## 📋 Requirements

- Python 3.8+
- OpenAI API key
- Internet connection for API calls

## 🚨 Important Notes

- The `.env` file is already included in `.gitignore` and will not be committed
- All product filtering logic is performed by OpenAI's function calling - no hardcoded filtering in Python
- The application uses `function_call: "auto"` equivalent (tool_choice) to ensure consistent function calling
- Error messages are displayed clearly if the API fails or configuration issues occur

## 📁 Project Structure

```
task10/
├── main.py              # Main application entry point
├── openai_client.py     # OpenAI client with function calling
├── products.json        # Product dataset (50+ items)
├── requirements.txt     # Python dependencies
├── README.md           # This file
├── sample_outputs.md   # Example runs and outputs
├── .gitignore          # Git ignore patterns
└── .env               # Your OpenAI API key (create this!)
```

## 🎯 EDU AI Challenge Compliance

This application meets all Task 10 requirements:
- ✅ Uses OpenAI function calling exclusively for filtering
- ✅ Implements `gpt-4o-mini` model
- ✅ Includes comprehensive product dataset (50+ items)
- ✅ Handles natural language queries effectively
- ✅ Proper error handling and user experience
- ✅ Clean project structure with all required files 