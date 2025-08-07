# Anti-Inflammatory Foods Stack Builder

## Overview
Interactive web application for building personalized anti-inflammatory diet plans with 100 scientifically-validated foods. Features evidence-based scoring, food synergies, and diet templates.

## Features
- **100 Anti-Inflammatory Foods**: Comprehensive database with scientific validation
- **Evidence-Based Scoring**: 0-10 scale based on research studies
- **Food Synergies**: Identifies beneficial food combinations
- **Diet Templates**: Pre-built plans for specific health goals
- **Smart Search & Filter**: Find foods by name, category, or compounds
- **Export Functionality**: Download your personalized food stack
- **Mobile Responsive**: Works on all devices

## Categories
1. **Fatty Fish** (10 foods): Salmon, sardines, mackerel, etc.
2. **Berries** (10 foods): Blueberries, tart cherries, strawberries, etc.
3. **Leafy Greens** (10 foods): Spinach, kale, arugula, etc.
4. **Nuts & Seeds** (10 foods): Walnuts, flaxseeds, almonds, etc.
5. **Spices & Herbs** (15 foods): Turmeric, ginger, garlic, etc.
6. **Healthy Fats** (10 foods): Olive oil, avocado, coconut oil, etc.
7. **Beverages** (10 foods): Green tea, matcha, pomegranate juice, etc.
8. **Cruciferous** (10 foods): Broccoli, Brussels sprouts, cauliflower, etc.

## Scoring System

### Evidence Score (0-10)
Based on the quantity and quality of research:
- Meta-analyses and systematic reviews
- Randomized controlled trials
- Clinical studies

### Anti-Inflammatory Score (0-10)
Based on documented effects on inflammatory markers:
- C-reactive protein (CRP)
- Interleukin-6 (IL-6)
- Tumor necrosis factor-alpha (TNF-α)
- Other inflammatory biomarkers

## Food Synergies
The app identifies beneficial food combinations:
- **Turmeric + Black Pepper**: 2000% increase in curcumin absorption
- **Leafy Greens + Healthy Fats**: 300-500% increase in carotenoid absorption
- **Green Tea + Berries**: Synergistic antioxidant effects

## Diet Templates
Pre-configured food combinations for specific goals:
- Mediterranean Anti-Inflammatory
- Brain Health Foods
- Joint Support Foods
- Heart-Healthy Stack
- Gut Healing Foods
- Athletic Recovery
- Autoimmune Support
- Beginner Anti-Inflammatory

## Installation

### Local Testing
1. Open `food-stack-builder.html` in a web browser
2. All features work locally with no server required

### Shopify Deployment
See `SHOPIFY_DEPLOYMENT_GUIDE.md` for detailed instructions

## File Structure
```
inflammation-foods/
├── food-stack-builder-data.js    # Database of 100 foods
├── food-stack-builder.js         # Application logic
├── food-stack-builder.css        # Styling
├── lucide.js                     # Icon library
├── page.foods.liquid             # Shopify template
├── food-stack-builder.html       # Local testing file
└── docs/
    ├── README.md                 # This file
    ├── SHOPIFY_DEPLOYMENT_GUIDE.md
    ├── SCORING_METHODOLOGY.md
    └── CLAUDE.md                 # AI context file
```

## Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid/Flexbox
- **Icons**: Lucide Icons
- **Data Storage**: LocalStorage for persistence
- **Platform**: Shopify compatible

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance
- Instant load with 100 foods
- Efficient DOM manipulation
- Minimal dependencies
- Total size: ~250KB

## Usage Examples

### Building a Stack
1. Browse foods by category or search
2. Click "Add to Stack" to select foods
3. View synergies in "My Stack" tab
4. Export your personalized plan

### Applying Templates
1. Go to "Diet Templates" tab
2. Choose a template based on your goal
3. Click "Apply Template"
4. Customize as needed

## Development

### Adding New Foods
Edit `food-stack-builder-data.js`:
```javascript
{
  id: 'unique_id',
  name: 'Food Name',
  category: 'Category',
  evidence: { score: 8.5, studies: 120 },
  antiInflammatoryScore: 8.2,
  // ... other properties
}
```

### Modifying Synergies
Edit the `synergies` array in `food-stack-builder-data.js`

### Customizing Templates
Edit the `dietTemplates` array in `food-stack-builder-data.js`

## Scientific Validation
All foods included meet these criteria:
- Peer-reviewed research support
- Documented anti-inflammatory effects
- Safe for general consumption
- Readily available

## Medical Disclaimer
This tool is for educational purposes only. Consult with a healthcare provider before making significant dietary changes, especially if you have medical conditions or take medications.

## Version History
- **v1.0** (December 2024): Initial release with 100 foods

## Credits
- **Developer**: CONTESTRA
- **Platform**: Shopify
- **Research**: Based on peer-reviewed scientific literature

## License
Proprietary - All rights reserved

## Support
For questions or issues, contact the development team.

---

*Last Updated: December 2024*