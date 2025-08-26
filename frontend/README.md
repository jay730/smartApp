# Smart App Frontend

A simple, clean frontend for the Smart App resident management system built with native web components.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── index.html              # Main HTML file
├── src/
│   ├── styles.css          # Global styles
│   ├── components/         # Web components
│   │   ├── resident-form.js    # Form for adding residents
│   │   └── resident-list.js    # List of all residents
│   └── services/           # API services
│       └── resident-service.js  # Backend communication
└── package.json
```

## 🧩 Web Components

### `<resident-form>`
- **Purpose:** Form for adding new residents
- **Features:**
  - Text inputs for name, room number, and date of birth
  - File upload with drag & drop support
  - Form validation
  - Success/error messaging
  - Auto-reset after successful submission

### `<resident-list>`
- **Purpose:** Displays all residents
- **Features:**
  - Shows resident details (name, room, date of birth, files)
  - Refresh button to reload data
  - Delete functionality with confirmation
  - Loading states and empty states
  - Auto-refresh when new residents are added

## 🔧 How It Works

1. **Web Components:** Uses native browser web components (no framework needed!)
2. **Shadow DOM:** Each component has its own isolated styling
3. **Event Communication:** Components communicate via custom events
4. **API Service:** Centralized service for all backend communication
5. **Responsive Design:** Works on desktop and mobile

## 🎨 Styling

- **Modern Design:** Clean, professional look with gradients and shadows
- **Responsive:** Adapts to different screen sizes
- **Interactive:** Hover effects and smooth transitions
- **Accessible:** Proper contrast and keyboard navigation

## 🔌 Backend Integration

The frontend connects to your backend at `http://localhost:5000`. Make sure your backend is running before using the frontend.

## 📝 Features

- ✅ Add new residents with file uploads
- ✅ View all residents in a clean list
- ✅ Delete residents with confirmation
- ✅ Real-time updates when data changes
- ✅ Drag & drop file uploads
- ✅ Responsive design
- ✅ Error handling and user feedback
- ✅ No external dependencies (except axios for API calls)

## 🛠️ Development

- **Hot Reload:** Changes are reflected immediately
- **Console Logging:** Detailed logging for debugging
- **Error Boundaries:** Graceful error handling
- **Code Comments:** Well-documented code for easy understanding

## 🚀 Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized files ready for deployment.

---

**Note:** This frontend is designed to be simple and educational. It uses only vanilla JavaScript and web components, making it perfect for learning modern web development concepts!
