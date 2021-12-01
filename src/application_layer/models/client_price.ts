export default interface ClientPrice {
  raw: number;
  formatted_with_code: string;
  formatted_with_symbol: string;
}

export function createClientPrice(raw: number) {
  const r: ClientPrice = {
    raw: raw,
    formatted_with_code: `${raw} INR`,
    formatted_with_symbol: `Rs.${raw}`
  };
  
  return r;
}