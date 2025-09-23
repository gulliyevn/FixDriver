import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Types for icon props
export interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

// Main Icon component that wraps Ionicons
export const Icon: React.FC<IconProps & { name: string }> = ({ 
  name, 
  size = 24, 
  color = '#000', 
  style 
}) => {
  return (
    <Ionicons 
      name={name as any} 
      size={size} 
      color={color} 
      style={style} 
    />
  );
};

// Predefined icon components with consistent naming
export const Bell = (props: IconProps) => <Icon name="notifications-outline" {...props} />;
export const Wallet = (props: IconProps) => <Icon name="wallet-outline" {...props} />;
export const CreditCard = (props: IconProps) => <Icon name="card-outline" {...props} />;
export const Clock = (props: IconProps) => <Icon name="time-outline" {...props} />;
export const FileText = (props: IconProps) => <Icon name="document-text-outline" {...props} />;
export const Settings = (props: IconProps) => <Icon name="settings-outline" {...props} />;
export const Home = (props: IconProps) => <Icon name="home-outline" {...props} />;
export const HelpCircle = (props: IconProps) => <Icon name="help-circle-outline" {...props} />;
export const Info = (props: IconProps) => <Icon name="information-circle-outline" {...props} />;
export const Car = (props: IconProps) => <Icon name="car-outline" {...props} />;
export const ChevronRight = (props: IconProps) => <Icon name="chevron-forward" {...props} />;
export const UserIcon = (props: IconProps) => <Icon name="person" {...props} />;
export const LogOut = (props: IconProps) => <Icon name="log-out-outline" {...props} />;
export const Loader = (props: IconProps) => <Icon name="refresh" {...props} />;

// Icon names mapping for easy reference
export const ICON_NAMES = {
  BELL: 'notifications-outline',
  WALLET: 'wallet-outline',
  CREDIT_CARD: 'card-outline',
  CLOCK: 'time-outline',
  FILE_TEXT: 'document-text-outline',
  SETTINGS: 'settings-outline',
  HOME: 'home-outline',
  HELP_CIRCLE: 'help-circle-outline',
  INFO: 'information-circle-outline',
  CAR: 'car-outline',
  CHEVRON_RIGHT: 'chevron-forward',
  USER: 'person',
  LOG_OUT: 'log-out-outline',
  LOADER: 'refresh',
} as const;

// Export all icons as a single object for easy import
export const Icons = {
  Bell,
  Wallet,
  CreditCard,
  Clock,
  FileText,
  Settings,
  Home,
  HelpCircle,
  Info,
  Car,
  ChevronRight,
  UserIcon,
  LogOut,
  Loader,
};

export default Icons;
