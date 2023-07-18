/* eslint-disable */

export const protobufPackage = "common";

export interface User {
  id?: number;
  name?: string;
  description?: string;
  userType?: UserType;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserType {
  id?: number;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const COMMON_PACKAGE_NAME = "common";
