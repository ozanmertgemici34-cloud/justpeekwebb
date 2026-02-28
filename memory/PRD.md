# JustPeek Marketing Website - Product Requirements Document

## Original Problem Statement
Kullanıcı, geliştirdiği JustPeek yazılımını pazarlamak için bir katalog websitesi istiyor. Site özellikleri:
- Kullanıcıları Discord'a yönlendirerek satın alma sağlanacak
- E-posta adresi toplanacak (yönetici erişimi ile)
- Kırmızı temalı, şık ve ilgi çekici tasarım
- Tek sayfa yapısı
- "Internal" ibaresi kaldırıldı
- JustPeek için özel stealth/gizlilik temalı logo (göz + gölge motifleri)
- İngilizce ve Türkçe dil desteği
- Kullanıcı kayıt ve giriş sistemi (e-posta + şifre)
- Satın alma geçmişi takibi
- Admin: ozanmertgemici34@gmail.com / ozan201223
- Gelişmiş admin paneli (user management, ban, istatistikler)

## Update History

### Phase 1: Initial Frontend (28 Aralık 2024)
✅ Landing page with ghost logo
✅ 6 features, security section, email form
✅ Basic admin panel (/admin)
✅ Mock data implementation

### Phase 2: Major Updates (28 Aralık 2024 - Akşam)
✅ **New Stealth Logo** - Göz ve gölge motifleri ile yeniden tasarlandı
✅ **"Internal" Removed** - Tüm siteden kaldırıldı
✅ **i18n System** - Türkçe & İngilizce dil desteği
  - LanguageContext & translations.js
  - Navbar'da bayrak değiştirici (🇹🇷 🇺🇸)
✅ **Auth System** - Kayıt & Giriş sayfaları
  - Login.jsx
  - Register.jsx  
  - AuthContext for state management
✅ **Purchase History** - Satın alımları görüntüleme sayfası
  - PurchaseHistory.jsx
  - Mock purchase data
✅ **Updated Components**
  - Navbar (auth buttons, language switcher, user menu)
  - Hero (dil desteği, "Internal" kaldırıldı)
  - Footer (dil desteği)
  - All components updated with i18n

## Current Features (Mock Data)

### User-Facing Features
1. **Multi-language Support** (TR/EN)
2. **Authentication System**
   - Register with name, email, password
   - Login with email, password
   - User session management (localStorage)
   - Role-based access (user/admin)
3. **Purchase History Page**
   - View past purchases
   - Status tracking (active/expired/pending)
   - Expiry dates
4. **Landing Page**
   - New stealth logo
   - Hero section
   - 6 feature cards
   - Security showcase
   - Email capture form
   - Discord CTAs everywhere

### Admin Features
1. **Admin Panel** (/admin)
   - Email list management
   - User management (planned)
   - Statistics dashboard (planned)
   - Ban/unban system (planned)

## Mock Data Structure

```javascript
// Users (mock.js)
mockUsers = [
  {
    id: 1,
    name: "Ozan Mert Gemici",
    email: "ozanmertgemici34@gmail.com",
    password: "ozan201223",
    role: "admin",
    registered: "2024-12-01",
    status: "active",
    purchases: 5
  },
  // ... more users
]

// Purchases
mockPurchases = [
  {
    id, userId, product, price, date, status, expiryDate
  }
]

// Emails  
mockEmails = [
  { id, email, date, status }
]
```

## Architecture

### Frontend Stack
- React 19.0.0
- React Router v7.5.1
- Context API (Language, Auth)
- Tailwind CSS
- Lucide React (icons)
- i18n (translations.js)

### Backend Stack (To Be Implemented)
- FastAPI
- MongoDB
- JWT Authentication
- Password hashing (passlib)

### Current Status
- Frontend: ✅ Complete with mock data + i18n + auth
- Backend: ⏳ Not started
- Database: ⏳ Not started

## API Contracts (To Be Implemented)

### Authentication Endpoints

#### 1. Register
**POST /api/auth/register**
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 2. Login
**POST /api/auth/login**
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 3. Get Current User
**GET /api/auth/me**
```json
Headers: { "Authorization": "Bearer <token>" }

Response:
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Purchase Endpoints

#### 1. Get User Purchases
**GET /api/purchases**
```json
Headers: { "Authorization": "Bearer <token>" }

Response:
{
  "success": true,
  "purchases": [
    {
      "id": "uuid",
      "product": "JustPeek - 1 Month",
      "price": "$29.99",
      "date": "2024-12-20",
      "status": "active",
      "expiryDate": "2025-01-20"
    }
  ]
}
```

### Email Collection
**POST /api/emails**
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Email saved successfully"
}
```

