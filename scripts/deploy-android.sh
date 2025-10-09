#!/bin/bash

################################################################################
# FixDrive Android CI/CD Deployment Script
# Company: Axivion LLC
# Project: FixDrive (com.fixdrive.app)
# Author: DevOps Team
# Version: 1.0.0
# Description: Automated production deployment to Google Play Store
################################################################################

set -euo pipefail  # Exit on error, undefined variables, pipe failures

# Configuration
readonly PROJECT_ID="spring-ship-474315-m0"
readonly SERVICE_ACCOUNT="google-play-publisher@${PROJECT_ID}.iam.gserviceaccount.com"
readonly SERVICE_ACCOUNT_KEY="./credentials/google-service-account.json"
readonly COMPANY_NAME="Axivion LLC"
readonly APP_NAME="FixDrive"
readonly PACKAGE_NAME="com.fixdrive.app"
readonly DEFAULT_PROFILE="${1:-production}"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

################################################################################
# Logging Functions
################################################################################

log_info() { echo -e "${BLUE}ℹ️  ${NC}$1"; }
log_success() { echo -e "${GREEN}✅ ${NC}$1"; }
log_warning() { echo -e "${YELLOW}⚠️  ${NC}$1"; }
log_error() { echo -e "${RED}❌ ${NC}$1"; }
log_step() { echo -e "${CYAN}▶️  ${NC}$1"; }

print_header() {
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "  🚀 $APP_NAME Android CI/CD Deployment"
    echo "  📦 Company: $COMPANY_NAME"
    echo "  📱 Package: $PACKAGE_NAME"
    echo "  🎯 Profile: $DEFAULT_PROFILE"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
}

print_footer() {
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "  🎉 Deployment $1"
    echo "  ⏱️  Total time: $2 seconds"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
}

################################################################################
# Dependency Checks
################################################################################

check_dependencies() {
    log_step "Checking dependencies..."
    
    local missing_deps=()
    
    # Check gcloud
    if ! command -v gcloud &> /dev/null; then
        missing_deps+=("gcloud - Install: brew install --cask google-cloud-sdk")
    fi
    
    # Check eas
    if ! command -v eas &> /dev/null; then
        missing_deps+=("eas - Install: npm install -g eas-cli")
    fi
    
    # Check node
    if ! command -v node &> /dev/null; then
        missing_deps+=("node - Install: brew install node")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        log_error "Missing dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        exit 1
    fi
    
    log_success "All dependencies installed"
}

################################################################################
# File Checks
################################################################################

check_required_files() {
    log_step "Checking required files..."
    
    local missing_files=()
    
    # Check service account key
    if [ ! -f "$SERVICE_ACCOUNT_KEY" ]; then
        missing_files+=("$SERVICE_ACCOUNT_KEY - Service account key not found")
    fi
    
    # Check eas.json
    if [ ! -f "eas.json" ]; then
        missing_files+=("eas.json - EAS configuration not found")
    fi
    
    # Check app.json
    if [ ! -f "app.json" ]; then
        missing_files+=("app.json - Expo configuration not found")
    fi
    
    # Check package.json
    if [ ! -f "package.json" ]; then
        missing_files+=("package.json - NPM configuration not found")
    fi
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        log_error "Missing required files:"
        for file in "${missing_files[@]}"; do
            echo "  - $file"
        done
        exit 1
    fi
    
    log_success "All required files found"
}

################################################################################
# Google Cloud Authentication
################################################################################

authenticate_gcloud() {
    log_step "Authenticating with Google Cloud..."
    
    # Activate service account
    if gcloud auth activate-service-account "$SERVICE_ACCOUNT" \
        --key-file="$SERVICE_ACCOUNT_KEY" \
        --project="$PROJECT_ID" 2>/dev/null; then
        log_success "Service account activated: $SERVICE_ACCOUNT"
    else
        log_error "Failed to activate service account"
        exit 1
    fi
    
    # Set project
    gcloud config set project "$PROJECT_ID" --quiet 2>/dev/null
    
    # Verify authentication
    local current_account=$(gcloud config get-value account 2>/dev/null)
    local current_project=$(gcloud config get-value project 2>/dev/null)
    
    log_info "Current account: $current_account"
    log_info "Current project: $current_project"
    
    if [ "$current_project" != "$PROJECT_ID" ]; then
        log_error "Project mismatch. Expected: $PROJECT_ID, Got: $current_project"
        exit 1
    fi
    
    log_success "Google Cloud authentication successful"
}

################################################################################
# EAS Authentication
################################################################################

authenticate_eas() {
    log_step "Checking EAS authentication..."
    
    if eas whoami &> /dev/null; then
        local username=$(eas whoami 2>/dev/null)
        log_success "EAS authenticated as: $username"
    else
        log_warning "Not authenticated with EAS"
        log_info "Please login to EAS:"
        
        if eas login; then
            log_success "EAS authentication successful"
        else
            log_error "EAS authentication failed"
            exit 1
        fi
    fi
}

