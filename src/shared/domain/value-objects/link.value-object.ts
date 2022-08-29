import { ValueObject } from '@core/domain';
import { Guard, Result } from '@core/logic';

type LinkProps = {
  url: string;
};

export class Link extends ValueObject<LinkProps> {
  get url(): string {
    return this.props.url;
  }

  private constructor(props: LinkProps) {
    super(props);
  }

  public static create(props: LinkProps): Result<Link> {
    const nullGuard = Guard.againstNullOrUndefined(props.url, 'url');

    if (!nullGuard.succeeded) {
      return Result.fail<Link>(nullGuard.message);
    }

    // if (!TextUtil.validateWebURL(props.url)) {
    //   return Result.fail<Link>(`Url {${props.url}} is not valid.`);
    // }

    return Result.ok<Link>(new Link(props));
  }
}
