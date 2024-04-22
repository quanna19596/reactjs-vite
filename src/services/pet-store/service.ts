import env from '@/env';
import AuthorizedInstance from '@/services/authorized';

const PetStoreService = AuthorizedInstance(env.service.petStore.baseUrl);

export default PetStoreService;
