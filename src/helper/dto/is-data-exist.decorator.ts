import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Model, ModelStatic, WhereOptions } from 'sequelize';

export function IsDataExist<T extends Model>(
  model: ModelStatic<T>,
  column: keyof T['_attributes'], // pakai keyof attribute agar lebih ketat
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDataExist',
      target: object.constructor,
      propertyName,
      constraints: [model, column],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          if (value === null || value === undefined) return true;

          const [modelClass, col] = args.constraints as [ModelStatic<T>, keyof T['_attributes']];

          const where: WhereOptions<T['_attributes']> = {
            [col]: value,
          } as any; // 🔑 cast biar sesuai typing

          const found = await modelClass.findOne({ where });
          return !!found;
        },
        defaultMessage(args: ValidationArguments) {
          const [, col] = args.constraints;
          return `${args.property} with given ${String(col)} does not exist in database`;
        },
      },
    });
  };
}
