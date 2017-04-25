/**
 * Unit tests for encode and decode functions in User Provider
 */
import { UserData } from './user-provider';

describe('User Provider', () => {

  it('encodes firebase-forbidden characters', () => {
    expect(UserData.encodeUsername('word')).toEqual('word');
    expect(UserData.encodeUsername('.')).toEqual('2E%');
    expect(UserData.encodeUsername('/')).toEqual('3E%');
    expect(UserData.encodeUsername('$')).toEqual('4E%');
    expect(UserData.encodeUsername('[')).toEqual('5E%');
    expect(UserData.encodeUsername(']')).toEqual('6E%');
    expect(UserData.encodeUsername('#')).toEqual('7E%');
  });

  it('decodes firebase-forbidden characters', () => {
    expect(UserData.decodeUsername('word')).toEqual('word');
    expect(UserData.decodeUsername('2E%')).toEqual('.');
    expect(UserData.decodeUsername('3E%')).toEqual('/');
    expect(UserData.decodeUsername('4E%')).toEqual('$');
    expect(UserData.decodeUsername('5E%')).toEqual('[');
    expect(UserData.decodeUsername('6E%')).toEqual(']');
    expect(UserData.decodeUsername('7E%')).toEqual('#');
  });

});
