export interface SubscriptionTemplate {
  name: string;
  category: string;
  logo?: string;
  website?: string;
  defaultAmount: number;
  defaultCurrency: string;
  defaultBillingCycle: 'monthly' | 'yearly';
  description?: string;
}

export const subscriptionTemplates: SubscriptionTemplate[] = [
  // Streaming Services
  {
    name: 'Netflix',
    category: 'Entertainment',
    website: 'https://netflix.com',
    defaultAmount: 15.49,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Streaming service for movies and TV shows',
  },
  {
    name: 'Spotify',
    category: 'Entertainment',
    website: 'https://spotify.com',
    defaultAmount: 10.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Music streaming service',
  },
  {
    name: 'Disney+',
    category: 'Entertainment',
    website: 'https://disneyplus.com',
    defaultAmount: 7.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Disney streaming service',
  },
  {
    name: 'YouTube Premium',
    category: 'Entertainment',
    website: 'https://youtube.com/premium',
    defaultAmount: 11.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Ad-free YouTube with background play',
  },
  {
    name: 'Amazon Prime',
    category: 'Entertainment',
    website: 'https://amazon.com/prime',
    defaultAmount: 14.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Prime Video, free shipping, and more',
  },
  {
    name: 'HBO Max',
    category: 'Entertainment',
    website: 'https://hbomax.com',
    defaultAmount: 15.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'HBO streaming service',
  },
  {
    name: 'Apple TV+',
    category: 'Entertainment',
    website: 'https://tv.apple.com',
    defaultAmount: 6.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Apple streaming service',
  },
  {
    name: 'Hulu',
    category: 'Entertainment',
    website: 'https://hulu.com',
    defaultAmount: 7.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Streaming service for TV shows and movies',
  },

  // Productivity & Software
  {
    name: 'Microsoft 365',
    category: 'Productivity',
    website: 'https://microsoft.com/microsoft-365',
    defaultAmount: 6.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Office apps and cloud storage',
  },
  {
    name: 'Google One',
    category: 'Productivity',
    website: 'https://one.google.com',
    defaultAmount: 1.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Google cloud storage',
  },
  {
    name: 'Dropbox',
    category: 'Productivity',
    website: 'https://dropbox.com',
    defaultAmount: 11.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Cloud storage and file sharing',
  },
  {
    name: 'Adobe Creative Cloud',
    category: 'Productivity',
    website: 'https://adobe.com',
    defaultAmount: 54.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Adobe creative apps suite',
  },
  {
    name: 'Notion',
    category: 'Productivity',
    website: 'https://notion.so',
    defaultAmount: 10.00,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'All-in-one workspace',
  },
  {
    name: 'Evernote',
    category: 'Productivity',
    website: 'https://evernote.com',
    defaultAmount: 7.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Note-taking app',
  },
  {
    name: 'Canva Pro',
    category: 'Productivity',
    website: 'https://canva.com',
    defaultAmount: 12.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Graphic design platform',
  },

  // Gaming
  {
    name: 'PlayStation Plus',
    category: 'Gaming',
    website: 'https://playstation.com',
    defaultAmount: 9.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'PlayStation online gaming',
  },
  {
    name: 'Xbox Game Pass',
    category: 'Gaming',
    website: 'https://xbox.com/game-pass',
    defaultAmount: 9.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Xbox game subscription',
  },
  {
    name: 'Nintendo Switch Online',
    category: 'Gaming',
    website: 'https://nintendo.com',
    defaultAmount: 3.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Nintendo online gaming',
  },

  // Fitness & Health
  {
    name: 'Peloton',
    category: 'Fitness',
    website: 'https://onepeloton.com',
    defaultAmount: 12.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Fitness classes and workouts',
  },
  {
    name: 'MyFitnessPal Premium',
    category: 'Fitness',
    website: 'https://myfitnesspal.com',
    defaultAmount: 9.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Calorie tracking and fitness',
  },
  {
    name: 'Headspace',
    category: 'Health',
    website: 'https://headspace.com',
    defaultAmount: 12.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Meditation and mindfulness',
  },

  // News & Reading
  {
    name: 'The New York Times',
    category: 'News',
    website: 'https://nytimes.com',
    defaultAmount: 17.00,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'News subscription',
  },
  {
    name: 'Medium',
    category: 'Reading',
    website: 'https://medium.com',
    defaultAmount: 5.00,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Online publishing platform',
  },
  {
    name: 'Audible',
    category: 'Reading',
    website: 'https://audible.com',
    defaultAmount: 14.95,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Audiobook subscription',
  },

  // Communication
  {
    name: 'Zoom Pro',
    category: 'Communication',
    website: 'https://zoom.us',
    defaultAmount: 14.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Video conferencing',
  },
  {
    name: 'Slack',
    category: 'Communication',
    website: 'https://slack.com',
    defaultAmount: 7.25,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Team communication platform',
  },

  // VPN & Security
  {
    name: 'NordVPN',
    category: 'Security',
    website: 'https://nordvpn.com',
    defaultAmount: 11.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'VPN service',
  },
  {
    name: '1Password',
    category: 'Security',
    website: 'https://1password.com',
    defaultAmount: 2.99,
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    description: 'Password manager',
  },
];

export const getTemplatesByCategory = () => {
  const categories: Record<string, SubscriptionTemplate[]> = {};
  
  subscriptionTemplates.forEach(template => {
    if (!categories[template.category]) {
      categories[template.category] = [];
    }
    categories[template.category].push(template);
  });
  
  return categories;
};

export const searchTemplates = (query: string): SubscriptionTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return subscriptionTemplates.filter(
    template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.category.toLowerCase().includes(lowerQuery) ||
      template.description?.toLowerCase().includes(lowerQuery)
  );
};
