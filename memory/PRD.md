# JustPeek Marketing Website - Product Requirements Document

## Original Problem Statement
JustPeek yazılımı için pazarlama ve satış portalı. Temel gereksinimler:
- Kırmızı temalı, karanlık tasarım, premium görünüm
- Kullanıcı kayıt/giriş sistemi (JWT auth)
- Admin paneli (ozanmertgemici34@gmail.com)
- Satın alma talep sistemi (kullanıcı -> admin onay)
- i18n: Türkçe & İngilizce tam dil desteği
- Fiyatlandırma: Planları herkese göster, fiyatları giriş yapmayana gizle
- Discord'a yönlendirme

## Architecture
- **Frontend:** React 19, React Router v7, TailwindCSS, Axios, Context API (Auth + Language)
- **Backend:** FastAPI, Motor (async MongoDB), JWT (python-jose), passlib (bcrypt)
- **Database:** MongoDB

## What's Been Implemented

### Phase 1-2: Foundation (Complete)
- Landing page with stealth logo, hero, features, security sections
- Dark theme with red accents (#DC143C)
- Email capture form
- Discord CTAs

### Phase 3: Full-Stack (Complete)
- User registration & login (JWT-based)
- Admin panel with tabs (Overview, Users, Emails, Purchase Requests)
- Purchase request system (user submits, admin approves/rejects)
- Notification system (on-site)
- Role-based access control

### Phase 4: Bug Fixes (28 Feb 2026) - COMPLETE
- **P0 FIXED:** F5 refresh no longer logs out users (AuthProvider loading guard)
- **P1 FIXED:** Admin bulk delete, approve/reject now work (functions moved inside component)
- **P2 FIXED:** Full i18n coverage (Features, Security, EmailCapture use translations)
- **P2 FIXED:** Pricing shows plans to all, hides prices from logged-out users

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/me | Current user info |
| PUT | /api/auth/profile | Update profile |
| POST | /api/auth/request-reset | Request password reset |
| POST | /api/auth/reset-password | Reset password |
| GET | /api/purchases/ | User purchases |
| POST | /api/purchase-requests/ | Create purchase request |
| GET | /api/purchase-requests/ | User's requests |
| GET | /api/admin/users | All users (admin) |
| PUT | /api/admin/users/{id}/ban | Ban user |
| PUT | /api/admin/users/{id}/unban | Unban user |
| DELETE | /api/admin/users/{id} | Delete user |
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/purchase-requests | All requests (admin) |
| PUT | /api/admin/purchase-requests/{id}/status | Approve/reject |
| DELETE | /api/admin/purchase-requests/{id} | Delete request |
| POST | /api/emails/ | Save email |
| GET | /api/emails/ | All emails (admin) |
| DELETE | /api/admin/emails/{id} | Delete email |
| GET | /api/notifications/ | User notifications |
| PUT | /api/notifications/{id}/read | Mark as read |

## Database Collections
- **users:** name, email, password_hash, role, status, created_at
- **purchase_requests:** user_id, email, discord_username, product, message, status
- **purchases:** user_id, product, price, status, purchased_at, expiry_date
- **notifications:** user_id, title, message, type, read, created_at
- **emails:** email, created_at, status

## Credentials
- Admin: ozanmertgemici34@gmail.com / ozan201223
- Discord: https://discord.gg/Z2MdBahqcN

## Prioritized Backlog

### P1 - Next
- [ ] Profile editing page (UI exists but needs polish)
- [ ] Password reset flow (backend exists, needs email service)

### P2 - Future
- [ ] Email notifications (SendGrid/similar integration)
- [ ] Advanced admin analytics with charts
- [ ] SEO optimization
- [ ] Social media meta tags
- [ ] Activity logs
