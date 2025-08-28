import { CreateRoleDto } from '@common/dto/v2/msaV2/createRoleDto';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class UniqueProjectNameConstraint implements ValidatorConstraintInterface {
  validate(projects: any[], args: ValidationArguments) {
    if (!Array.isArray(projects)) return false;

    const names = projects.map((p) => p.name?.toLowerCase().trim());
    return names.length === new Set(names).size;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Duplicate project name is not allowed';
  }
}

@ValidatorConstraint({ async: false })
export class UniqueRoleConstraint implements ValidatorConstraintInterface {
  validate(roles: CreateRoleDto[], args: ValidationArguments) {
    if (!Array.isArray(roles)) return false;
    const names = roles.map((r) => r.role?.toLowerCase());
    return names.length === new Set(names).size; // false kalau ada duplicate
  }

  defaultMessage(args: ValidationArguments) {
    return 'Duplicate role is not allowed';
  }
}
