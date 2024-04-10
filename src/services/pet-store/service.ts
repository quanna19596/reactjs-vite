import env from '@/env';
import { AuthorizedInstance } from '@/services';

export const PetStoreService = AuthorizedInstance(env.service.petStore.baseUrl);
