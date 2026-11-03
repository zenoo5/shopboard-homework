// Install Husky hooks only when this project belongs to a Git checkout.
import { existsSync } from 'node:fs';
import husky from 'husky';

if (existsSync('.git')) {
  const message = husky();
  if (message) console.log(message);
} else {
  console.log(
    'Husky configured; hooks activate with npm run prepare after Git is initialized.',
  );
}
