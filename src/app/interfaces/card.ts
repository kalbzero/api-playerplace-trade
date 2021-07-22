export interface Card {
    id: number, // multiverseid
    multiverseId: number, // the true card id
    name: string,
    manaCost: string,
    cmc: number,
    colors: string[],
    colorIdentity: string[],
    type: string,
    supertypes: string[],
    types: string[],
    subtypes: string[],
    rarity: string,
    set: string,
    setName: string, // collection
    text: string,
    artist: string,
    number: string,
    power: number,
    toughness: number,
    imageUrl: string,
    originalText: string,
    originalType: string
}
