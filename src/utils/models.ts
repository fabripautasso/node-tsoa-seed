import { generate } from "randomstring";

export const generateMockUUID = (): string => {
  return `${generate(8)}-${generate(4)}-${generate(4)}-${generate(
    4
  )}-${generate(12)}`;
};

export const generateUserModel = () => ({
  id: generateMockUUID(),
  email: generate(20),
  name: generate(20),
  phone: generate(20),
  skype: generate(20)
});
