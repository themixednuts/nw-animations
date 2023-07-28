export function xpathmatch(attribute: string, key: string, match: boolean) {
  return match ? `lower-case(@${attribute}) = lower-case("${key}")` : `contains(lower-case(@${attribute}), lower-case("${key}"))`
}