################################################################################
# Pre-deployment Validation
################################################################################

validate_configuration() {
    log_step "Validating configuration..."
    
    # Check package name in app.json
    if command -v jq &> /dev/null; then
        local app_package=$(jq -r '.expo.android.package' app.json 2>/dev/null)
        if [ "$app_package" != "$PACKAGE_NAME" ]; then
            log_error "Package name mismatch in app.json"
            log_error "Expected: $PACKAGE_NAME, Found: $app_package"
            exit 1
        fi
    fi
    
    # Check eas.json profile exists
    if command -v jq &> /dev/null; then
        local profile_exists=$(jq -e ".build.$DEFAULT_PROFILE" eas.json &> /dev/null && echo "yes" || echo "no")
        if [ "$profile_exists" != "yes" ]; then
            log_error "Profile '$DEFAULT_PROFILE' not found in eas.json"
            exit 1
        fi
    fi
    
    log_success "Configuration validated"
}

################################################################################
# Build Application
################################################################################

build_application() {
    log_step "Building application (profile: $DEFAULT_PROFILE)..."
    
    local build_start=$(date +%s)
    
    log_info "Starting EAS build..."
    log_info "This may take 10-15 minutes..."
    echo ""
    
    if eas build --platform android --profile "$DEFAULT_PROFILE" --non-interactive; then
        local build_end=$(date +%s)
        local build_time=$((build_end - build_start))
        log_success "Build completed in ${build_time}s"
        return 0
    else
        log_error "Build failed"
        log_info "Check build logs at: https://expo.dev"
        exit 1
    fi
}

################################################################################
# Submit to Play Store
################################################################################

submit_to_play_store() {
    log_step "Submitting to Google Play Store..."
    
    # Determine track based on profile
    local track="production"
    if [ "$DEFAULT_PROFILE" == "preview" ]; then
        track="internal"
    elif [ "$DEFAULT_PROFILE" == "development" ]; then
        log_warning "Development builds are not submitted to Play Store"
        return 0
    fi
    
    log_info "Target track: $track"
    echo ""
    
    if eas submit --platform android --profile "$DEFAULT_PROFILE" --non-interactive; then
        log_success "Submission successful!"
        log_info "Track: $track"
        log_info "Check status at: https://play.google.com/console"
        return 0
    else
        log_error "Submission failed"
        log_warning "Common issues:"
        echo "  1. Service account not granted access in Play Console"
        echo "  2. App not created in Play Console"
        echo "  3. Package name mismatch"
        echo "  4. Missing required metadata (Store listing, Privacy policy, etc.)"
        exit 1
    fi
}

################################################################################
# Cleanup
################################################################################

cleanup() {
    log_step "Cleaning up..."
    # Revoke service account if needed (optional)
    # gcloud auth revoke "$SERVICE_ACCOUNT" --quiet 2>/dev/null || true
    log_success "Cleanup completed"
}

################################################################################
# Main Deployment Pipeline
################################################################################

main() {
    local start_time=$(date +%s)
    
    print_header
    
    # Trap errors and cleanup
    trap 'log_error "Deployment failed!"; cleanup; exit 1' ERR
    trap 'cleanup' EXIT
    
    # Run deployment pipeline
    check_dependencies
    check_required_files
    validate_configuration
    authenticate_gcloud
    authenticate_eas
    
    echo ""
    log_warning "You are about to deploy $APP_NAME to Google Play Store"
    log_info "Profile: $DEFAULT_PROFILE"
    log_info "Package: $PACKAGE_NAME"
    echo ""
    
    if [ "${CI:-false}" != "true" ]; then
        read -p "Continue? (y/n): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_warning "Deployment cancelled by user"
            exit 0
        fi
        echo ""
    fi
    
    # Build and submit
    build_application
    submit_to_play_store
    
    # Calculate total time
    local end_time=$(date +%s)
    local total_time=$((end_time - start_time))
    
    # Print summary
    echo ""
    log_success "Deployment completed successfully!"
    echo ""
    echo "📊 Summary:"
    echo "  - App: $APP_NAME"
    echo "  - Package: $PACKAGE_NAME"
    echo "  - Profile: $DEFAULT_PROFILE"
    echo "  - Total time: ${total_time}s"
    echo ""
    echo "🔗 Next steps:"
    echo "  1. Check build: https://expo.dev"
    echo "  2. Review release: https://play.google.com/console"
    echo "  3. Monitor rollout and crash reports"
    echo ""
    
    print_footer "COMPLETED" "$total_time"
}

# Run main function
main "$@"
