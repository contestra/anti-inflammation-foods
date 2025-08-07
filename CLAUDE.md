# Claude AI Context File - Anti-Inflammatory Foods Stack Builder

## Project Overview
Interactive web application for building personalized anti-inflammatory diet plans with 100 scientifically-validated foods. Mirror architecture of the supplements app but focused on whole foods and diet synergies.

## Current State (December 2024)
- **Status**: COMPLETE AND READY FOR DEPLOYMENT
- **Foods**: 100 (expanded from original 14 in React app)
- **Scoring**: Evidence-based 0-10 scale
- **Platform**: Shopify integration ready
- **All features**: Working (search, filter, add to stack, export, synergies)

## Key Differences from Supplements App
1. **Synergies vs Interactions**: Foods have positive synergies rather than negative interactions
2. **Diet Templates vs Stack Templates**: Pre-built diet plans for health goals
3. **Preparation Methods**: Each food includes how to prepare/cook
4. **Serving Sizes**: Real food portions instead of dosages
5. **Cost**: Per pound/unit instead of per bottle

## Key Technical Details

### Scoring System (Same as Supplements)
```javascript
// Evidence Score (0-10): Based on research quantity
// Uses study counts from meta-analyses, RCTs, clinical studies

// Anti-Inflammatory Score (0-10): Based on marker reductions
// Measured effects on CRP, IL-6, TNF-α, and other biomarkers
```

### File Structure
```
Core Files (Required for Shopify):
├── food-stack-builder-data.js    # 100 foods database
├── food-stack-builder.js         # Application logic
├── food-stack-builder.css        # Styling
├── lucide.js                     # Icons (copied from supplements)
└── page.foods.liquid             # Shopify template

Documentation:
├── README.md                      # Main documentation
├── SHOPIFY_DEPLOYMENT_GUIDE.md   # Deployment instructions
└── CLAUDE.md                     # This file

Testing:
└── food-stack-builder.html       # Local testing file
```

### Categories (8 total + subcategories)
1. **Fatty Fish** (10 foods) - Omega-3 rich fish
2. **Berries** (10 foods) - Antioxidant-rich fruits
3. **Leafy Greens** (10 foods) - Nutrient-dense vegetables
4. **Nuts & Seeds** (10 foods) - Healthy fat and protein sources
5. **Spices & Herbs** (15 foods) - Concentrated bioactive compounds
6. **Healthy Fats** (10 foods) - Anti-inflammatory oils and fats
7. **Beverages** (10 foods) - Teas, juices, and broths
8. **Cruciferous** (10 foods) - Detoxification vegetables
9. **Others** (15 foods) - Additional anti-inflammatory foods

### Food Data Structure
```javascript
const foods = [
  {
    id: 'salmon',
    name: 'Wild-Caught Salmon',
    category: 'Fatty Fish',
    evidence: { score: 9.4, studies: 234 },
    antiInflammatoryScore: 9.2,
    servingSize: '3.5 oz (100g)',
    frequency: '2-3 times per week',
    keyCompounds: ['EPA', 'DHA', 'Astaxanthin', 'Vitamin D'],
    cost: '$12-20/lb',
    preparation: 'Grilled, baked, or poached - avoid frying',
    description: 'Premier source of anti-inflammatory omega-3 fatty acids',
    mechanisms: ['Omega-3 conversion to resolvins', 'COX-2 inhibition'],
    sideEffects: 'Choose wild-caught to minimize contaminants',
    interactions: [] // Usually empty for foods
  }
];
```

### Synergies Structure
```javascript
const synergies = [
  {
    food1: 'turmeric',
    food2: 'black_pepper',
    type: 'absorption',
    description: 'Black pepper increases curcumin absorption by 2000%',
    recommendation: 'Always combine turmeric with black pepper',
    evidenceLevel: 9
  }
];
```

### Diet Templates
```javascript
const dietTemplates = [
  {
    id: 'mediterranean',
    name: 'Mediterranean Anti-Inflammatory',
    foods: ['olive_oil', 'salmon', 'walnuts', 'spinach', 'blueberries'],
    description: 'Evidence-based Mediterranean pattern',
    popularity: 95
  }
];
```

## Key Functions and Locations

### Main Application (food-stack-builder.js)
- `renderFoods()` - Display food cards with filters/search
- `addToStack()` - Add food to personal stack
- `checkSynergies()` - Identify beneficial combinations
- `exportStack()` - Generate shopping list and meal plan
- `applyTemplate()` - Load pre-built diet template

### Notable Food Synergies
1. **Turmeric + Black Pepper + Fat**: Maximum curcumin absorption
2. **Leafy Greens + Avocado/Olive Oil**: Enhanced carotenoid absorption
3. **Green Tea + Berries**: Synergistic antioxidant effects
4. **Salmon + Walnuts**: Complementary omega-3 profiles
5. **Broccoli + Olive Oil**: Better sulforaphane absorption

## Common Commands

### Testing Locally
```bash
# Open test file in browser
start food-stack-builder.html

# Check food count
node -e "const data = require('./food-stack-builder-data.js'); console.log('Foods:', data.foods.length);"
```

### Git Operations
```bash
# Initialize and connect to GitHub
git init
git remote add origin https://github.com/contestra/anti-inflammation-foods.git
git branch -M main

# Commit changes
git add -A
git commit -m "Initial anti-inflammatory foods app"
git push -u origin main
```

## Deployment Checklist
1. Upload 4 files to Shopify Assets folder
2. Upload 1 file to Templates folder  
3. Create page with foods template
4. Test all functionality
5. Verify 100 foods load

## Future Enhancements (Potential)
- Recipe integration with food combinations
- Meal planning calendar
- Nutritional analysis (calories, macros)
- Shopping list generation by store section
- Seasonal food availability
- Budget optimization features
- Integration with meal delivery services

## Key Differences in User Experience
- **Focus on whole foods** vs isolated compounds
- **Preparation methods** are crucial for foods
- **Synergies are positive** - foods enhance each other
- **Cost per serving** varies more with foods
- **Seasonal availability** affects some foods
- **Cultural preferences** more relevant

## Important Notes
- All 100 foods have legitimate research backing
- Scores based on human clinical studies
- Preparation methods affect bioavailability
- Food quality matters (organic, wild-caught, etc.)
- System designed for educational purposes
- Users should consult healthcare providers

## Quick Troubleshooting

### If foods don't load:
- Check browser console for errors
- Verify food-stack-builder-data.js is properly formatted
- Ensure all brackets/braces are balanced

### If buttons don't work:
- Check event listeners in food-stack-builder.js
- Verify lucide.createIcons() is called after DOM updates
- Check for JavaScript errors in console

### If synergies don't show:
- Verify both foods in synergy are in stack
- Check synergies array in data file

## Version History
- **v1.0**: Initial implementation with 100 foods (December 2024)

## Related Projects
- Inflammation Supplements Stack Builder (sister app)
- Both apps share same architecture and scoring methodology

## GitHub Repository
https://github.com/contestra/anti-inflammation-foods

---

*This file helps Claude AI understand the project context for future development*