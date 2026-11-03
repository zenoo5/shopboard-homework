// Define the original product order and the storefront's twelve gaming products.
import type { Product } from './products.types.js';

export const products: Product[] = [
  {
    id: 'phantom-k75',
    name: 'Phantom K75',
    category: 'Keyboards',
    price: 129.99,
    image: '/images/keyboard.svg',
    description:
      '75% mechanical keyboard. Hot-swappable switches, satisfying sound, zero distractions.',
    badge: 'Bestseller',
    color: 'violet',
  },
  {
    id: 'pulse-wireless',
    name: 'Pulse Wireless',
    category: 'Mice',
    price: 69.99,
    image: '/images/mouse.svg',
    description:
      'A featherweight 58g wireless mouse with a precise 26K sensor.',
    badge: 'Fan favorite',
    color: 'mint',
  },
  {
    id: 'nova-headset',
    name: 'Nova Surround',
    category: 'Headsets',
    price: 99.99,
    image: '/images/headset.svg',
    description:
      'Hear every footstep with immersive spatial audio and a detachable microphone.',
    badge: '',
    color: 'peach',
  },
  {
    id: 'nexus-controller',
    name: 'Nexus Pro',
    category: 'Controllers',
    price: 79.99,
    image: '/images/controller.svg',
    description:
      'Hall-effect sticks, remappable back buttons, and a grip that stays comfortable.',
    badge: 'New drop',
    color: 'blue',
  },
  {
    id: 'phantom-mini',
    name: 'Phantom Mini',
    category: 'Keyboards',
    price: 89.99,
    image: '/images/keyboard.svg',
    description:
      'A compact 60% mechanical board that makes room for your next big play.',
    badge: '',
    color: 'mint',
  },
  {
    id: 'pulse-core',
    name: 'Pulse Core',
    category: 'Mice',
    price: 39.99,
    image: '/images/mouse.svg',
    description:
      'Reliable wired precision with six programmable buttons and a flexible cable.',
    badge: '',
    color: 'peach',
  },
  {
    id: 'nova-air',
    name: 'Nova Air',
    category: 'Headsets',
    price: 149.99,
    image: '/images/headset.svg',
    description:
      'Low-latency wireless audio, breathable cushions, and up to 40 hours of play.',
    badge: 'Wireless',
    color: 'violet',
  },
  {
    id: 'nexus-core',
    name: 'Nexus Core',
    category: 'Controllers',
    price: 49.99,
    image: '/images/controller.svg',
    description:
      'Plug-and-play USB controller with responsive triggers and dual vibration.',
    badge: '',
    color: 'mint',
  },
  {
    id: 'orbit-deskmat',
    name: 'Orbit XL Deskmat',
    category: 'Accessories',
    price: 29.99,
    image: '/images/deskmat.svg',
    description:
      'An extended 900 × 400 mm surface with stitched edges and a non-slip base.',
    badge: 'Setup essential',
    color: 'blue',
  },
  {
    id: 'beacon-mic',
    name: 'Beacon USB Mic',
    category: 'Accessories',
    price: 89.99,
    image: '/images/microphone.svg',
    description:
      'Clear voice capture for streams and squad calls, with a tap-to-mute button.',
    badge: '',
    color: 'peach',
  },
  {
    id: 'orbit-compact',
    name: 'Orbit Speed Pad',
    category: 'Accessories',
    price: 19.99,
    image: '/images/deskmat.svg',
    description:
      'A compact, low-friction mouse pad built for quick flicks and consistent tracking.',
    badge: '',
    color: 'violet',
  },
  {
    id: 'beacon-studio',
    name: 'Beacon Studio',
    category: 'Accessories',
    price: 119.99,
    image: '/images/microphone.svg',
    description:
      'A USB condenser microphone with a headphone monitor and adjustable gain.',
    badge: 'New drop',
    color: 'mint',
  },
];
