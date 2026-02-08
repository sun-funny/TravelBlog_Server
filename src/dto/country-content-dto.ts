export class CarouselPositionDto {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly originalWidth?: number;
  readonly originalHeight?: number;
}

export class CountryContentDto {
  readonly countryId: string;
  readonly content: string;
  readonly updatedBy?: string;
  readonly carouselImages?: string[];
  readonly carouselPositions?: CarouselPositionDto[]; 
}