export interface GoogleUser extends Request {
  user: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
}
