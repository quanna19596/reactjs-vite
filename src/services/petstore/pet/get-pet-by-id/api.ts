import { PetStoreService, TGetPetByIdParameters, TGetPetByIdResponse } from '@/services';

export const getPetById = async (params: TGetPetByIdParameters): Promise<TGetPetByIdResponse> => {
  const response = await PetStoreService.get(`/pet/${params.paths?.id}`);
  return response.data;
};
