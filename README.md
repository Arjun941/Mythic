
![Mythic](https://i.ibb.co/fK8761f/image.png)


# Mythic!

Ever imagined your cat as a dimension-hopping demigod? Stop wondering. Mythic lets you turn your everyday clicks into cool looking Pokémon cards.

Hosted [here](http://mythicdex.vercel.app)


## ✨ Features

### AI-Powered Generation

* Analyzes your image to understand its content
* Creates 4 unique stats based on categories (human, animal, object, food, random)
* Generates custom lore and weird facts
* Assigns card rarity (common, rare, legendary, etc.)

### Visuals,Music & Icons

* Automatically selects from 40+ icons that best match your stats
* Smooth animations and responsive design
* Works on desktop, tablet, and mobile
* OG Pokemon music from Pokemon X/Y (Kalos Region)
* Nintendo-inspired SFX when clicking buttons

### Progressive Web App (PWA)

* Can be installed and used like a mobile app
* Works offline after installation
* Supports both file upload and direct camera capture


## 🚀 Quick Start for local development

### Requirements

* Node.js 18 or later
* Google AI API Key (Gemini)
* A modern web browser

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Arjun941/Mythic.git
   cd Mythic
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the project root and add:

   ```env
   GEMINI_API_KEY=your_google_ai_api_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open the app**
   Go to [http://localhost:9002](http://localhost:9002) in your browser.

### Project Structure

```
src/
├── ai/                           # AI integration and flows
│   ├── flows/                    # Genkit AI processing flows
│   │   ├── analyze-image-generate-stats-lore.ts  # Main AI card generation
│   │   ├── generate-lore-description.ts          # Lore generation helper
│   │   └── validate-api-key.ts                   # API key validation
│   ├── dev.ts                    # Development AI server
│   ├── genkit.ts                 # AI configuration and setup
│   └── schemas.ts                # Data validation schemas
├── app/                          # Next.js app router pages
│   ├── create/                   # Card creation page
│   ├── offline/                  # Offline support page
│   ├── globals.css               # Global styles and themes
│   ├── layout.tsx                # Root layout with PWA config
│   └── page.tsx                  # Landing page
├── components/                   # React UI components
│   ├── ui/                       # Reusable UI primitives (buttons, dialogs, etc.)
│   ├── card-creator.tsx          # Main card creation interface
│   ├── card-details-dialog.tsx   # Detailed card view modal
│   ├── landing-hero.tsx          # Homepage hero section
│   ├── loading-animation.tsx     # Loading states and spinners
│   ├── mythic-card.tsx           # Card display component
│   └── pokedex-frame.tsx         # Pokemon-style frame wrapper
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx            # Mobile device detection
│   └── use-toast.ts              # Toast notification system
└── lib/                          # Utilities and helpers
    ├── icon-mapping.ts           # Dynamic icon assignment system
    ├── types.ts                  # TypeScript type definitions
    └── utils.ts                  # Common utility functions
```


## 🎮 How to Use

1. Upload or capture a photo
2. Let the AI analyze and generate stats
3. View your card with rarity, icons, and description
4. Tap or click for detailed info like advanced stats and lore



## 🛠️ Technical Overview

* **Framework**: Next.js 15
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Animations**: Framer Motion
* **UI Components**: shadcn/ui
* **AI Integration**: Google Gemini via Genkit


## 📦 Deployment

* Fork the repository
* Connect to your preferred hosting provider
* Add environment variables
* Deploy directly

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make changes and test them
4. Submit a pull request


## 📄 License

MIT License

Copyright (c) 2025 Arjun TK

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 📷 Screenshots
TBA