### Admin Endpoints

#### 1. Get All Users
**GET /api/admin/users**
```json
Headers: { "Authorization": "Bearer <admin_token>" }

Response:
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "registered": "2024-12-20",
      "status": "active",
      "purchases": 2
    }
  ]
}
```

#### 2. Ban/Unban User
**PUT /api/admin/users/:id/ban**
```json
Headers: { "Authorization": "Bearer <admin_token>" }
Request:
{
  "action": "ban" // or "unban"
}

Response:
{
  "success": true,
  "message": "User banned successfully"
}
```

#### 3. Delete User
**DELETE /api/admin/users/:id**
```json
Headers: { "Authorization": "Bearer <admin_token>" }

Response:
{
  "success": true,
  "message": "User deleted"
}
```

#### 4. Get Statistics
**GET /api/admin/stats**
```json
Headers: { "Authorization": "Bearer <admin_token>" }

Response:
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "activeUsers": 145,
    "totalEmails": 200,
    "todayRegistrations": 5,
    "totalRevenue": "$4,500"
  }
}
```

## MongoDB Schema

```python
# Users Collection
{
  "_id": ObjectId,
  "name": String (required),
  "email": String (unique, required),
  "password_hash": String (required),
  "role": String (default: "user"), # "user" or "admin"
  "status": String (default: "active"), # "active" or "banned"
  "created_at": DateTime,
  "updated_at": DateTime
}

# Purchases Collection
{
  "_id": ObjectId,
  "user_id": ObjectId (ref: Users),
  "product": String (required),
  "price": String (required),
  "status": String (default: "active"), # "active", "expired", "pending"
  "purchased_at": DateTime,
  "expiry_date": DateTime
}

# Emails Collection  
{
  "_id": ObjectId,
  "email": String (unique, required),
  "created_at": DateTime,
  "status": String (default: "active"),
  "ip_address": String (optional),
  "user_agent": String (optional)
}
```

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Backend Authentication API
  - [ ] Register endpoint with password hashing
  - [ ] Login endpoint with JWT
  - [ ] JWT middleware for protected routes
- [ ] MongoDB Integration
  - [ ] User schema & model
  - [ ] Purchase schema & model
  - [ ] Email schema & model
- [ ] Frontend-Backend Integration
  - [ ] Replace mock auth with real API
  - [ ] Replace mock purchases with real API
  - [ ] Add error handling & validation

### P1 - Important
- [ ] Admin Panel Backend
  - [ ] User management endpoints
  - [ ] Ban/unban functionality
  - [ ] Statistics endpoint
  - [ ] Email management endpoints
- [ ] Enhanced Admin UI
  - [ ] User list with search/filter
  - [ ] Ban/unban buttons
  - [ ] Statistics dashboard with charts
  - [ ] Email export (CSV/JSON)
- [ ] Purchase System
  - [ ] Discord webhook integration for purchases
  - [ ] Manual purchase creation (admin)
  - [ ] Email notifications

### P2 - Nice to Have
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Profile page for users
- [ ] Purchase download (license keys)
- [ ] Activity logs
- [ ] Two-factor authentication
- [ ] Social login (Discord OAuth)
- [ ] SEO optimization
- [ ] Analytics integration

## Technical Notes
- Discord Link: https://discord.gg/Z2MdBahqcN
- Admin: ozanmertgemici34@gmail.com / ozan201223
- Demo User: test@example.com / test123
- Red theme: #DC143C, #FF1744, #C62828
- Font: Inter (Google Fonts)
- Default language: Turkish (tr)
- Languages supported: Turkish (tr), English (en)

## Success Metrics
- User registration rate
- Email collection rate
- Discord join rate
- Purchase conversion rate
- Page engagement time
- Language preference distribution

### ✅ Frontend (Mock Data ile Tamamlandı)
1. **Home Page - Landing Page**
   - Hero section with custom JustPeek ghost logo (kırmızı temalı)
   - Animated background effects
   - Discord CTA buttons
   - Smooth scroll navigation

2. **Features Section**
   - 6 ana özellik kartı (3x2 grid)
   - Kusursuz Aimbot & Hedef Takibi
   - Taktiksel Görüş Sistemi (ESP)
   - Akıllı Triggerbot
   - Profesyonel Sekme Kontrolü (RCS)
   - Farkındalık Paneli (Spectator List)
   - Efsanevi Stealth Koruması

