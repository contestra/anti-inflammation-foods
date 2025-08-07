# Anti-Inflammatory Foods App

A web application for building personalized anti-inflammatory diet protocols based on scientific evidence.

## Features

- **116 Science-Backed Foods**: Comprehensive database of anti-inflammatory foods with evidence scores
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

## Food Categories (11 total)

- Fatty Fish (10 foods)
- Berries (10 foods)
- Leafy Greens (10 foods)
- Nuts & Seeds (10 foods)
- Spices & Herbs (16 foods)
- Healthy Fats (10 foods)
- Beverages (10 foods)
- Cruciferous (10 foods)
- Mushrooms (7 foods)
- Citrus (5 foods)
- Other (9 foods)

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

## Mobile App Deployment (Planned)

### PWA (Progressive Web App) Strategy
The app will be converted to a PWA for mobile app store distribution:

#### Features
- **Offline Support**: Full functionality without internet connection
- **App Store Presence**: Available on iOS App Store and Google Play Store
- **Install Prompt**: Users can install directly from website
- **One Codebase**: Same code serves web, iOS, and Android users
- **Auto Updates**: App updates when website updates (no app store review delays)

#### Implementation Plan
1. **PWA Creation**:
   - Add `manifest.json` for app configuration
   - Add `service-worker.js` for offline caching
   - Add app icons and splash screens
   - Configure installability features

2. **App Store Distribution**:
   - Use PWABuilder to generate app packages
   - Deploy standalone version for mobile (outside Shopify)
   - Submit to Apple App Store ($99/year developer account required)
   - Submit to Google Play Store ($25 one-time developer account required)

#### Mobile App URLs
- **Foods App**: Will be deployed separately for PWA packaging
- **Supplements App**: Companion app with same architecture

#### Technical Stack
- **PWA Wrapper**: PWABuilder (Microsoft's free tool)
- **Hosting**: Netlify/Vercel for standalone mobile versions
- **Store Packages**: .ipa (iOS) and .aab (Android)

#### App Store Approval Requirements
To ensure approval (especially Apple App Store), the PWA will include:

##### Native-Like Features
- **Smooth Animations**: Page transitions, card animations, gesture responses
- **Touch Gestures**: Swipe to delete, pull to refresh, drag to reorder
- **Haptic Feedback**: Vibration on actions (Android)
- **Native UI Elements**: Platform-specific styling (iOS vs Android)
- **Offline Functionality**: Full app works without internet
- **Local Data Persistence**: Save user's diet across sessions

##### Unique Value Beyond Website
- **Daily Reminders**: In-app notifications for meal planning
- **Export Features**: PDF/CSV export of diet plans
- **Personalization**: Save multiple diet profiles
- **Quick Actions**: Long-press shortcuts on app icon
- **Widget Support**: Home screen widgets (Android)
- **Share Functionality**: Share diet plans with others

##### Apple App Store Specific
Apple may reject simple web wrappers. To avoid rejection:
- **Not Just a Website**: Includes features that work better as an app
- **Meaningful Offline**: Full functionality when disconnected
- **Platform Integration**: Uses device features appropriately
- **Performance**: Fast loading, smooth scrolling, no web-like delays
- **Professional Polish**: Custom splash screens, proper app icons, no broken links

## License

Proprietary - CONTESTRA

## Support

For issues or questions, contact CONTESTRA support.