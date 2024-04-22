import PetStoreService from '@/services/pet-store/service';
import { TPet, TResponseSuccess } from '@/services/pet-store/types';
import { TParameters } from '@/services/types';

export type TGetPetByIdPaths = {
  id: string;
};

export type TGetPetByIdQueries = {};

export type TGetPetByIdParameters = TParameters<TGetPetByIdPaths, TGetPetByIdQueries>;

export type TGetPetByIdResponse = TResponseSuccess<TPet>;

const getPetById = async (params: TGetPetByIdParameters): Promise<TGetPetByIdResponse> => {
  const response = await PetStoreService.get(`/pet/${params.paths?.id}`);
  return response.data;
};

export default getPetById;
