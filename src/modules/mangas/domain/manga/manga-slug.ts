import { ValueObject } from '@core/domain';
import { Result } from '@core/logic';

import slugify from 'slugify';

import { MangaTitle } from './manga-title';

export type MangaSlugProps = {
  value: string;
};

export class MangaSlug extends ValueObject<MangaSlugProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: MangaSlugProps) {
    super(props);
  }

  public static createFromExisting(slugName: string) {
    if (!!slugName === true) {
      return Result.ok<MangaSlug>(new MangaSlug({ value: slugName }));
    } else {
      return Result.fail<MangaSlug>('No slug passed in');
    }
  }

  public static create(postTitle: MangaTitle): Result<MangaSlug> {
    let returnSlug = '';

    // Run the slug algorithm here to create a slug
    // Strip all non alphabetic characters such as . / ; ,
    returnSlug = postTitle.value.replace(/[\W_]+/g, ' ');
    returnSlug = slugify(postTitle.value, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });

    return Result.ok<MangaSlug>(new MangaSlug({ value: returnSlug }));
  }
}
