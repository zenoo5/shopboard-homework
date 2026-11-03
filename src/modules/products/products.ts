// Supply twelve fictional digital PC games with original local cover artwork.
import type { Product } from './products.types.js';

export const products: Product[] = [
  {
    id: 'echoes-of-orion',
    name: 'Echoes of Orion',
    category: 'RPG',
    price: 39.99,
    image: '/images/games/echoes-of-orion.svg',
    description:
      'Explore a forgotten star system. Shape your crew, your ship, and the fate of the frontier.',
    badge: 'Featured',
    color: 'violet',
  },
  {
    id: 'neon-drift',
    name: 'Neon Drift',
    category: 'Racing',
    price: 24.99,
    image: '/images/games/neon-drift.svg',
    description:
      'Chase the perfect line through rain-soaked streets and a city that never powers down.',
    badge: 'Fan favorite',
    color: 'mint',
  },
  {
    id: 'hollow-kingdom',
    name: 'Hollow Kingdom',
    category: 'Action',
    price: 29.99,
    image: '/images/games/hollow-kingdom.svg',
    description:
      'Master precise combat and uncover the secrets of a kingdom lost beneath the earth.',
    badge: '',
    color: 'peach',
  },
  {
    id: 'wildwood-tales',
    name: 'Wildwood Tales',
    category: 'Adventure',
    price: 19.99,
    image: '/images/games/wildwood-tales.svg',
    description:
      'Follow a wandering spirit through ancient forests and unexpected friendships.',
    badge: 'Cozy pick',
    color: 'blue',
  },
  {
    id: 'echoes-of-earth',
    name: 'Echoes of Earth',
    category: 'RPG',
    price: 19.99,
    image: '/images/games/echoes-of-earth.svg',
    description:
      'Return to a changed homeworld in an adventure where every choice leaves a mark.',
    badge: '',
    color: 'violet',
  },
  {
    id: 'redline-rally',
    name: 'Redline Rally',
    category: 'Racing',
    price: 14.99,
    image: '/images/games/redline-rally.svg',
    description:
      'Tackle dusty switchbacks and build your ultimate rally machine.',
    badge: '',
    color: 'mint',
  },
  {
    id: 'void-runner',
    name: 'Void Runner',
    category: 'Action',
    price: 34.99,
    image: '/images/games/void-runner.svg',
    description:
      'Dash, dodge, and fight through a shifting space station in this fast-paced roguelite.',
    badge: 'New arrival',
    color: 'peach',
  },
  {
    id: 'tidal-isles',
    name: 'Tidal Isles',
    category: 'Adventure',
    price: 16.99,
    image: '/images/games/tidal-isles.svg',
    description:
      'Set sail across a sunlit archipelago. Discover lost treasures at your own pace.',
    badge: '',
    color: 'blue',
  },
  {
    id: 'citadel-command',
    name: 'Citadel Command',
    category: 'Strategy',
    price: 29.99,
    image: '/images/games/citadel-command.svg',
    description:
      'Build your stronghold, plan your defenses, and lead your people through a changing world.',
    badge: '',
    color: 'violet',
  },
  {
    id: 'little-orchard',
    name: 'Little Orchard',
    category: 'Simulation',
    price: 12.99,
    image: '/images/games/little-orchard.svg',
    description:
      'Restore an old orchard and settle into a slower kind of adventure.',
    badge: '',
    color: 'mint',
  },
  {
    id: 'starlight-station',
    name: 'Starlight Station',
    category: 'Simulation',
    price: 17.99,
    image: '/images/games/starlight-station.svg',
    description:
      'Create an outpost among the stars and help a colorful crew find their place.',
    badge: '',
    color: 'peach',
  },
  {
    id: 'last-light',
    name: 'Last Light',
    category: 'Strategy',
    price: 22.99,
    image: '/images/games/last-light.svg',
    description:
      'Keep the beacon burning. Guide your settlement through the night.',
    badge: 'New arrival',
    color: 'blue',
  },
];
