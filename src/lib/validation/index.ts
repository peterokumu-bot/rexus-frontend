import phoneValidator from './validators/phone.validator';
import emailValidator from './validators/email.validator';
import nameValidator from './validators/name.validator';
import passwordValidator from './validators/password.validator';

export type ValidationType =
  | 'phone-ke'
  | 'email'
  | 'name'
  | 'password';

export const validators = {
  'phone-ke': phoneValidator,
  email: emailValidator,
  name: nameValidator,
  password: passwordValidator,
};