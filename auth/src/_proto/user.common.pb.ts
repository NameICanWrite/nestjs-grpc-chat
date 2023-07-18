/* eslint-disable */

export const protobufPackage = "common";

export enum OrderDirection {
  ASC = 0,
  DESC = 1,
  UNRECOGNIZED = -1,
}

export interface User {
  id: number;
  name: string;
  description: string;
  userType: UserType | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface UserType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const COMMON_PACKAGE_NAME = "common";
