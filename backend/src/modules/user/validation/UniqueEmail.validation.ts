import { Injectable, NotFoundException } from "@nestjs/common";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { UserService } from "../user.service";

@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(value: any, validationOptions?: ValidationArguments): Promise<boolean> {
    try {
      const userWithExistingEmail = await this.userService.findByEmail(value);

      return !userWithExistingEmail;
      
    } catch (erro) {
      if (erro instanceof NotFoundException) {
        return true;
      }

      throw erro;
    }
  }
}

export const UniqueEmail = (validationOptions: ValidationOptions) => {
  return (object: object, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: UniqueEmailValidator,
    });
  };
};
