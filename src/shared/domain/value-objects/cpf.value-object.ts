import { ValueObject } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { ValidatorUtil } from '@shared/utils';
import { InvalidCPFError } from './errors';

type CPFProps = {
  value: string;
};

export class CPF extends ValueObject<CPFProps> {
  get value() {
    return this.props.value;
  }

  private constructor(props: CPFProps) {
    super(props);
  }

  static validate(CPF: string): boolean {
    if (!ValidatorUtil.isCPF(CPF)) {
      return false;
    }

    return true;
  }

  static create(cpf: string): Result<CPF> {
    const guardResult = Guard.againstNullOrUndefined(cpf, 'CPF');
    if (!guardResult.succeeded) {
      return Result.fail<CPF>(guardResult.message);
    }

    if (!this.validate(cpf)) {
      return Result.fail<CPF>(new InvalidCPFError(cpf));
    }

    return Result.ok<CPF>(
      new CPF({
        value: cpf,
      }),
    );
  }
}
