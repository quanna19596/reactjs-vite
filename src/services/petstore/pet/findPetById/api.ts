import { PetStoreService, TFindPetByIdParameters, TFindPetByIdResponse } from '@/services';

export const findPetById = async ({ petId }: TFindPetByIdParameters): Promise<TFindPetByIdResponse> => {
  const response = await PetStoreService.get(`/pet/${petId}`);
  return response.data;
};
