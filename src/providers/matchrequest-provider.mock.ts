/**
 * Mock MatchRequest provider for testing. Implements all public
 * methods in matchrequest-provider.ts.
 */
import { MatchRequest, User } from '../models/fantasydj-models';

export class MatchRequestDataMock {

  loadMatchRequest(requestId: string): Promise<MatchRequest> {
    return Promise.resolve(null);
  }

  createRequest(user: User): Promise<MatchRequest> {
    return Promise.resolve(null);
  }

};
