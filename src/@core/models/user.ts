﻿import { Role } from "./role";

export class User {
  id: number;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: {
    description: string;
    permissions: [];
    title: string;
  };
  payment?: boolean;
  accessToken?: string;
  subscriptionStatus?: string;
  packageBuyName: any;
}
