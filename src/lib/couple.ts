import type { Person, WeddingConfig } from '../config/wedding.config'

export type CoupleKey = 'bride' | 'groom'

export interface OrderedCoupleMember {
  key: CoupleKey
  person: Person
}

/** The display order is repository-specific while roles stay semantically tied. */
export function getOrderedCouple(
  config: Pick<WeddingConfig, 'site' | 'couple'>,
): [OrderedCoupleMember, OrderedCoupleMember] {
  const [firstKey, secondKey] = config.site.coupleOrder
  return [
    { key: firstKey, person: config.couple[firstKey] },
    { key: secondKey, person: config.couple[secondKey] },
  ]
}
