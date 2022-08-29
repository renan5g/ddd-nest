import { ValueObject } from '@core/domain';
import { Result } from '@core/logic';

import slugify from 'slugify';

export type ScanSlugProps = {
  value: string;
};

export class ScanSlug extends ValueObject<ScanSlugProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ScanSlugProps) {
    super(props);
  }

  public static createFromExisting(slugName: string) {
    if (!slugName) {
      return Result.fail<ScanSlug>('No slug passed in');
    }

    return Result.ok<ScanSlug>(new ScanSlug({ value: slugName }));
  }

  public static create(scanName: string): Result<ScanSlug> {
    let returnSlug = '';

    // Run the slug algorithm here to create a slug
    // Strip all non alphabetic characters such as . / ; ,
    returnSlug = scanName.replace(/[\W_]+/g, ' ');
    returnSlug = slugify(scanName, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });

    return Result.ok<ScanSlug>(new ScanSlug({ value: returnSlug }));
  }
}
