import { User, PushToken } from '@ionic/cloud-angular';

export class IonicCloudMock {

  public login(): Promise<User> {
    return Promise.resolve(null);
  };

  public initializePush(): Promise<PushToken> {
    return Promise.resolve(null);
  };

  public logout(): void {
    return;
  }

  public sendPush(externalId: string, message: string): Promise<any> {
    return Promise.resolve(null);
  }
};
