export interface Trade {
    uid: string,
    id_card?: string,
    card_name: string,
    collection?: string,
    quality: string,
    trades_type: string,
    id_trades_type: string,
    id_trade_status: string,
    status: string,
    localization?: string,          // local da troca
    obs?: string
    id_buyer: string,
    buyer_name: string,
    buyer_status: string,
    buyer_id_status: string,
    security_postal_code_buyer?: string,
    id_seller: string,
    seller_name: string,
    seller_status: string,
    seller_id_status: string,
    security_postal_code_seller?: string,
    
}
