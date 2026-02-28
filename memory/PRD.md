# JustPeek Marketing Website - Product Requirements Document

## Original Problem Statement
Kullanıcı, geliştirdiği JustPeek yazılımını pazarlamak için bir katalog websitesi istiyor. Site özellikleri:
- Kullanıcıları Discord'a yönlendirerek satın alma sağlanacak
- E-posta adresi toplanacak (yönetici erişimi ile)
- Kırmızı temalı, şık ve ilgi çekici tasarım
- Tek sayfa yapısı
- Fiyatlandırma belirtilmeyecek, Discord vurgusu yapılacak
- JustPeek için özel logo tasarımı

## Implemented Features (28 Aralık 2024)

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
