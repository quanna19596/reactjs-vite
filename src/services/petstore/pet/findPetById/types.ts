import { TPet } from '@/services';

export type TFindPetByIdParameters = {
  petId: number;
};

export type TFindPetByIdResponse = TPet;
