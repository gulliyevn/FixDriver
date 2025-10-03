#!/bin/bash

# 🚀 FixDrive CI/CD Setup Script
# Этот скрипт настраивает все необходимые компоненты для идеального CI/CD

set -e

echo "🚀 Setting up FixDrive CI/CD..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для логирования
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка наличия необходимых инструментов
check_dependencies() {
    log "🔍 Checking dependencies..."
    
    # Проверяем Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Проверяем npm
    if ! command -v npm &> /dev/null; then
        error "npm is not installed. Please install npm"
        exit 1
    fi
    
    # Проверяем git
    if ! command -v git &> /dev/null; then
        error "git is not installed. Please install git"
        exit 1
    fi
    
    success "All dependencies are available"
}

# Установка необходимых пакетов
install_packages() {
    log "📦 Installing CI/CD packages..."
    
    # Устанавливаем глобальные пакеты для CI/CD
    npm install -g @expo/cli@latest
    npm install -g eas-cli@latest
    
    # Устанавливаем локальные пакеты для аудита
    npm install --save-dev audit-ci
    
    success "CI/CD packages installed"
}

# Настройка Git hooks
setup_git_hooks() {
    log "🪝 Setting up Git hooks..."
    
    # Создаем директорию для hooks
    mkdir -p .git/hooks
    
    # Pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🔍 Running pre-commit checks..."

# TypeScript check
echo "📝 TypeScript check..."
npx tsc --noEmit

# ESLint check
echo "🧹 ESLint check..."
npx eslint . --ext .js,.jsx,.ts,.tsx --max-warnings 0

# Prettier check
echo "💅 Prettier check..."
npx prettier --check .

echo "✅ Pre-commit checks passed!"
EOF
    
    # Делаем hook исполняемым
    chmod +x .git/hooks/pre-commit
    
    success "Git hooks configured"
}

# Настройка environment variables
setup_env_vars() {
    log "🔧 Setting up environment variables..."
    
    # Создаем .env.example
    cat > .env.example << 'EOF'
# API Configuration
API_BASE_URL=https://api.fixdrive.com
API_TIMEOUT=30000

# Authentication
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=24h

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fixdrive

# External Services
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# CI/CD Secrets (set these in GitHub/GitLab)
SLACK_WEBHOOK=your-slack-webhook-url
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# EAS Build
EAS_PROJECT_ID=your-eas-project-id
EOF
    
    # Создаем .env.local для разработки
    if [ ! -f .env.local ]; then
        cp .env.example .env.local
        warning "Created .env.local - please update with your actual values"
    fi
    
    success "Environment variables configured"
}

# Настройка Docker (опционально)
setup_docker() {
    log "🐳 Setting up Docker configuration..."
    
    # Создаем Dockerfile
    cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
EOF
    
    # Создаем .dockerignore
    cat > .dockerignore << 'EOF'
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output
.coverage
EOF
    
    # Создаем docker-compose.yml для разработки
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: fixdrive
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF
    
    success "Docker configuration created"
}

# Настройка мониторинга
setup_monitoring() {
    log "📊 Setting up monitoring..."
    
    # Создаем health check endpoint
    mkdir -p src/api
    cat > src/api/health.ts << 'EOF'
import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  };
  
  try {
    res.status(200).json(health);
  } catch (error) {
    health.message = 'ERROR';
    res.status(503).json(health);
  }
};
EOF
    
    success "Monitoring configured"
}

# Настройка кэширования
setup_caching() {
    log "💾 Setting up caching configuration..."
    
    # Создаем .npmrc для оптимизации
    cat > .npmrc << 'EOF'
cache-min=3600
registry=https://registry.npmjs.org/
save-exact=true
EOF
    
    success "Caching configured"
}

# Создание документации CI/CD
create_documentation() {
    log "📚 Creating CI/CD documentation..."
    
    cat > docs/CICD.md << 'EOF'
# 🚀 FixDrive CI/CD Documentation

## Обзор

Этот проект использует GitHub Actions для автоматизации CI/CD процессов.

## Workflows

### 1. CI/CD Pipeline (`ci.yml`)
- **Триггеры**: Push на main/develop, Pull Requests
- **Задачи**:
  - Проверка качества кода (TypeScript, ESLint, Prettier)
  - Запуск тестов с покрытием
  - Аудит безопасности
  - Проверка производительности
  - Сборка проекта
  - Деплой на staging/production

### 2. Release Management (`release.yml`)
- **Триггеры**: Теги версий, ручной запуск
- **Задачи**:
  - Создание релизов
  - Сборка мобильных приложений
  - Деплой релизов
  - Уведомления

### 3. Nightly Maintenance (`nightly.yml`)
- **Триггеры**: Ежедневно в 02:00 UTC
- **Задачи**:
  - Полный аудит безопасности
  - Анализ производительности
  - Очистка системы
  - Генерация отчетов

## Переменные окружения

### GitHub Secrets
```bash
SLACK_WEBHOOK          # URL для уведомлений в Slack
TELEGRAM_BOT_TOKEN     # Токен Telegram бота
TELEGRAM_CHAT_ID       # ID чата для уведомлений
```

### Environment Variables
```bash
NODE_ENV=production    # Окружение
API_BASE_URL          # URL API
DATABASE_URL          # URL базы данных
```

## Локальная разработка

### Pre-commit hooks
```bash
# Установка hooks
chmod +x .git/hooks/pre-commit

# Ручной запуск проверок
npm run pre-commit
```

### Docker
```bash
# Запуск в Docker
docker-compose up

# Сборка образа
docker build -t fixdrive .
```

## Мониторинг

### Health Check
```bash
curl http://localhost:3000/health
```

### Логи
```bash
# Просмотр логов CI/CD
gh run list
gh run view <run-id>

# Локальные логи
npm run logs
```

## Troubleshooting

### Частые проблемы

1. **Тесты падают**
   ```bash
   npm test -- --verbose
   ```

2. **ESLint ошибки**
   ```bash
   npx eslint . --fix
   ```

3. **TypeScript ошибки**
   ```bash
   npx tsc --noEmit
   ```

### Контакты
- DevOps Team: devops@fixdrive.com
- Slack: #fixdrive-devops
EOF
    
    success "Documentation created"
}

# Основная функция
main() {
    echo "🚀 FixDrive CI/CD Setup"
    echo "========================"
    
    check_dependencies
    install_packages
    setup_git_hooks
    setup_env_vars
    setup_docker
    setup_monitoring
    setup_caching
    create_documentation
    
    echo ""
    success "🎉 CI/CD setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update .env.local with your actual values"
    echo "2. Set up GitHub Secrets (SLACK_WEBHOOK, TELEGRAM_BOT_TOKEN, etc.)"
    echo "3. Configure EAS Build credentials"
    echo "4. Push to GitHub to trigger first CI/CD run"
    echo ""
    echo "📚 Documentation: docs/CICD.md"
    echo "🔧 Configuration: .github/workflows/"
}

# Запуск
main "$@"
