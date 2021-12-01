import ClientUser from "./user";

export interface Token {
  user_id: string;  
}

export default interface SignupResponse {
  token: Token;
  user: ClientUser;
}