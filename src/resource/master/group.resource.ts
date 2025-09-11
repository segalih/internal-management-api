import MasterGroup, { MasterGroupAttributes } from '@database/models/masters/master_group.model';

export const masterGroupResource = (data: MasterGroup | MasterGroupAttributes): MasterGroupAttributes => {
  return {
    id: data.id,
    name: data.name,
  };
};
