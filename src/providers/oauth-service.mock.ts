export class OAuthServiceMock {

  public static TOKEN = 'tokentokentokentokentokentokentokentoken';

  public token: string = null;

  public loginToSpotify(): Promise<any> {
    this.token = OAuthServiceMock.TOKEN;
    return Promise.resolve(this.token);
  }

};
