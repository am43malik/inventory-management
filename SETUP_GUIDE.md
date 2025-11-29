# Setup Guide for Inventory Shop Management System

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+ installed
- npm 9+
- MongoDB running locally (or MongoDB Atlas cloud)

### 2. Install & Run
```bash
cd inventory-management
npm install --legacy-peer-deps
npm run dev
```

### 3. Access Application
- Open: http://localhost:3000
- You'll be redirected to login page
- Create account via registration page

---

## Detailed Setup

### Step 1: Environment Configuration

Create `.env.local` in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/inventory_shop

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Production Environment:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_shop
JWT_SECRET=strong-production-jwt-secret
NEXTAUTH_SECRET=strong-production-nextauth-secret
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### Step 2: MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update MONGODB_URI in .env.local

### Step 3: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 4: Run Development Server
```bash
npm run dev
```

Server starts at: http://localhost:3000

---

## First Time Usage

### 1. Register an Account
- Navigate to http://localhost:3000/register
- Create account (automatically becomes cashier)

### 2. Make Yourself Admin (Optional)
```bash
# Connect to MongoDB
mongosh

# Use database
use inventory_shop

# Update your user role
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

# Verify
db.users.find()
```

### 3. Create Categories
- Login to application
- Go to Products → Categories (if admin)
- Create categories like: Groceries, Electronics, Clothing, etc.

### 4. Add Products
- Go to Products section
- Click "New Product"
- Fill in details:
  - Name
  - SKU (unique code)
  - Category
  - Cost Price
  - Sale Price
  - Min Stock
- Click Save

### 5. Add Inventory
- Go to Inventory section
- Click "Add Stock"
- Select product
- Enter quantity and cost price
- Optional: Set expiry date
- Save

### 6. Create Sales
- Go to POS section
- Select products and quantities
- Add to cart
- Apply tax/discount if needed
- Select payment method
- Click "Complete Sale"

### 7. View Reports
- Go to Reports section
- Select time period (7, 30, 90 days)
- View charts and analytics
- Export to CSV

---

## Project Features

### Admin Panel
- ✅ Product Management (CRUD)
- ✅ Category Management
- ✅ Inventory Adjustments
- ✅ Inventory Logs & Audit Trail
- ✅ Low Stock Alerts
- ✅ View All Sales
- ✅ Analytics & Reports
- ✅ User Management (future)

### Cashier Panel
- ✅ POS (Point of Sale)
- ✅ View Sales History (own sales)
- ✅ View Reports (read-only)
- ❌ Product Management (restricted)
- ❌ Inventory Adjustments (restricted)

### Features Included
- Real-time Dashboard with charts
- Product search and filtering
- Batch tracking with expiry dates
- Tax and discount calculations
- Multiple payment methods
- Daily and period reports
- CSV export functionality
- Audit logs for inventory changes
- Low stock notifications
- Role-based access control

---

## API Testing

### Using cURL

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### Get Products
```bash
curl http://localhost:3000/api/products \
  -H "Cookie: token=your_jwt_token"
```

#### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token" \
  -d '{
    "name":"Product Name",
    "sku":"SKU123",
    "category":"category_id",
    "costPrice":10,
    "salePrice":15,
    "unit":"pcs",
    "minStock":5
  }'
```

#### Create Sale
```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token" \
  -d '{
    "items":[
      {
        "productId":"product_id",
        "quantity":2,
        "salePrice":15
      }
    ],
    "taxPercentage":5,
    "discount":0,
    "paymentMethod":"cash"
  }'
```

### Using Postman

1. Download Postman: https://www.postman.com/downloads/
2. Create new collection "Inventory Shop"
3. Add requests with authentication
4. Set authorization header with JWT token

---

## Build & Deployment

### Production Build
```bash
npm run build
npm run start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### Deploy to Heroku
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy to Railway.app
```bash
# Install Railway CLI
railway login
railway init
railway up
```

---

## Troubleshooting

### Issue: "Cannot find module 'mongoose'"
**Solution:**
```bash
npm install --legacy-peer-deps mongoose
```

### Issue: "MongoDB connection failed"
**Check:**
1. MongoDB is running: `mongosh`
2. Connection string in .env.local
3. Network access (if using Atlas)

### Issue: "EADDRINUSE: Port 3000 already in use"
**Solution:**
```bash
PORT=3001 npm run dev
# or kill process on port 3000
```

### Issue: "Authentication token invalid"
**Solution:**
1. Clear browser cookies
2. Logout and login again
3. Check JWT_SECRET in .env.local
4. Restart server

### Issue: "Low stock products not showing"
**Check:**
1. Product quantity is below minStock
2. Product batches are properly configured
3. Inventory API is responding

---

## Database Indexing

For optimal performance, these indexes are created automatically:

```javascript
// Products
db.products.createIndex({ sku: 1 })
db.products.createIndex({ category: 1 })
db.products.createIndex({ name: "text", sku: "text" })

// Sales
db.sales.createIndex({ cashier: 1, createdAt: -1 })
db.sales.createIndex({ createdAt: -1 })
db.sales.createIndex({ status: 1 })

// Inventory Logs
db.inventorylogs.createIndex({ productId: 1, createdAt: -1 })
db.inventorylogs.createIndex({ type: 1, createdAt: -1 })
```

---

## Performance Tips

1. **Use Pagination**: Always use limit and page parameters
2. **Filter Data**: Use category and search filters
3. **Batch Operations**: Group inventory adjustments
4. **Cache Results**: Browser caches API responses
5. **Optimize Queries**: Use specific date ranges for reports

---

## Security Best Practices

1. **Change JWT Secret**: Set strong JWT_SECRET for production
2. **Use HTTPS**: Always use HTTPS in production
3. **Secure MongoDB**: Enable authentication on MongoDB
4. **Validate Input**: All inputs are validated with Zod
5. **Hash Passwords**: Passwords are hashed with bcryptjs
6. **Environment Variables**: Never commit .env.local to git

---

## Backup & Recovery

### MongoDB Backup
```bash
# Local backup
mongodump --db inventory_shop --out ./backups

# Restore
mongorestore --db inventory_shop ./backups/inventory_shop
```

### Cloud Backup (Atlas)
- Automatic daily backups enabled
- 35-day retention
- One-click restore capability

---

## Monitoring & Logs

```bash
# View application logs
npm run dev  # Shows server logs

# View MongoDB logs
# Check MongoDB installation logs location
```

---

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- Tailwind CSS: https://tailwindcss.com/docs
- Recharts: https://recharts.org/api
- Mongoose: https://mongoosejs.com/docs

---

## Roadmap & Future Features

- ✅ Core inventory management
- ✅ Point of Sale system
- ✅ Daily reporting
- 🔄 Multi-warehouse support
- 🔄 Barcode scanning
- 🔄 Advanced forecasting
- 🔄 Customer loyalty program
- 🔄 Accounting integration

---

## Contact & Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Contact development team

---

**Last Updated**: November 29, 2025
**Version**: 1.0.0
