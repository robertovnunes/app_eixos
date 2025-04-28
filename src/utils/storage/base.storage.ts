// storage/BaseService.ts
import storageManager from '../services/storageService';
import Realm from 'realm';

class BaseService {
  protected async getRealm(): Promise<Realm> {
    return await storageManager.getRealmInstance();
  }
}


export default BaseService;