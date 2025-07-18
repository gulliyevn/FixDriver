export interface PaymentHelpSlide {
  id: number;
  title: string;
  icon: string;
  content: string;
  description: string;
}

export const getPaymentHelpSlides = (): PaymentHelpSlide[] => {
  return [
    {
      id: 1,
      title: 'help.payment.paymentMethods.title',
      icon: 'card',
      content: 'help.payment.paymentMethods.content',
      description: 'help.payment.paymentMethods.description'
    },
    {
      id: 2,
      title: 'help.payment.tariffCalculation.title',
      icon: 'calculator',
      content: 'help.payment.tariffCalculation.content',
      description: 'help.payment.tariffCalculation.description'
    },
    {
      id: 3,
      title: 'help.payment.tariffPlans.title',
      icon: 'pricetag',
      content: 'help.payment.tariffPlans.content',
      description: 'help.payment.tariffPlans.description'
    },
    {
      id: 4,
      title: 'help.payment.refund.title',
      icon: 'refresh',
      content: 'help.payment.refund.content',
      description: 'help.payment.refund.description'
    }
  ];
}; 
