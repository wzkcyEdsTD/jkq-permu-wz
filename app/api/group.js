import BaseFwAPI from './base_mj_api';
export default class GroupAPI extends BaseFwAPI {
  getGroup(params) {
    return this.get('/group/session', params);
  }

  fetchGroupList(params) {
    return this.get('/group/list', params);
  }

  fetchGroupOption() {
    return this.get('/group/option');
  }

  updateGroup(group) {
    return this.put(`/group/update/${group.id}`, group);
  }

  createGroup(group) {
    return this.post('/group', group);
  }
}
