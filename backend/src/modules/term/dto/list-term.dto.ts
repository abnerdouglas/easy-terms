export class ListTermsDTO {
    constructor(
      readonly id: string,
      readonly title: string,
      readonly content: string,
      readonly version: string,
      readonly createdAt: string,
      readonly updatedAt: string,
      readonly isActive: boolean,
    ) {}
  }
  