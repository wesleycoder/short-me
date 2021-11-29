declare module "is-domain-valid" {
  export type DomainOptions = {
    checkTld?: boolean;
    allowIdn?: boolean;
    allowSubdomain?: boolean;
    allowWildcard?: boolean;
  };
  export function isDomainValid(
    domain: string,
    options?: DomainOptions
  ): { result: boolean; message?: string };
  export default isDomainValid;
}