3. **Security Section**
   - "Hayalet İmza" vurgusu
   - Sıfır İz, Dijital Kamuflaj, Tam Gizlilik özellikleri
   - Visual shield animation
   - Stats showcase (100% Gizlilik, 0 İz, 24/7 Koruma)

4. **Email Capture Section**
   - E-posta toplama formu (mock validation)
   - Discord CTA with official Discord button
   - Success/error states

5. **Admin Panel** (/admin)
   - Password protected (demo: admin123)
   - E-posta listesi görüntüleme
   - Export emails functionality
   - Delete emails
   - Stats dashboard

6. **Design Elements**
   - Dark theme (#0a0a0a, #1a1a1a)
   - Red accents (#DC143C, #FF1744)
   - Glassmorphism effects
   - Smooth animations & hover effects
   - Inter font family
   - Custom scrollbar (red themed)
   - Mobile responsive navbar

## Architecture

### Frontend Stack
- React 19.0.0
- React Router v7.5.1
- Tailwind CSS
- Lucide React (icons)
- Axios (API calls)

### Current Status
- Frontend: ✅ Complete with mock data
- Backend: ⏳ Not started
- Database: ⏳ Not started

## Mock Data Structure
```javascript
// E-posta collection (mock.js)
mockEmails = [
  { id, email, date, status }
]

// Features data
features = [
  { id, icon, title, description, gradient }
]

// Security features
securityFeatures = [
  { id, title, description }
]
```

## Next Phase: Backend Development

### API Contracts (To Be Implemented)

#### 1. Email Collection
**POST /api/emails**
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "E-posta başarıyla kaydedildi",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-12-28T10:00:00Z"
  }
}
```

#### 2. Get All Emails (Admin)
**GET /api/emails**
```json
Headers: { "Authorization": "Bearer <token>" }

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2024-12-28T10:00:00Z",
      "status": "active"
    }
  ]
}
```

#### 3. Delete Email (Admin)
**DELETE /api/emails/:id**
```json
Headers: { "Authorization": "Bearer <token>" }

Response:
{
  "success": true,
  "message": "E-posta silindi"
}
```

#### 4. Admin Authentication
**POST /api/auth/login**
```json
Request:
{
  "password": "admin_password"
}

Response:
{
  "success": true,
  "token": "jwt_token",
  "expires_in": 3600
}
```

### MongoDB Schema

```python
# Email Collection
{
  "_id": ObjectId,
  "email": String (unique, required),
  "created_at": DateTime,
  "status": String (default: "active"),
  "ip_address": String (optional),
  "user_agent": String (optional)
}

# Admin Users Collection
{
  "_id": ObjectId,
  "username": String,
  "password_hash": String,
  "created_at": DateTime
}
```

## Prioritized Backlog

### P0 - Must Have (Next Sprint)
- [ ] Backend API implementation
  - [ ] Email collection endpoint
  - [ ] Admin authentication
  - [ ] Get emails endpoint
  - [ ] Delete email endpoint
- [ ] MongoDB integration
  - [ ] Email schema
  - [ ] Admin user schema
- [ ] Frontend-Backend integration
  - [ ] Replace mock data with real API calls
  - [ ] Add proper error handling
  - [ ] Implement JWT authentication for admin panel

### P1 - Should Have
- [ ] Email validation & duplicate prevention
- [ ] Rate limiting for email submissions
- [ ] Admin panel enhancements
  - [ ] Pagination for email list
  - [ ] Search/filter emails
  - [ ] Bulk delete
- [ ] Analytics
  - [ ] Track page visits
  - [ ] Track Discord link clicks
  - [ ] Email conversion rate

### P2 - Nice to Have
- [ ] Email notification to admin on new email submission
- [ ] Export emails in multiple formats (CSV, JSON)
- [ ] Dark/Light theme toggle
- [ ] Multi-language support (EN/TR)
- [ ] Admin dashboard with charts
- [ ] SEO optimization
- [ ] Social media meta tags

## User Personas

### Primary User: Potential Customers
- Gaming enthusiasts looking for cheat software
- Want to see features before purchase
- Need to join Discord to buy
- Age: 16-30
- Tech-savvy

### Secondary User: Admin (Owner)
- Needs to collect and manage email leads
- Track interest and conversions
- Communicate with potential customers
- Manage Discord community

## Success Metrics
- Email collection rate
- Discord join rate
- Page engagement time
- Feature section interaction

## Technical Notes
- Discord Link: https://discord.gg/Z2MdBahqcN
- Admin Panel: /admin (password: admin123 - demo)
- Red theme colors: #DC143C, #FF1744, #C62828
- Font: Inter (Google Fonts)
