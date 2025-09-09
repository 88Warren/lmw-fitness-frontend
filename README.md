# LMW Fitness Frontend

A modern React application for the LMW Fitness platform, providing an intuitive interface for fitness programs, payments, and user engagement.

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Payment Integration**: Stripe checkout for workout programs
- **Interactive UI**: Framer Motion animations and Lottie animations
- **Newsletter Signup**: reCAPTCHA protected subscription
- **Modern Stack**: React 19, Vite, and modern tooling

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion, Lottie
- **Icons**: Lucide React, React Icons
- **HTTP Client**: Axios
- **Testing**: Vitest, Testing Library
- **Deployment**: Docker, Nginx

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

1. **Clone and setup**:
   ```bash
   git clone <repository>
   cd frontend
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   VITE_BACKEND_URL=http://localhost:8082
   VITE_RECAPTCHA_SITE_KEY=your_recaptcha_key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test -- --watch
```

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── styles/             # Global styles
├── test/               # Test utilities and setup
└── App.jsx             # Main application component
```

## Key Components

### Payment Flow
- Stripe integration for secure payments
- Multiple pricing tiers (Beginner, Advanced, Coaching)
- Checkout session management

### Newsletter System
- reCAPTCHA protected signup
- Email validation
- Success/error feedback

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Consistent spacing and typography

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_BACKEND_URL` | Backend API URL | Yes |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA site key | Yes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `VITE_BEGINNER_PRICE_ID` | Stripe price ID for beginner program | Yes |
| `VITE_ADVANCED_PRICE_ID` | Stripe price ID for advanced program | Yes |

## Deployment

### Docker

```bash
# Build Docker image
docker build -t lmw-fitness-frontend .

# Run container
docker run -p 5052:5052 lmw-fitness-frontend
```

### Production Considerations

- **SSL/TLS**: Nginx configuration includes SSL termination
- **Caching**: Static assets cached with appropriate headers
- **Compression**: Gzip compression enabled
- **Security Headers**: CSP and security headers configured

## Performance Optimization

- **Code Splitting**: Automatic route-based splitting with Vite
- **Image Optimization**: Responsive images and lazy loading
- **Bundle Analysis**: Use `npm run build -- --analyze`
- **Lighthouse Scores**: Target 90+ for all metrics

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Write tests for new components
3. Update documentation
4. Ensure accessibility compliance
5. Test on multiple devices/browsers

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance (WCAG 2.1 AA)
- Screen reader compatibility

## Security

- Environment variables for sensitive data
- Input sanitization
- XSS protection
- CSRF protection via SameSite cookies
- Content Security Policy headers
