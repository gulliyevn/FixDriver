#!/bin/bash

# 🏪 App Store & Google Play Setup Script
# This script helps set up the environment for app store deployment

set -e

echo "🚀 FixDrive App Store Setup Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is designed for macOS. Please run on macOS for iOS development."
    exit 1
fi

print_status "Starting App Store setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    print_warning "EAS CLI is not installed. Installing..."
    npm install -g eas-cli
    print_success "EAS CLI installed successfully"
fi

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    print_warning "Expo CLI is not installed. Installing..."
    npm install -g @expo/cli
    print_success "Expo CLI installed successfully"
fi

print_status "Creating credentials directory..."
mkdir -p credentials

print_status "Setting up credential templates..."

# Create credential template files
cat > credentials/CREDENTIALS_TEMPLATE.md << 'EOF'
# 🔐 Credentials Template

## Apple Developer Credentials

### Required Files:
- `apple-distribution.p12` - Apple Distribution Certificate
- `apple-distribution.mobileprovision` - Provisioning Profile
- `AppleWWDRCA.cer` - Apple Worldwide Developer Relations Certificate

### Environment Variables:
```
EXPO_APPLE_ID=your-apple-id@example.com
EXPO_ASC_APP_ID=1234567890
EXPO_APPLE_TEAM_ID=ABCD123456
```

## Google Play Credentials

### Required Files:
- `google-service-account.json` - Google Play Console Service Account Key
- `upload-keystore.jks` - Upload Keystore
- `keystore.properties` - Keystore Properties

### Environment Variables:
```
EXPO_GOOGLE_SERVICE_ACCOUNT_KEY=path/to/google-service-account.json
EXPO_UPLOAD_KEYSTORE=path/to/upload-keystore.jks
```

## EAS Build Credentials

### Environment Variables:
```
EXPO_TOKEN=your-expo-token
```

## Setup Instructions:

1. **Apple Developer Account:**
   - Go to https://developer.apple.com/
   - Create Distribution Certificate
   - Download Provisioning Profile
   - Export as .p12 file

2. **Google Play Console:**
   - Go to https://play.google.com/console/
   - Create Service Account
   - Download JSON key file
   - Generate upload keystore

3. **Expo Account:**
   - Go to https://expo.dev/
   - Create account
   - Get access token

4. **Place Files:**
   - Copy all credential files to `credentials/` directory
   - Set environment variables in Expo dashboard

5. **Test Build:**
   ```bash
   eas build --platform all --profile production --non-interactive
   ```

6. **Submit to Stores:**
   ```bash
   eas submit --platform all --profile production --non-interactive
   ```
EOF

print_success "Credential templates created"

# Create keystore properties template
cat > credentials/keystore.properties << 'EOF'
# Keystore Properties Template
# Replace with your actual values

storePassword=your-keystore-password
keyPassword=your-key-password
keyAlias=your-key-alias
storeFile=upload-keystore.jks
EOF

print_status "Checking project configuration..."

# Check if app.json exists
if [ ! -f "app.json" ]; then
    print_error "app.json not found. Please run this script from the project root."
    exit 1
fi

# Check if eas.json exists
if [ ! -f "eas.json" ]; then
    print_error "eas.json not found. Please create EAS configuration first."
    exit 1
fi

print_success "Project configuration found"

# Check if credentials directory is in .gitignore
if grep -q "credentials/" .gitignore; then
    print_success "Credentials directory is properly ignored in .gitignore"
else
    print_warning "Adding credentials directory to .gitignore"
    echo "" >> .gitignore
    echo "# App Store Credentials" >> .gitignore
    echo "credentials/*.p12" >> .gitignore
    echo "credentials/*.mobileprovision" >> .gitignore
    echo "credentials/*.cer" >> .gitignore
    echo "credentials/*.json" >> .gitignore
    echo "credentials/*.jks" >> .gitignore
    echo "credentials/*.properties" >> .gitignore
    echo "!credentials/.gitkeep" >> .gitignore
    echo "!credentials/README.md" >> .gitignore
    echo "!credentials/CREDENTIALS_TEMPLATE.md" >> .gitignore
fi

print_status "Checking dependencies..."

# Install missing dependencies
print_status "Installing missing dependencies..."
npm install expo-linear-gradient expo-haptics react-native-maps @react-native-community/datetimepicker @mapbox/polyline i18n-js @testing-library/react-native --legacy-peer-deps

print_success "Dependencies installed"

print_status "Checking TypeScript configuration..."

# Run TypeScript check
if npx tsc --noEmit; then
    print_success "TypeScript compilation successful"
else
    print_warning "TypeScript errors found. Please fix them before building."
    print_status "Run 'npx tsc --noEmit' to see detailed errors"
fi

print_status "Setup completed!"

echo ""
echo "🎉 App Store Setup Complete!"
echo "=========================="
echo ""
echo "Next steps:"
echo "1. 📋 Follow the checklist in app-store-setup.md"
echo "2. 🔐 Add your credential files to credentials/ directory"
echo "3. 🌐 Set environment variables in Expo dashboard"
echo "4. 🔧 Fix any TypeScript errors"
echo "5. 🏗️ Run: eas build --platform all --profile production"
echo "6. 📱 Run: eas submit --platform all --profile production"
echo ""
echo "📚 Documentation:"
echo "- App Store Setup Guide: app-store-setup.md"
echo "- Credentials Template: credentials/CREDENTIALS_TEMPLATE.md"
echo "- EAS Build Docs: https://docs.expo.dev/build/introduction/"
echo "- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/"
echo "- Google Play Guidelines: https://support.google.com/googleplay/android-developer/"
echo ""
print_success "Ready for app store deployment! 🚀"
