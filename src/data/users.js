// ═══════════════════════════════════════════════════════════════════════════
// Mock Users Data (5 predefined users)
// ═══════════════════════════════════════════════════════════════════════════

export const users = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@revpar.com',
    loyaltyPoints: 12500,
    memberSince: '2022-03-15',
    tier: 'Gold',
  },
  {
    id: 2,
    name: 'James Rodriguez',
    email: 'james.rodriguez@revpar.com',
    loyaltyPoints: 8750,
    memberSince: '2023-01-10',
    tier: 'Silver',
  },
  {
    id: 3,
    name: 'Emma Chen',
    email: 'emma.chen@revpar.com',
    loyaltyPoints: 15200,
    memberSince: '2021-08-22',
    tier: 'Platinum',
  },
  {
    id: 4,
    name: 'Michael Thompson',
    email: 'michael.thompson@revpar.com',
    loyaltyPoints: 6400,
    memberSince: '2023-06-05',
    tier: 'Silver',
  },
  {
    id: 5,
    name: 'Olivia Martinez',
    email: 'olivia.martinez@revpar.com',
    loyaltyPoints: 19800,
    memberSince: '2020-11-30',
    tier: 'Platinum',
  },
];

export const getUserById = (id) => users.find((u) => u.id === parseInt(id));
export const getUsersExcept = (excludeId) => users.filter((u) => u.id !== parseInt(excludeId));
