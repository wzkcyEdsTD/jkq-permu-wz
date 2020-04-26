import BaseFwAPI from "./base_mj_api";
export default class MenuAPI extends BaseFwAPI {
  getMenu(params) {
    return this.post("/menu/session", params);
  }

  fetchMenuList(params) {
    return this.get("/menu/list", params);
  }

  fetchMenuAll() {
    return this.get("/menu/all");
  }

  fetchMenuOption() {
    return this.get("/menu/option");
  }

  updateMenu(menu) {
    return this.put(`/menu/update/${menu.id}`, menu);
  }

  createMenu(menu) {
    return this.post("/menu", menu);
  }

  saveMenuStore(menuStore) {
    //  固定id = 1
    return this.put(`/menu/store/1`, { menuStore });
  }
}
