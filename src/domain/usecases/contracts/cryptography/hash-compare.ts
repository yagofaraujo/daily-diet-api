export interface IHashComparer {
  compare(plain: string, hash: string): Promise<boolean>;
}
