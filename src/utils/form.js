import { validator } from 'indicative';

export const validateAll = async (data, rules) => {
  return await validator
    .validateAll(data, rules)
    .then(() => null)
    .catch((err) => err);
};
