import MasterVendor, { MasterVendorAttributes } from '@database/models/masters/master_vendor.model';

export const masterVendorResource = (data: MasterVendor | MasterVendorAttributes): MasterVendorAttributes => {
  return {
    id: data.id,
    name: data.name,
  };
};
