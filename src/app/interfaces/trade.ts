export interface Trade {
    id: number,
    idCard: number,
    nameCard: string,
    idOwner: number,
    idBuyer: number,
    status: number,
    local: string,          // local da troca
    description: string
}
