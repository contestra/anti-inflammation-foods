# Shopify Deployment Guide - Anti-Inflammatory Foods Stack Builder

## Required Files for Shopify

### Files to Upload to Assets Folder

| File Name | Shopify Location | Purpose |
|-----------|-----------------|---------|
| **food-stack-builder-data.js** | `/admin/themes/[theme-id]/assets/` | Database containing all 100 foods with evidence scores, serving sizes, synergies, and nutritional data |
| **food-stack-builder.js** | `/admin/themes/[theme-id]/assets/` | Main application logic - handles UI interactions, stack management, search/filter, and export functionality |
| **food-stack-builder.css** | `/admin/themes/[theme-id]/assets/` | Styling for the application - layouts, cards, modals, responsive design, and COR Health branding |
| **lucide.js** | `/admin/themes/[theme-id]/assets/` | Icon library providing all UI icons (search, filter, close, export, etc.) |

### Files to Upload to Templates Folder

| File Name | Shopify Location | Purpose |
|-----------|-----------------|---------|
| **page.foods.liquid** | `/admin/themes/[theme-id]/templates/` | Shopify page template that loads all assets and provides the HTML structure for the application |

## Deployment Steps

### 1. Upload Assets (4 files)
1. Go to **Online Store > Themes > Actions > Edit Code**
2. Navigate to **Assets** folder
3. Click **Add a new asset**
4. Upload each JavaScript and CSS file:
   - `food-stack-builder-data.js`
   - `food-stack-builder.js`
   - `food-stack-builder.css`
   - `lucide.js`

### 2. Create Template (1 file)
1. In the same code editor, navigate to **Templates** folder
2. Click **Add a new template**
3. Choose **page** as template type
4. Name it **foods** (creates `page.foods.liquid`)
5. Replace default content with contents from `page.foods.liquid`

### 3. Create Page in Shopify Admin
1. Go to **Online Store > Pages**
2. Click **Add page**
3. Set page title (e.g., "Anti-Inflammatory Foods Stack Builder")
4. In **Template** dropdown, select **page.foods**
5. Save and publish

### 4. Add to Navigation (Optional)
1. Go to **Online Store > Navigation**
2. Select your main menu
3. Add menu item linking to the new page

## File Descriptions

### food-stack-builder-data.js
- Contains 100 anti-inflammatory foods
- Each food includes:
  - Evidence score (0-10 scale based on research)
  - Anti-inflammatory score (0-10 based on biomarker effects)
  - Serving size recommendations
  - Preparation methods
  - Key compounds and mechanisms
  - Cost estimates
  - Frequency recommendations
- Includes synergy database for food combinations
- Contains diet templates for common health goals

### food-stack-builder.js
- Core application functionality:
  - State management for user selections
  - Search and filter logic
  - Category filtering (8 main categories)
  - Stack building and management
  - LocalStorage for persistence
  - Export functionality (shopping list & meal plan)
  - Synergy detection
  - Modal management for detailed views
  - Diet template application

### food-stack-builder.css
- Complete styling system:
  - COR Health brand colors (rgb(4, 61, 85))
  - DM Sans typography
  - Responsive grid/list layouts
  - Card components
  - Modal styles
  - Mobile-responsive design
  - Smooth transitions and animations
  - Tab navigation styles

### lucide.js
- Provides all application icons:
  - Navigation icons (search, filter, grid, list)
  - Action icons (plus, check, download, trash)
  - Category icons (apple, fish, leaf, etc.)
  - UI feedback icons

### page.foods.liquid
- Shopify integration layer:
  - Loads all required assets
  - Provides HTML structure
  - Includes Shopify header/footer
  - Responsive container setup
  - Tab navigation structure
  - Modal containers

## Verification Checklist

After deployment, verify:
- [ ] All 100 foods appear in browse tab
- [ ] Search functionality works
- [ ] Category filters work (8 categories)
- [ ] Add to Stack button functions
- [ ] Stack calculations update correctly
- [ ] Export Stack downloads text file with shopping list
- [ ] Food synergies display when applicable
- [ ] Diet templates load and apply properly
- [ ] LocalStorage saves stack between sessions
- [ ] Mobile responsive layout works
- [ ] All icons display correctly

## Troubleshooting

### Common Issues

1. **Foods not loading**
   - Check browser console for errors
   - Verify food-stack-builder-data.js uploaded correctly
   - Clear browser cache

2. **Icons not showing**
   - Confirm lucide.js is uploaded
   - Check for console errors
   - Verify lucide.createIcons() is called

3. **Styles not applying**
   - Verify CSS file uploaded
   - Check for theme CSS conflicts
   - Inspect element for style overrides

4. **Page not found**
   - Confirm template is assigned to page
   - Check page visibility settings
   - Verify page is published

## Key Differences from Supplements App

1. **Data Structure**: Foods vs supplements
   - Serving sizes instead of doses
   - Preparation methods instead of timing
   - Synergies instead of interactions

2. **Categories**: 8 food categories vs 11 supplement categories
   - Fatty Fish, Berries, Leafy Greens, etc.

3. **Templates**: Diet templates vs supplement stacks
   - Mediterranean, Brain Health, Joint Support, etc.

4. **Export Format**: Shopping list with categories
   - Organized by food type for grocery shopping

## Notes

- **File Size**: Total assets ~250KB (excluding Shopify theme)
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dependencies**: None (self-contained vanilla JavaScript)
- **Local Storage**: Used for stack persistence (client-side only)
- **Performance**: Loads 100 foods instantly with efficient DOM manipulation

## Testing Before Going Live

1. Test all 8 category filters
2. Add multiple foods to stack
3. Check for synergies (e.g., turmeric + black pepper)
4. Apply a diet template
5. Export stack and verify formatting
6. Clear stack and confirm
7. Test on mobile device
8. Check persistence after page refresh

## SEO Considerations

When creating the Shopify page:
- Use descriptive title: "Anti-Inflammatory Foods Stack Builder | Build Your Healing Diet"
- Add meta description: "Create a personalized anti-inflammatory diet with 100 scientifically-validated foods. Evidence-based scoring, food synergies, and expert diet templates."
- Include relevant keywords in page content

## Contact

For technical support or questions about implementation, refer to the README.md file or contact the development team.

---

*Last Updated: December 2024*
*Version: 1.0 - 100 Foods with Evidence-Based Scoring*