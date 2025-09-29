import React from 'react';
import { 
  Wallet as LucideWallet,
  CreditCard as LucideCreditCard,
  Clock as LucideClock,
  FileText as LucideFileText,
  Settings as LucideSettings,
  Bell as LucideBell,
  User as LucideUser,
  LogOut as LucideLogOut,
  ChevronRight as LucideChevronRight,
  Home as LucideHome,
  Car as LucideCar,
  Star as LucideStar,
  Crown as LucideCrown,
  HelpCircle as LucideHelpCircle,
  Info as LucideInfo,
  Loader as LucideLoader,
  TrendingUp as LucideTrendingUp,
  ChevronLeft as LucideChevronLeft,
  DollarSign as LucideDollarSign,
  CheckCircle as LucideCheckCircle,
  XCircle as LucideXCircle,
  Filter as LucideFilter,
  Plus as LucidePlus,
  Edit as LucideEdit,
  Trash2 as LucideTrash2,
  MapPin as LucideMapPin,
  Shield as LucideShield,
  Globe as LucideGlobe,
  ExternalLink as LucideExternalLink,
  X as LucideX,
  Phone as LucidePhone,
  MessageCircle as LucideMessageCircle,
  RefreshCw as LucideRefreshCw,
  List as LucideList,
  Calendar as LucideCalendar,
  X as LucideClose,
  Palette as LucidePalette,
  User as LucideUserIcon
} from 'lucide-react-native';

// Types for icon props
export interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

// Legacy Icon component for backward compatibility (now using Lucide)
export const Icon: React.FC<IconProps & { name: string }> = ({ 
  name, 
  size = 24, 
  color = '#000', 
  style 
}) => {
  // Map Ionicons names to Lucide components
  const iconMap: Record<string, React.ComponentType<IconProps>> = {
    'notifications-outline': LucideBell,
    'wallet-outline': LucideWallet,
    'card-outline': LucideCreditCard,
    'time-outline': LucideClock,
    'document-text-outline': LucideFileText,
    'settings-outline': LucideSettings,
    'home-outline': LucideHome,
    'help-circle-outline': LucideHelpCircle,
    'information-circle-outline': LucideInfo,
    'car-outline': LucideCar,
    'chevron-forward-outline': LucideChevronRight,
    'person-outline': LucideUser,
    'log-out-outline': LucideLogOut,
    'refresh-outline': LucideLoader,
    'star-outline': LucideStar,
    'trending-up-outline': LucideTrendingUp,
    'chevron-back-outline': LucideChevronLeft,
    'dollar-outline': LucideDollarSign,
    'checkmark-circle-outline': LucideCheckCircle,
    'close-circle-outline': LucideXCircle,
  };

  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found, using Bell as fallback`);
    return <LucideBell size={size} color={color} style={style} />;
  }

  return <IconComponent size={size} color={color} style={style} />;
};

// Predefined icon components with consistent naming using Lucide
export const Bell = (props: IconProps) => <LucideBell {...props} />;
export const Wallet = (props: IconProps) => <LucideWallet {...props} />;
export const CreditCard = (props: IconProps) => <LucideCreditCard {...props} />;
export const Clock = (props: IconProps) => <LucideClock {...props} />;
export const FileText = (props: IconProps) => <LucideFileText {...props} />;
export const Settings = (props: IconProps) => <LucideSettings {...props} />;
export const Home = (props: IconProps) => <LucideHome {...props} />;
export const HelpCircle = (props: IconProps) => <LucideHelpCircle {...props} />;
export const Info = (props: IconProps) => <LucideInfo {...props} />;
export const Car = (props: IconProps) => <LucideCar {...props} />;
export const ChevronRight = (props: IconProps) => <LucideChevronRight {...props} />;
export const UserIcon = (props: IconProps) => <LucideUser {...props} />;
export const LogOut = (props: IconProps) => <LucideLogOut {...props} />;
export const Loader = (props: IconProps) => <LucideLoader {...props} />;
export const Star = (props: IconProps) => <LucideStar {...props} />;
export const Crown = (props: IconProps) => <LucideCrown {...props} />;
export const TrendingUp = (props: IconProps) => <LucideTrendingUp {...props} />;
export const ChevronLeft = (props: IconProps) => <LucideChevronLeft {...props} />;
export const DollarSign = (props: IconProps) => <LucideDollarSign {...props} />;
export const CheckCircle = (props: IconProps) => <LucideCheckCircle {...props} />;
export const XCircle = (props: IconProps) => <LucideXCircle {...props} />;
export const Filter = (props: IconProps) => <LucideFilter {...props} />;
export const Plus = (props: IconProps) => <LucidePlus {...props} />;
export const Edit = (props: IconProps) => <LucideEdit {...props} />;
export const Trash2 = (props: IconProps) => <LucideTrash2 {...props} />;
export const MapPin = (props: IconProps) => <LucideMapPin {...props} />;
export const Shield = (props: IconProps) => <LucideShield {...props} />;
export const Globe = (props: IconProps) => <LucideGlobe {...props} />;
export const ExternalLink = (props: IconProps) => <LucideExternalLink {...props} />;
export const X = (props: IconProps) => <LucideX {...props} />;
export const Phone = (props: IconProps) => <LucidePhone {...props} />;
export const MessageCircle = (props: IconProps) => <LucideMessageCircle {...props} />;
export const RefreshCw = (props: IconProps) => <LucideRefreshCw {...props} />;
export const List = (props: IconProps) => <LucideList {...props} />;
export const Calendar = (props: IconProps) => <LucideCalendar {...props} />;
export const Close = (props: IconProps) => <LucideClose {...props} />;
export const Palette = (props: IconProps) => <LucidePalette {...props} />;
export const User = (props: IconProps) => <LucideUserIcon {...props} />;

// Icon names mapping for easy reference (now using Lucide component names)
export const ICON_NAMES = {
  BELL: 'Bell',
  WALLET: 'Wallet',
  CREDIT_CARD: 'CreditCard',
  CLOCK: 'Clock',
  FILE_TEXT: 'FileText',
  SETTINGS: 'Settings',
  HOME: 'Home',
  HELP_CIRCLE: 'HelpCircle',
  INFO: 'Info',
  CAR: 'Car',
  CHEVRON_RIGHT: 'ChevronRight',
  USER: 'UserIcon',
  LOG_OUT: 'LogOut',
  LOADER: 'Loader',
  STAR: 'Star',
  TRENDING_UP: 'TrendingUp',
  CHEVRON_LEFT: 'ChevronLeft',
  DOLLAR_SIGN: 'DollarSign',
  CHECK_CIRCLE: 'CheckCircle',
  X_CIRCLE: 'XCircle',
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
  Star,
  Crown,
  TrendingUp,
  ChevronLeft,
  DollarSign,
  CheckCircle,
  XCircle,
  Filter,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Shield,
  Globe,
  ExternalLink,
  X,
  Phone,
  MessageCircle,
  RefreshCw,
  List,
  Calendar,
  Close,
  Palette,
  User
};

export default Icons;
