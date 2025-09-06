/**
 * Support Service Constants
 * 
 * Constants for support service functionality
 */

export const SUPPORT_CONSTANTS = {
  DEFAULT_STATUS: 'open' as const,
  DEFAULT_PRIORITY: 'medium' as const,
  IN_PROGRESS_STATUS: 'in_progress' as const,
  RESOLVED_STATUS: 'resolved' as const,
  AUTO_RESPONSE_DELAY: 2000,
  RESPONSE_DELAY_MIN: 2000,
  RESPONSE_DELAY_MAX: 3000,
  AUTO_RESPONSE: 'Hello! Thank you for contacting us. We have received your message and will contact you soon. Average response time: 5-10 minutes.',
  QUICK_QUESTIONS: [
    'Account login issues',
    'Payment questions',
    'Ride booking problems',
    'Technical issues',
    'Driver registration questions',
    'Other'
  ],
  RESPONSES: {
    LOGIN_ISSUES: 'To resolve login issues, try:\n1. Check email and password correctness\n2. Use "Forgot password?" function\n3. Clear app cache\n\nIf the problem persists, please provide us with your email.',
    PAYMENT_ISSUES: 'For payment questions:\n1. Check linked card in settings\n2. Ensure sufficient funds\n3. Check internet connection\n\nWe also accept cash. Need additional help?',
    ORDER_ISSUES: 'Ride booking problems:\n1. Check GPS and location permissions\n2. Ensure correct addresses\n3. Try restarting the app\n\nYou can also call the driver directly through the app.',
    DRIVER_REGISTRATION: 'For driver registration:\n1. Fill all form fields\n2. Upload documents (license, vehicle registration)\n3. Pass verification (1-2 business days)\n\nAfter approval, you will receive a notification and can start working.',
    DEFAULT: 'Thank you for your message! Our specialist is studying your question and will provide a detailed answer soon.\n\nSupport hours: 24/7\nAverage response time: 5-10 minutes'
  }
} as const;
