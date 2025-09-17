import React from 'react';
import { render } from '@testing-library/react-native';
import AppAvatar from '../AppAvatar';

describe('AppAvatar Component', () => {
  it('renders with image source', () => {
    const { getByTestId } = render(
      <AppAvatar 
        source={{ uri: 'https://example.com/avatar.jpg' }}
        name="John Doe"
        size={50}
      />
    );
    
    expect(getByTestId('avatar-image')).toBeTruthy();
  });

  it('renders with initials when no image', () => {
    const { getByText } = render(
      <AppAvatar 
        name="John Doe"
        size={50}
      />
    );
    
    expect(getByText('JD')).toBeTruthy();
  });

  it('renders with single name', () => {
    const { getByText } = render(
      <AppAvatar 
        name="John"
        size={50}
      />
    );
    
    expect(getByText('J')).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { getByTestId, rerender } = render(
      <AppAvatar name="John Doe" size={30} />
    );
    
    expect(getByTestId('avatar-container')).toBeTruthy();
    
    rerender(<AppAvatar name="John Doe" size={80} />);
    expect(getByTestId('avatar-container')).toBeTruthy();
  });

  it('handles empty name gracefully', () => {
    const { getByText } = render(
      <AppAvatar name="" size={50} />
    );
    
    expect(getByText('?')).toBeTruthy();
  });

  it('handles special characters in name', () => {
    const { getByText } = render(
      <AppAvatar name="José María" size={50} />
    );
    
    expect(getByText('JM')).toBeTruthy();
  });
}); 