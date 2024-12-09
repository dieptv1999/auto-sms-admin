import { UserPlan } from "./enum/user.plan";

export const NamedUserPlan = {
    [UserPlan.free]: 'Gói miễn phí',
    [UserPlan.silver]: 'Gói cơ bản',
    [UserPlan.gold]: 'Gói tiết kiệm',
    [UserPlan.diamond]: 'Gói cao cấp',
  };

  // * cal by MB
export const StoragePerUser = {
  [UserPlan.free]: 5120, // 5GB
  [UserPlan.silver]: 61440, // 60GB
  [UserPlan.gold]: 122880, // 120GB
  [UserPlan.diamond]: 204800, // 200GB
};

export const MoneyPerUserPlan = {
  [UserPlan.free]: 0, // 5GB
  [UserPlan.silver]: 99000, // 60GB
  [UserPlan.gold]: 179000, // 120GB
  [UserPlan.diamond]: 279000, // 200GB
};

export const MONEY_PER_GB = 2000;