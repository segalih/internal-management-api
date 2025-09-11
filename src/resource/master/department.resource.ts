import MasterDepartment, { MasterDepartmentAttributes } from '@database/models/masters/master_department.model';
import { masterGroupResource } from './group.resource';

export const masterDepartmentResource = (
  data: MasterDepartment | MasterDepartmentAttributes
): MasterDepartmentAttributes => {
  return {
    id: data.id,
    groupId: data.groupId,
    name: data.name,
    group: data.group ? masterGroupResource(data.group) : undefined,
  };
};
