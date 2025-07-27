# Ebby's Bakery - Fresh Sourdough Bread Delivery

A modern React application for ordering fresh sourdough bread and artisanal treats from Ebby's Bakery.

## Features

- 🍞 **Fresh Menu**: Weekly rotating menu of artisanal sourdough breads
- 📍 **Delivery Check**: Pincode-based delivery availability checker
- 🛒 **Shopping Cart**: Add items with quantity controls
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 💳 **COD Payment**: Cash on delivery for easy ordering
- 📋 **Order Management**: Complete order flow with confirmation

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management
- **Supabase** for backend database, authentication, and file storage

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bakery
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase backend:
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md)
   - Create a `.env` file with your Supabase credentials

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5174`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
bakery/
├── src/
│   ├── EbbysBakeryFlow.tsx    # Main application component
│   ├── AdminDashboard.tsx     # Admin dashboard with product management
│   ├── lib/
│   │   └── supabase.ts        # Supabase client configuration
│   ├── services/
│   │   └── database.ts        # Database service layer
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles with Tailwind
├── public/                    # Static assets
├── package.json               # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── supabase-schema.sql       # Database schema
├── SUPABASE_SETUP.md         # Supabase setup guide
└── env.example               # Environment variables template
```

## Features Overview

### Homepage
- Hero section with bakery introduction
- Weekly menu display with product cards
- Pincode delivery checker
- Shopping cart with mini-cart overlay

### Checkout Flow
- Order summary with quantity controls
- Delivery charge calculation (free above ₹500)
- Customer information form with validation
- Order confirmation with tracking details

### Product Management
- Product cards with images, descriptions, and pricing
- **Image upload and management** with drag & drop support
- Best seller and new item badges
- Quantity controls for cart management
- Real-time cart updates

## Delivery Information

- **Order Deadline**: Sunday 11:59 PM for next week delivery
- **Delivery Days**: Wednesday onwards
- **Payment**: Cash on Delivery (COD)
- **Service Areas**: Currently serving select pincodes in Delhi

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Ebby's Bakery** - Bringing fresh sourdough to your doorstep! 🍞✨ 