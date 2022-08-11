export abstract class BaseDomainEntity {
  constructor(public createdAt?: Date, public updatedAt?: Date) {
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }
}
