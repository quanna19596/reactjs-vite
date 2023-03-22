import env from '@/env';
import { AuthorizedInstance } from '@/services';

export const PetStoreService = AuthorizedInstance(env.api.baseUrl.petStoreService);
