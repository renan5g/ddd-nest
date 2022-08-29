import { BaseDomainEntity, Entity } from '@core/domain';
import { Guard, Result } from '@core/logic';

import {
  Genre,
  MangaAlternativeTitles,
  MangaGenres,
  MangaSlug,
  MangaStatus,
  MangaSynopsis,
  MangaTitle,
  MangaType,
} from '@modules/mangas/domain/manga';
import { MangaDemography } from './manga-demography';

type MangaProps = {
  title: MangaTitle;
  slug?: MangaSlug;
  alternativeTitles?: MangaAlternativeTitles;
  genres?: MangaGenres;
  synopsis?: MangaSynopsis;
  author?: string;
  artist?: string;
  status: MangaStatus;
  format: MangaType;
  demography?: MangaDemography;
  poster?: string;
  cover?: string;
  lastPublishedAt?: Date;
} & BaseDomainEntity;

export class Manga extends Entity<MangaProps> {
  get title() {
    return this.props.title;
  }

  get slug() {
    return this.props.slug;
  }

  get alternativeTitles() {
    return this.props.alternativeTitles;
  }

  get synopsis() {
    return this.props.synopsis;
  }

  get author() {
    return this.props.author;
  }

  get artist() {
    return this.props.artist;
  }

  get status() {
    return this.props.status;
  }

  get format() {
    return this.props.format;
  }

  get demography() {
    return this.props.demography;
  }

  get poster() {
    return this.props.poster;
  }

  get cover() {
    return this.props.cover;
  }

  get lastPublishedAt() {
    return this.props.lastPublishedAt;
  }

  get genres() {
    return this.props.genres;
  }

  private constructor(props: MangaProps, id?: string) {
    super(props, id);
  }

  public changeCoverImg(coverImage: string) {
    this.props.cover = coverImage;
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public changePosterImg(postImage: string) {
    this.props.poster = postImage;
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public removeAlternativeTitle(title: MangaTitle): Result<void> {
    this.props.alternativeTitles.remove(title);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public addAlternativeTitle(title: MangaTitle): Result<void> {
    this.props.alternativeTitles.add(title);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public setAlternativeTitles(titles: MangaTitle[]): Result<void> {
    this.props.alternativeTitles = MangaAlternativeTitles.create(titles);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public removeGenre(genre: Genre): Result<void> {
    this.props.genres.remove(genre);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public addGenre(genre: Genre): Result<void> {
    this.props.genres.add(genre);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public setGenres(genres: Genre[]): Result<void> {
    this.props.genres = MangaGenres.create(genres);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  static create(props: MangaProps, id?: string): Result<Manga> {
    const guardProps = [
      { argument: props.format, argumentName: 'format' },
      { argument: props.title, argumentName: 'title' },
      { argument: props.status, argumentName: 'status' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardProps);
    if (!guardResult.succeeded) {
      return Result.fail<Manga>(guardResult.message);
    }

    return Result.ok<Manga>(
      new Manga(
        {
          ...props,
          genres: props.genres ?? MangaGenres.create([]),
          alternativeTitles:
            props.alternativeTitles ?? MangaAlternativeTitles.create([]),
        },
        id,
      ),
    );
  }
}
