import { TParameters } from '@/services';
import { PetStoreService, TPet, TResponseSuccess } from '@/services/pet-store';

export type TGetPetByIdPaths = {
  id: string;
};

export type TGetPetByIdQueries = {};

export type TGetPetByIdParameters = TParameters<TGetPetByIdPaths, TGetPetByIdQueries>;

export type TGetPetByIdResponse = TResponseSuccess<TPet>;

export const getPetById = async (params: TGetPetByIdParameters): Promise<TGetPetByIdResponse> => {
  const response = await PetStoreService.get(`/pet/${params.paths?.id}`);
  return response.data;
};
