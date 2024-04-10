import { ETagStatus } from '@/services/pet-store';

export type TResponseError = {
  statusCode: number;
  message: string;
};

export type TResponsePaging = {
  paging: {
    pageSize: 0;
    pageNumber: 0;
    totalNumber: 0;
  };
};

export type TResponseSuccess<T = {}> = T;

export type TPet = {
  id: number;
  category: {
    id: number;
    name: string;
  };
  name: string;
  photoUrls: string[];
  tags: {
    id: number;
    name: string;
  }[];
  status: ETagStatus;
};
