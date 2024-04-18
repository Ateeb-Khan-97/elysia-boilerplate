import { v4 as uuidv4 } from 'uuid';

export function CommonService() {
  function exclude<T, Key extends keyof T>(
    object: T,
    objectKeys: Key[],
  ): Omit<T, Key> {
    return Object.fromEntries(
      Object.entries(object).filter(
        ([key]) => !objectKeys.includes(key as any),
      ),
    ) as Omit<T, Key>;
  }

  function uuidGenerator() {
    return uuidv4();
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function removeSpecialCharacters(inputString: string): string {
    return inputString.replace(/[^\w\s]/gi, '');
  }

  function generateRandomName(nameLength = 16) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let randomName = '';
    for (let i = 0; i < nameLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomName += characters.charAt(randomIndex);
    }

    return randomName;
  }

  function passwordValidator(password: string) {
    try {
      if (password.length < 8)
        throw new Error('Password must be at least 8 characters long');
      if (!/[A-Z]/.test(password))
        throw new Error('Password must have at least one capital letter');
      if (!/[a-z]/.test(password))
        throw new Error('Password must have at least one small letter');
      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password))
        throw new Error('Password must have at least one special character');
      return { success: true, message: null };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  return {
    exclude,
    uuidGenerator,
    delay,
    removeSpecialCharacters,
    generateRandomName,
    passwordValidator,
  };
}
