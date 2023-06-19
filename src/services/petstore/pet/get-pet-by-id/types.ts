import { TParameters, TPet } from '@/services';

export type TGetPetByIdPaths = {
  id: string;
};

export type TGetPetByIdQueries = {};

export type TGetPetByIdBody = {};

export type TGetPetByIdParameters = TParameters<TGetPetByIdPaths, TGetPetByIdQueries, TGetPetByIdBody>;

export type TGetPetByIdResponse = TPet;
