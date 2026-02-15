# grow O'Clock Backend

Production-ready Django REST Framework backend for the **grow O'Clock** financial services platform.

## Tech Stack

- **Django 5.0+** with Django REST Framework
- **PostgreSQL** (SQLite fallback in development)
- **Redis** for caching, Celery broker, and WebSocket channel layer
- **Celery + Beat** for async tasks and scheduled jobs
- **Django Channels** for real-time WebSocket notifications
- **JWT Authentication** via `djangorestframework-simplejwt`
- **drf-spectacular** for OpenAPI 3.0 documentation
- **Docker & Docker Compose** for containerized deployment

## Project Structure

```
backend/
├── backend/                 # Core project package
│   ├── settings/
│   │   ├── base.py          # Shared settings
│   │   ├── development.py   # Dev overrides (SQLite, DEBUG=True)
│   │   └── production.py    # Production settings (Sentry, HTTPS)
│   ├── celery.py            # Celery configuration
│   ├── urls.py              # Root URL configuration
│   ├── wsgi.py / asgi.py    # WSGI/ASGI entry points
├── apps/
│   ├── accounts/            # Custom user, profiles, auth
│   ├── consultations/       # Consultation booking & management
│   ├── financial_planning/  # Financial plans, goals, calculators
│   ├── investments/         # Portfolio & holdings tracking
│   ├── blog/                # Blog posts, categories, tags
│   ├── contact/             # Contact form & admin responses
│   ├── careers/             # Job positions & applications
│   ├── documents/           # Secure document management
│   ├── notifications/       # Real-time notifications (WebSocket)
│   └── analytics/           # Dashboard stats, audit logs
├── utils/                   # Shared utilities
├── templates/emails/        # HTML email templates
├── tests/                   # pytest test suite
├── requirements/            # Split requirements files
├── Dockerfile               # Multi-stage production build
├── docker-compose.yml       # Full stack orchestration
└── manage.py
```

## Quick Start (Development)

### 1. Clone & Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements/development.txt
```

### 2. Environment Variables

```bash
copy .env.example .env
# Edit .env with your settings
```

### 3. Database Setup

```bash
python manage.py makemigrations accounts consultations financial_planning investments blog contact careers documents notifications analytics
python manage.py migrate
python manage.py createsuperuser
```

### 4. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/v1/`

### 5. API Documentation

- **Swagger UI**: http://localhost:8000/api/v1/docs/
- **ReDoc**: http://localhost:8000/api/v1/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/v1/schema/

## Docker Deployment

```bash
# Build and start all services
docker-compose up -d --build

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# View logs
docker-compose logs -f backend
```

## API Endpoints

| Prefix                     | App                | Description                                           |
| -------------------------- | ------------------ | ----------------------------------------------------- |
| `/api/v1/auth/`            | Accounts           | Register, login, logout, verify email, password reset |
| `/api/v1/users/`           | Accounts           | Profile, preferences, avatar, account management      |
| `/api/v1/consultations/`   | Consultations      | CRUD, reschedule, document upload                     |
| `/api/v1/financial-plans/` | Financial Planning | Plans, goals, income, expenses, assets, liabilities   |
| `/api/v1/calculators/`     | Financial Planning | Compound interest, retirement, loan, investment, tax  |
| `/api/v1/portfolios/`      | Investments        | Portfolios, holdings, performance, analytics          |
| `/api/v1/blog/`            | Blog               | Posts, categories, tags (public read, admin write)    |
| `/api/v1/contact/`         | Contact            | Public submit, admin manage & respond                 |
| `/api/v1/careers/`         | Careers            | Public positions, apply, admin management             |
| `/api/v1/documents/`       | Documents          | Upload, download, share, manage                       |
| `/api/v1/notifications/`   | Notifications      | List, read, mark, WebSocket real-time                 |
| `/api/v1/analytics/`       | Analytics          | Dashboard, user stats, audit logs                     |

## Authentication

Uses JWT tokens. Include the access token in requests:

```
Authorization: Bearer <access_token>
```

- Access token lifetime: **60 minutes**
- Refresh token lifetime: **7 days**
- Token refresh: `POST /api/v1/auth/token/refresh/`

## Celery Tasks

Scheduled tasks (via Celery Beat):

- **Consultation reminders** — every hour
- **Portfolio value updates** — daily at 9:00 AM
- **Expired token cleanup** — daily at midnight
- **Old notification cleanup** — daily at 1:00 AM

Start Celery worker and beat:

```bash
celery -A backend worker -l info
celery -A backend beat -l info
```

## Running Tests

```bash
pytest
pytest --cov=apps --cov-report=html
```

## Environment Variables

See `.env.example` for all available configuration options including:

- Database connection
- Redis URL
- Email settings (SMTP)
- JWT settings
- AWS S3 (optional)
- Sentry DSN (production)
- CORS origins

## License

Proprietary — grow O'Clock. All rights reserved.
