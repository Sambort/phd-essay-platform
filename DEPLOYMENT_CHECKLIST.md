# DigitalOcean Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. Code Repository
- [ ] Push code to GitHub repository
- [ ] Ensure `.do/app.yaml` is configured with your repository URL
- [ ] Update package.json with production settings
- [ ] Test build process locally: `npm run build`

### 2. API Keys & Environment Variables
- [ ] **Stripe**: Get live API keys from dashboard.stripe.com
  - [ ] `STRIPE_SECRET_KEY` (sk_live_...)
  - [ ] `VITE_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
  - [ ] `STRIPE_WEBHOOK_SECRET` (whsec_...)
  - [ ] Create products and get price IDs

- [ ] **PayPal**: Get live credentials from developer.paypal.com
  - [ ] `VITE_PAYPAL_CLIENT_ID`
  - [ ] `PAYPAL_CLIENT_SECRET`
  - [ ] Create subscription plans and get plan IDs

- [ ] **OpenAI**: Get API key from platform.openai.com
  - [ ] `OPENAI_API_KEY` (sk-...)

- [ ] **Email Service**: Get SendGrid API key
  - [ ] `SENDGRID_API_KEY` (SG....)
  - [ ] `EMAIL_FROM` (noreply@yourdomain.com)

- [ ] **Security**: Generate secure secrets
  - [ ] `JWT_SECRET` (random 32+ character string)

### 3. DigitalOcean App Platform Setup
- [ ] Log into DigitalOcean console
- [ ] Create new App from GitHub repository
- [ ] Configure app components (frontend + backend + database)
- [ ] Add all environment variables
- [ ] Set up custom domain

## 🚀 Deployment Steps

### Step 1: GitHub Repository
```bash
# Navigate to your project
cd /path/to/phd-essay-platform

# Initialize and push to GitHub
git init
git add .
git commit -m "Production deployment ready"
git branch -M main
git remote add origin https://github.com/yourusername/phd-essay-platform.git
git push -u origin main
```

### Step 2: Create DigitalOcean App
1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Choose "GitHub" as source
4. Select your repository and main branch
5. Enable auto-deploy

### Step 3: Configure App Components

**Frontend Service:**
- Source: / (root directory)
- Build Command: `npm run build`
- Run Command: `npm run preview`
- HTTP Port: 4173
- Instance Size: Basic ($12/month)

**Backend Service:**
- Source: / (root directory)  
- Build Command: `npm install`
- Run Command: `node server.js`
- HTTP Port: 3001
- Instance Size: Basic ($12/month)
- Routes: `/api/*`

**Database:**
- PostgreSQL 14
- Basic size ($15/month)

### Step 4: Environment Variables

Add these in DigitalOcean App console under each service:

**Frontend Environment Variables:**
```
VITE_API_URL=${backend.PUBLIC_URL}
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
NODE_ENV=production
```

**Backend Environment Variables:**
```
NODE_ENV=production
PORT=3001
DATABASE_URL=${db.DATABASE_URL}
FRONTEND_URL=${frontend.PUBLIC_URL}
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_ESSENTIALS_PRICE_ID=price_essentials_id_here
STRIPE_PRO_PRICE_ID=price_pro_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_here
PAYPAL_ESSENTIALS_PLAN_ID=P-essentials_plan_id_here
PAYPAL_PRO_PLAN_ID=P-pro_plan_id_here
JWT_SECRET=your_secure_jwt_secret_here
OPENAI_API_KEY=sk-your_openai_key_here
SENDGRID_API_KEY=SG.your_sendgrid_key_here
EMAIL_FROM=noreply@yourdomain.com
```

### Step 5: Custom Domain Setup
1. In DigitalOcean App → Settings → Domains
2. Add your domain (e.g., yourdomain.com)
3. Configure DNS records in your domain registrar:
   ```
   Type: CNAME
   Name: @
   Value: your-app-name.ondigitalocean.app
   
   Type: CNAME
   Name: www
   Value: your-app-name.ondigitalocean.app
   ```

### Step 6: Database Schema Setup
```sql
-- Run these commands in your DigitalOcean database console

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_expiry TIMESTAMP,
  essay_count INTEGER DEFAULT 0,
  max_essays INTEGER DEFAULT 2,
  stripe_customer_id VARCHAR(255),
  paypal_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE essays (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  citation_style VARCHAR(50) NOT NULL,
  citation_frequency VARCHAR(10) NOT NULL,
  academic_level VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  payment_type VARCHAR(50) NOT NULL, -- 'subscription' or 'essay'
  stripe_payment_id VARCHAR(255),
  paypal_payment_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255),
  paypal_subscription_id VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_essays_user_id ON essays(user_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
```

## 🧪 Testing Checklist

### Pre-Launch Testing:
- [ ] App deploys successfully
- [ ] Frontend loads on custom domain
- [ ] Backend API responds (test /api/health endpoint)
- [ ] Database connections work
- [ ] User registration/login works
- [ ] Payment processing (both Stripe and PayPal)
- [ ] Essay generation produces content
- [ ] PDF/Word downloads work
- [ ] Mobile responsiveness
- [ ] SSL certificate active (HTTPS working)

### Load Testing:
- [ ] Test with multiple concurrent users
- [ ] Verify auto-scaling works
- [ ] Check database performance
- [ ] Monitor API response times

## 📊 Monitoring Setup

### DigitalOcean Monitoring:
- [ ] Enable app monitoring in console
- [ ] Set up alerts for downtime
- [ ] Configure performance monitoring
- [ ] Set up log aggregation

### Optional External Monitoring:
- [ ] Set up Sentry for error tracking
- [ ] Configure Google Analytics
- [ ] Set up Uptime monitoring (UptimeRobot)

## 💰 Cost Summary

**Monthly Costs:**
- Frontend App: $12/month
- Backend API: $12/month
- PostgreSQL Database: $15/month
- **Total: $39/month**

**One-time Costs:**
- Domain (you already have): $0
- SSL Certificate: FREE
- Setup/Configuration: $0

## 🎯 Launch Strategy

### Soft Launch (Week 1):
- [ ] Deploy to production
- [ ] Test with beta users
- [ ] Monitor for any issues
- [ ] Gather initial feedback

### Public Launch (Week 2+):
- [ ] Announce on social media
- [ ] Start marketing campaigns
- [ ] Monitor user acquisition
- [ ] Scale resources as needed

## 🔒 Security Best Practices

- [ ] All API keys stored as secrets
- [ ] HTTPS enforced
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] CORS configured properly
- [ ] Regular security updates

## 📞 Support & Maintenance

### Weekly Tasks:
- [ ] Monitor app performance
- [ ] Check error logs
- [ ] Review user feedback
- [ ] Update content if needed

### Monthly Tasks:
- [ ] Review and optimize costs
- [ ] Update dependencies
- [ ] Backup verification
- [ ] Performance optimization

---

## 🚨 Emergency Contacts

- **DigitalOcean Support**: Available 24/7 via console
- **Stripe Support**: https://support.stripe.com
- **PayPal Developer Support**: https://developer.paypal.com/support
- **OpenAI Support**: https://help.openai.com

---

**Your platform is production-ready! DigitalOcean App Platform is an excellent choice for hosting your PhD essay writing platform.** 🎉
