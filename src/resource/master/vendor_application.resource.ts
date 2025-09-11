import MasterVendorApplication, {
  MasterVendorApplicationAttributes,
} from '@database/models/masters/master_vendor_application.model';

export const masterVendorApplicationResource = (
  data: MasterVendorApplication | MasterVendorApplicationAttributes
): MasterVendorApplicationAttributes => {
  return {
    id: data.id,
    name: data.name,
  };
};
