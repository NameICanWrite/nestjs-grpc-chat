/* eslint-disable */

export const protobufPackage = "common";

export interface Chat {
  id: number;
  name: string;
  description: string;
  chatType: ChatType | undefined;
  users: number[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  text: string;
  chat: ChatId | undefined;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatId {
  id: number;
}

export const COMMON_PACKAGE_NAME = "common";
