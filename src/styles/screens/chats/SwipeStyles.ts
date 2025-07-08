import { StyleSheet } from 'react-native';
import { lightColors } from '../../../constants/colors';

export const SwipeStyles = StyleSheet.create({
  swipeContainer: {
    flex: 1,
    backgroundColor: lightColors.background,
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  swipeActionLeft: {
    backgroundColor: '#EF4444',
  },
  swipeActionRight: {
    backgroundColor: '#10B981',
  },
  swipeActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  swipeIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  swipeDelete: {
    backgroundColor: '#EF4444',
  },
  swipePin: {
    backgroundColor: '#F59E0B',
  },
  swipeArchive: {
    backgroundColor: '#6B7280',
  },
  swipeMarkRead: {
    backgroundColor: '#10B981',
  },
  swipeMarkUnread: {
    backgroundColor: '#3B82F6',
  },
}); 