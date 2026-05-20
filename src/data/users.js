// ═══════════════════════════════════════════════════════════════════════════
// Mock Users Data (5 predefined users)
// ═══════════════════════════════════════════════════════════════════════════

export const users = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    username: 'sarah.m',
    password: 'RevPar@123',
    email: 'sarah.mitchell@revpar.com',
    loyaltyPoints: 12500,
    memberSince: '2022-03-15',
    tier: 'Gold',
  },
  {
    id: 2,
    name: 'James Rodriguez',
    username: 'james.r',
    password: 'Stay@234',
    email: 'james.rodriguez@revpar.com',
    loyaltyPoints: 8750,
    memberSince: '2023-01-10',
    tier: 'Silver',
  },
  {
    id: 3,
    name: 'Emma Chen',
    username: 'emma.c',
    password: 'Luxury@345',
    email: 'emma.chen@revpar.com',
    loyaltyPoints: 15200,
    memberSince: '2021-08-22',
    tier: 'Platinum',
  },
  {
    id: 4,
    name: 'Michael Thompson',
    username: 'michael.t',
    password: 'Suite@456',
    email: 'michael.thompson@revpar.com',
    loyaltyPoints: 6400,
    memberSince: '2023-06-05',
    tier: 'Silver',
  },
  {
    id: 5,
    name: 'Olivia Martinez',
    username: 'olivia.m',
    password: 'Bonvoy@567',
    email: 'olivia.martinez@revpar.com',
    loyaltyPoints: 19800,
    memberSince: '2020-11-30',
    tier: 'Platinum',
  },
];

export const getUserById = (id) => users.find((u) => u.id === parseInt(id));
export const getUsersExcept = (excludeId) => users.filter((u) => u.id !== parseInt(excludeId));
export const getUserByCredentials = (username, password) =>
  users.find(
    (user) =>
      user.username.toLowerCase() === String(username).trim().toLowerCase() &&
      user.password === password
  );
