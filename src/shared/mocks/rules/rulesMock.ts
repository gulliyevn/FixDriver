export interface RuleSlide {
  id: number;
  title: string;
  icon: string;
  content: string;
  description: string;
}

export const getRulesSlides = (): RuleSlide[] => {
  return [
    {
      id: 1,
      title: 'help.rules.generalProvisions.title',
      icon: 'document-text',
      content: 'help.rules.generalProvisions.content',
      description: 'help.rules.generalProvisions.description'
    },
    {
      id: 2,
      title: 'help.rules.terms.title',
      icon: 'list',
      content: 'help.rules.terms.content',
      description: 'help.rules.terms.description'
    },
    {
      id: 3,
      title: 'help.rules.policy.title',
      icon: 'settings',
      content: 'help.rules.policy.content',
      description: 'help.rules.policy.description'
    },
    {
      id: 4,
      title: 'help.rules.rules.title',
      icon: 'checkmark-circle',
      content: 'help.rules.rules.content',
      description: 'help.rules.rules.description'
    }
  ];
}; 