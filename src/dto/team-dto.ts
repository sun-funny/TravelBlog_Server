export class TeamDto {
  readonly id: string;
  readonly name: string;
  readonly greeting: string;
  readonly image: string;
  readonly position: {
    top: string;
    left: string;
  };
  readonly direction: string;
  readonly description: string;
}