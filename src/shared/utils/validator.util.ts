import validator from 'validator';

export class ValidatorUtil {
  public static isUUID(text: string): boolean {
    return validator.isUUID(text);
  }

  public static isEmail(email: string) {
    return validator.isEmail(email);
  }

  public static isURL(url: string): boolean {
    return validator.isURL(url);
  }

  public static isCNPJ(text: string): boolean {
    const re =
      /^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})$/;
    return re.test(String(text));
  }

  public static isCPF(text: string): boolean {
    const re =
      /^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})$/;
    return re.test(String(text));
  }
}
