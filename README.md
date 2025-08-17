# LinkShare - WhatsApp Groups Directory

LinkShare is a modern web platform for discovering and sharing WhatsApp group links. Built with React, TypeScript, Express.js, and ready for Vercel deployment.

## 🚀 Features

- **Group Discovery**: Browse WhatsApp groups by category, country, and search
- **Smart Metadata Extraction**: Automatically extracts group names and images from WhatsApp links
- **Dual View Modes**: Switch between grid and list views
- **Real-time Stats**: Track views, timestamps, and group popularity
- **Responsive Design**: Works perfectly on mobile and desktop
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Wouter** for lightweight routing
- **TanStack Query** for data fetching and caching
- **shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **Node.js** serverless functions for Vercel
- **Drizzle ORM** for database operations
- **Cheerio** for web scraping and metadata extraction
- **Zod** for schema validation

## 🌐 Deployment on Vercel

This project is configured for seamless Vercel deployment:

### Quick Deploy

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/linkshare.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the configuration
   - The build will run automatically

### Manual Build
```bash
npm install
npm run build
```

### Environment Variables

Set these in your Vercel dashboard:

- `NODE_ENV=production`
- Add any additional API keys or database URLs as needed

## 🚀 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   cd client && npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
linkshare/
├── api/                    # Vercel API routes
│   ├── groups/
│   │   ├── index.ts       # Groups CRUD operations
│   │   └── [id]/view.ts   # View count tracking
│   ├── extract-metadata.ts# WhatsApp link metadata extraction
│   └── stats.ts           # Application statistics
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── server/                # Express.js backend (for local dev)
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage layer
├── shared/                # Shared TypeScript schemas
│   └── schema.ts          # Zod schemas and types
├── vercel.json            # Vercel deployment configuration
└── package.json           # Root dependencies
```

## 🔧 Key Features Implementation

### Metadata Extraction
- Automatically scrapes WhatsApp group links
- Extracts group names and profile images
- Falls back to smart name generation based on group codes

### Dual View Modes
- **Grid View**: Card-based layout with large images
- **List View**: Compact layout with profile-style circular images

### Search & Filtering
- Real-time search across group titles and descriptions
- Filter by category (Education, Business, Technology, etc.)
- Filter by country with flag indicators
- Sort by recency, popularity, and alphabetical order

### Data Management
- Type-safe schemas with Zod validation
- In-memory storage for development
- Easy migration to PostgreSQL for production

## 🎨 Design System

- **Colors**: WhatsApp-inspired green theme
- **Typography**: Inter font family
- **Components**: Consistent shadcn/ui design system
- **Icons**: Lucide React icons
- **Responsive**: Mobile-first approach

## 🔗 API Endpoints

- `GET /api/groups` - Fetch groups with optional filters
- `POST /api/groups` - Create new group
- `POST /api/groups/:id/view` - Increment view count
- `POST /api/extract-metadata` - Extract metadata from WhatsApp links
- `GET /api/stats` - Get application statistics

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please open an issue on GitHub.