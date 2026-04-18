export interface RefreshRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    refreshToken: string;
    sessionId: string;
  };
}
