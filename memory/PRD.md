# JustPeek Marketing Website - Product Requirements Document

## Original Problem Statement
JustPeek yazılımı için pazarlama ve satış portalı. Temel gereksinimler:
- Kırmızı temalı, karanlık tasarım, premium görünüm
- Kullanıcı kayıt/giriş sistemi (JWT auth)
- Admin paneli (ozanmertgemici34@gmail.com)
- Satın alma talep sistemi (kullanıcı -> admin onay)
- i18n: Türkçe & İngilizce tam dil desteği
- Discord'a yönlendirme

## Architecture
- **Frontend:** React 19, React Router v7, TailwindCSS, Axios, Context API, Recharts
- **Backend:** FastAPI, Motor (async MongoDB), JWT (python-jose), passlib (bcrypt)
- **Database:** MongoDB

## What's Been Implemented

### Phase 1-4: Foundation, Full-Stack, Bug Fixes (Complete)
- Landing page, dark theme, email capture, Discord CTAs
- User registration & login (JWT), Admin panel, Notifications
- F5 refresh fix, bulk delete fix, full i18n coverage

### Phase 5: Order Number System (1 Mar 2026) - COMPLETE
- Unique JP-YYYYMMDD-XXXX format, admin search, user view

### Phase 6: Revenue Flow & Analytics (1 Mar 2026) - COMPLETE
- Revenue flow: pending → approved → completed/cancelled
- Product pricing: 1 Week=$2.99, 1 Month=$6.99, 2 Months=$11.99
- 5 analytics charts (Recharts): daily/monthly revenue, registrations, status/product distribution

### Phase 7: Notifications, Profile & Password Reset (1 Mar 2026) - COMPLETE
- **Notifications:** "Tümünü Sil" (Delete All) + "Okundu" (Mark All Read) buttons
- **Profile Page:** Profile info editing (name, discord) + password change section
- **Password Reset:** Forgot password flow → token generation → new password form
- Login page "Şifremi Unuttum" link

## Purchase Request Status Flow
```
pending → approved → completed (revenue added)
pending → approved → cancelled (no revenue)
pending → rejected (no revenue)
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/me | Current user info |
| PUT | /api/auth/profile | Update profile |
| PUT | /api/auth/change-password | Change password (requires current pw) |
| POST | /api/auth/request-reset | Request password reset (returns token) |
| POST | /api/auth/reset-password | Reset password with token |
| POST | /api/purchase-requests/ | Create purchase request |
| GET | /api/purchase-requests/ | User's requests |
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/analytics | Chart data |
| GET | /api/admin/purchase-requests | All requests (supports ?search=) |
| PUT | /api/admin/purchase-requests/{id}/status | Status update |
| DELETE | /api/admin/purchase-requests/{id} | Delete request |
| GET | /api/admin/users | All users |
| GET | /api/notifications/ | User notifications |
| DELETE | /api/notifications/delete-all | Delete all notifications |
| POST | /api/notifications/mark-all-read | Mark all as read |

## Database Collections
- **users:** name, email, password_hash, role, status, discord_username, created_at
- **purchase_requests:** user_id, email, discord_username, product, message, status, order_number, created_at, updated_at
- **purchases:** user_id, product, price, status, purchased_at, expiry_date
- **notifications:** user_id, title, message, type, read, created_at
- **emails:** email, created_at, status

## Credentials
- Admin: ozanmertgemici34@gmail.com / ozan201223

## Mocked Services
- **Email Service:** Prints to console instead of sending. Reset tokens returned in API response.

## Prioritized Backlog

### P2 - Future
- [ ] Real email notifications (SendGrid/Resend integration)
- [ ] "v6.0 The Ultra" features (ComingSoon.jsx)
- [ ] SEO optimization & social meta tags
- [ ] Activity logs
- [ ] CSV/Excel export for admin
