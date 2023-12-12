# Wrapify - smart gifting, simplified

## 📖 Description

Wrapify is a tech-enabled gift recommendation application that takes the stress out of finding the perfect gift for any occasion. Our platform provides user-friendly input options, creating a seamless and personalized gift discovery experience.

These scripts are designed to interact with the Rainforest API to search and view Amazon product listings and performs sentiment analysis on product reviews using the Twinword Sentiment Analysis API. It helps users find products based on specific criteria and understand public sentiment towards these products.

link to deployed application: https://beabravo.github.io/wrapify/

## Configuration

- **API Usage Flag (`useAPI`):** Set this to `true` to enable API calls.
- **Rainforest API Key (`rainForestApiKey`):** Replace with your Rainforest API key.
- **Twinword API Key:** Included in the sentiment analysis request headers.

## Endpoints

- **Search Listing URL (`baseListingUrl`):** Acquire Amazon search listings.
- **Product Listing URL (`baseProductUrl`):** View individual Amazon product listings.
- **Sentiment Analysis URL:** Twinword API endpoint for sentiment analysis.

## Functions

- **Toggle URL Input (`toggleUrlInput`):** Shows/hides URL input based on user selection.
- **Product URL (`getInMindProductUrl`), Price Range, Prime Delivery, Category Selection.**
- **Keywords Management.**
- **Page Reset (`resetPage`):** Resets page elements and clears selections/inputs.
- **Search URL Builder (`buildSearchUrl`), Product URL Builder, ASIN URL Builder.**
- **Search Execution (`runSearch`):** Executes product search with parameters.
- **Product Info Viewer (`viewProductInfo`):** Fetches and displays product information and reviews.
- **Sentiment Analysis (`sentimentAnalysis`):** Performs sentiment analysis on reviews.
- **Sentiment Array Handling (`getSentimentArray`), Sentiment Calculation (`calculateSentiment`), Adding Property to Product (`addPropertytoProduct`):** These functions work together to analyze sentiment data and integrate it into product information.

## Usage

1. Set `useAPI` to `true` for API interactions.
2. Enter Rainforest API key in `rainForestApiKey`.
3. Interact with form elements to select products, categories, and specify preferences.
4. The script handles user inputs, fetches product information from Rainforest API, and performs sentiment analysis on product reviews using the Twinword API.

## Dependencies

- Valid Rainforest and Twinword API keys.

## Note

- Ensure API keys are kept secure and not exposed publicly.
- The Twinword Sentiment Analysis API has a rate limit; requests are managed with a time delay.
- The sentiment analysis function iterates through reviews with a 5-second delay between each review.
- The script calculates a sentiment score for each product based on review analysis.
- The API usage flag should be set to `false` when not in use to prevent unwanted API calls.

## Authors and acknowledgment

- Beatriz Bravo
- Luc Tourangeau
- Neil Parikh

## Demo of deployed application

![screen recording](./assets/images/Screen%20Recording.gif)
