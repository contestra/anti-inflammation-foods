# Anti-Inflammatory Foods App

A web application for building personalized anti-inflammatory diet protocols based on scientific evidence.

## Features

- **100 Science-Backed Foods**: Comprehensive database of anti-inflammatory foods with evidence scores
- **Diet Templates**: Pre-built diet plans for different health goals
- **Personalized Diet Builder**: Create and customize your own anti-inflammatory diet
- **Evidence-Based Scoring**: Foods rated on 0-10 scale based on clinical studies
- **Food Synergies**: Identify beneficial food combinations
- **Export Functionality**: Download your personalized diet plan

## File Structure

**Only 5 files needed:**

**Assets Folder (4 files)**
1. **food-stack-builder-data.js** - Database with 100 foods and scoring
2. **food-stack-builder.js** - Application logic and functionality
3. **food-stack-builder.css** - Styling and UI design
4. **lucide.js** - Icon library

**Templates Folder (1 file)**
5. **page.foods.liquid** - Shopify page template

## Deployment to Shopify

1. Upload all files in the `assets` folder to your theme's Assets folder
2. Upload `page.foods.liquid` to your theme's Templates folder
3. Create a new page in Shopify and select the "page.foods" template
4. The page title will be provided by Shopify (no h1 in the app itself)

## Local Testing

Use `food-stack-builder.html` for local development and testing.

## Food Categories

- Fatty Fish
- Berries
- Leafy Greens
- Nuts & Seeds
- Spices & Herbs
- Healthy Fats
- Beverages
- Cruciferous

## Scoring System

- **Evidence Score**: Based on number and quality of clinical studies (0-10 scale)
- **Anti-Inflammatory Score**: Based on measured reductions in inflammatory markers (0-10 scale)

## Key Features

- Grid and list view options
- Search and filter by category
- Sort by anti-inflammatory score or name
- Diet templates for quick starts
- Real-time diet management with localStorage persistence

## Technology Stack

- Vanilla JavaScript (ES6+)
- CSS3 with responsive design
- Lucide icons
- Shopify Liquid templating (for production)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - CONTESTRA

## Support

For issues or questions, contact CONTESTRA support.