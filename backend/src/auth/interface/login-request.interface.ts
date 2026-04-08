export interface LoginRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}
