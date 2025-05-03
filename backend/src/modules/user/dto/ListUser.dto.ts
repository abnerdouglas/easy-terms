export class ListUsersDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly role: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
