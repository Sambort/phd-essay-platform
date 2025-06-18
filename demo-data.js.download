// Demo data initialization for testing
(function initializeDemoData() {
  const demoUsers = [
    {
      id: 'demo-user-1',
      email: 'demo@phdwriter.com',
      name: 'Demo User',
      password: 'demo123',
      isVerified: true,
      subscriptionTier: 'free',
      essaysUsed: 1,
      maxEssays: 2
    },
    {
      id: 'demo-user-2',
      email: 'john.doe@university.edu',
      name: 'Dr. John Doe',
      password: 'password123',
      isVerified: true,
      subscriptionTier: 'essentials',
      essaysUsed: 3,
      maxEssays: 5,
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    {
      id: 'demo-user-3',
      email: 'sarah.smith@research.org',
      name: 'Prof. Sarah Smith',
      password: 'password123',
      isVerified: true,
      subscriptionTier: 'pro',
      essaysUsed: 15,
      maxEssays: Infinity,
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    }
  ];

  // Initialize demo users if not already present
  if (!localStorage.getItem('phd_users')) {
    localStorage.setItem('phd_users', JSON.stringify(demoUsers));
    console.log('Demo users initialized for PhD Writer Pro platform');
  }
})();
