export class CountryContentDto {
  readonly countryId: string;
  readonly content: string;
  readonly updatedBy?: string;
  readonly carouselImages?: string[];
}