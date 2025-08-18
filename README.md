# 🎴 Mythic


Mythic is a web application that lets you upload an image and instantly generate a trading card. It uses Google’s Gemini AI to analyze the photo, create meaningful stats, assign icons, and generate a short description.



## ✨ Features

### AI-Powered Generation

* Analyzes your image to understand its content
* Creates 4 unique stats based on categories (human, animal, object, food, random)
* Generates a short backstory or description
* Assigns card rarity (common, rare, legendary, etc.)

### Visuals & Icons

* Automatically selects from 40+ icons that best match your stats
* Smooth animations and responsive design
* Works on desktop, tablet, and mobile

### Progressive Web App (PWA)

* Can be installed and used like a mobile app
* Works offline after installation
* Supports both file upload and direct camera capture


## 🚀 Quick Start

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

---

## 🎮 How to Use

1. Upload or capture a photo
2. Let the AI analyze and generate stats
3. View your card with rarity, icons, and description
4. Tap or click for detailed information



## 🛠️ Technical Overview

* **Framework**: Next.js 15
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Animations**: Framer Motion
* **UI Components**: shadcn/ui
* **AI Integration**: Google Gemini via Genkit


## 📦 Deployment

### Recommended: Vercel

* Fork the repository
* Connect to Vercel
* Add environment variables
* Deploy directly

### Other Options

* Docker container
* Manual server deployment

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make changes and test them
4. Submit a pull request


## 📄 License

Open source. Free to use and modify.

## 📷 Screenshots
---
