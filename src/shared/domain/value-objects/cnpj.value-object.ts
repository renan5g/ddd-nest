import { ValueObject } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { ValidatorUtil } from '@shared/utils';
import { InvalidCNPJError } from './errors';

type CNPJProps = {
  value: string;
};

export class CNPJ extends ValueObject<CNPJProps> {
  get value() {
    return this.props.value;
  }

  private constructor(props: CNPJProps) {
    super(props);
  }

  static validate(CNPJ: string): boolean {
    if (!ValidatorUtil.isCNPJ(CNPJ)) {
      return false;
    }

    return true;
  }

  static create(value: string): Result<CNPJ> {
    const guardResult = Guard.againstNullOrUndefined(value, 'CNPJ');
    if (!guardResult.succeeded) {
      return Result.fail<CNPJ>(guardResult.message);
    }

    if (!this.validate(value)) {
      return Result.fail<CNPJ>(new InvalidCNPJError(value));
    }

    return Result.ok<CNPJ>(
      new CNPJ({
        value: value,
      }),
    );
  }
}
