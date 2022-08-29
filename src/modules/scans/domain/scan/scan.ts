import { BaseDomainEntity, Entity } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { Email, Name, Password } from '@shared/domain/value-objects';
import { ScanManga } from './scan-manga';
import { ScanMangas } from './scan-mangas';
import { ScanSlug } from './scan-slug';

type ScanProps = {
  email: Email;
  name: Name;
  slug: ScanSlug;
  password: Password;
  mangas?: ScanMangas;
  link?: string;
  cover?: string;
  description?: string;
  website?: string;
  discord?: string;
  facebook?: string;
} & BaseDomainEntity;

export class Scan extends Entity<ScanProps> {
  get email() {
    return this.props.email;
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
  }

  get password() {
    return this.props.password;
  }

  get link() {
    return this.props.link;
  }

  get cover() {
    return this.props.cover;
  }

  get description() {
    return this.props.description;
  }

  get facebook() {
    return this.props.facebook;
  }

  get discord() {
    return this.props.discord;
  }

  get website() {
    return this.props.website;
  }

  get mangas() {
    return this.props.mangas;
  }

  public generateLink() {
    const link = `/scans/${this.slug.value}/${this._id}`;
    this.props.link = link;
    this.props.updatedAt = new Date();
    return link;
  }

  public removeManga(manga: ScanManga): Result<void> {
    this.props.mangas.remove(manga);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public addManga(manga: ScanManga): Result<void> {
    this.props.mangas.add(manga);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public changeCoverImg(logo: string): Result<void> {
    this.props.cover = logo;
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  private constructor(props: ScanProps, id?: string) {
    super(props, id);
  }

  public static create(props: ScanProps, id?: string): Result<Scan> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.email, argumentName: 'email' },
      { argument: props.name, argumentName: 'name' },
      { argument: props.password, argumentName: 'password' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Scan>(guardResult.message);
    }

    return Result.ok<Scan>(
      new Scan(
        {
          ...props,
          mangas: props.mangas ?? ScanMangas.create([]),
        },
        id,
      ),
    );
  }
}
