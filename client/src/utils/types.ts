export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  balance: number;
  profession: string;
};

export type Job = {
  id: string;
  description: string;
  price: number;
  paid: boolean;
  createdAt: string;
};
