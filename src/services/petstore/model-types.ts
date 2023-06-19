import { EOrderStatus, ETagStatus } from '@/services';

export type TError = {
  statusCode: number;
  message: string;
};

export type TPaging = {
  paging: {
    pageSize: 0;
    pageNumber: 0;
    totalNumber: 0;
  };
};

export type TApiResponse = {
  code: number;
  type: string;
  message: string;
};

export type TCategory = {
  id: number;
  name: string;
};

export type TPet = {
  id: number;
  category: TCategory;
  name: string;
  photoUrls: string[];
  tags: TTag[];
  status: ETagStatus;
};

export type TTag = {
  id: number;
  name: string;
};

export type TOrder = {
  id: number;
  petId: number;
  quantity: number;
  shipDate: string;
  status: EOrderStatus;
  complete: boolean;
};

export type TUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userStatus: number;
};
