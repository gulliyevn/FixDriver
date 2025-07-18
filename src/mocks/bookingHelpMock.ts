export interface BookingHelpSlide {
  id: number;
  title: string;
  icon: string;
  content: string;
  description: string;
}

export const getBookingHelpSlides = (): BookingHelpSlide[] => {
  return [
    {
      id: 1,
      title: 'help.booking.routeSelection.title',
      icon: 'map',
      content: 'help.booking.routeSelection.content',
      description: 'help.booking.routeSelection.description'
    },
    {
      id: 2,
      title: 'help.booking.driverSelection.title',
      icon: 'person',
      content: 'help.booking.driverSelection.content',
      description: 'help.booking.driverSelection.description'
    },
    {
      id: 3,
      title: 'help.booking.orderConfirmation.title',
      icon: 'checkmark-circle',
      content: 'help.booking.orderConfirmation.content',
      description: 'help.booking.orderConfirmation.description'
    },
    {
      id: 4,
      title: 'help.booking.waitingDriver.title',
      icon: 'time',
      content: 'help.booking.waitingDriver.content',
      description: 'help.booking.waitingDriver.description'
    }
  ];
}; 