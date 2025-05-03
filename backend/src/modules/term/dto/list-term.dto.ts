export class ListTermsDTO {
    constructor(
      readonly id: string,
      readonly title: string,
      readonly content: string,
      readonly version: string,
      readonly createdAt: Date,
      readonly updatedAt: Date,
      readonly isActive: boolean,
    ) {}
  }
  