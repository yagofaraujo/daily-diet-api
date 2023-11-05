export interface IHashGenerator {
  hash(plain: string): Promise<string>;
}
