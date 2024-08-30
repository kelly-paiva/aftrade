export default class API {
  static _SERVER_CONFIG = {
    HOST: "http://localhost:8080",
  };

  static objToQueryString(obj) {
    let queryString = [];
    for (let fKey in obj) {
      queryString.push(fKey + "=" + obj[fKey]);
    }
    queryString = queryString.length ? "?" + queryString.join("&") : "";
    return queryString;
  }

  static async doAuth(login, pass) {
    return fetch(this._SERVER_CONFIG.HOST + "/auth", {
      method: "POST",
      headers: new Headers({
        Authorization: btoa(`${login}:${pass}`),
      }),
      body: JSON.stringify({
        user: login,
        pass,
      }),
    })
      .then(async (response) => {
        if (response.status == "200") {
          let token = await response.json();
          API.setToken(token.token);
          return token.token;
        } else return Promise.reject(response);
      })
      .catch(async (error) => {
        return Promise.reject((await error.json()).msg);
      });
  }

  static setToken(token) {
    API.token = token;
    localStorage.setItem("userToken", token);
  }

  static getToken() {
    return API.token || localStorage.getItem("userToken");
  }

  static async saveData() {
    const route = "/save";
    return fetch(this._SERVER_CONFIG.HOST + route, {
      method: "GET",
      headers: new Headers({
        Authorization: btoa(API.getToken()),
      }),
    })
      .then(async (response) => {
        if (response.status == "200") {
          return await response.json();
        } else return Promise.reject(response);
      })
      .catch(async (error) => {
        return Promise.reject((await error.json()).msg);
      });
  }

  static async getItems(filters = {}) {
    const route = "/items" + API.objToQueryString(filters);
    return fetch(this._SERVER_CONFIG.HOST + route, {
      method: "GET",
      headers: new Headers({
        Authorization: btoa(API.getToken()),
      }),
    })
      .then(async (response) => {
        if (response.status == "200") {
          return await response.json();
        } else return Promise.reject(response);
      })
      .catch(async (error) => {
        return Promise.reject((await error.json()).msg);
      });
  }

  static async saveItem(itemToSave) {
    const route = "/items";
    return fetch(this._SERVER_CONFIG.HOST + route, {
      method: "POST",
      headers: new Headers({
        Authorization: btoa(API.getToken()),
      }),
      body: JSON.stringify(itemToSave),
    })
      .then(async (response) => {
        if (response.ok) return response;
        throw new Error(response.message);
      })
      .then(async (response) => {
        if (response.status == "200") {
          return await response.json();
        } else return Promise.reject(response);
      })
      .catch(async (error) => {
        return Promise.reject(error.toString());
      });
  }

  static async deleteItems(filters = {}) {
    const route = "/items" + API.objToQueryString(filters);
    return fetch(this._SERVER_CONFIG.HOST + route, {
      method: "DELETE",
      headers: new Headers({
        Authorization: btoa(API.getToken()),
      }),
    })
      .then(async (response) => {
        if (response.status == "200") {
          return await response.json();
        } else return Promise.reject(response);
      })
      .catch(async (error) => {
        return Promise.reject((await error.json()).msg);
      });
  }

  static async getCoupon(filters = {}) {
    const route = "/coupon" + API.objToQueryString(filters);
    return fetch(this._SERVER_CONFIG.HOST + route, {
      method: "GET",
      headers: new Headers({
        Authorization: btoa(API.getToken()),
      }),
    })
      .then(async (response) => {
        if (response.status == "200") {
          return await response.json();
        } else return Promise.reject(response);
      })
      .catch(async (error) => {
        return Promise.reject((await error.json()).msg);
      });
  }

  static async saveCoupon(itemToSave) {
    const route = "/coupon";
    return fetch(this._SERVER_CONFIG.HOST + route, {
      method: "POST",
      headers: new Headers({
        Authorization: btoa(API.getToken()),
      }),
      body: JSON.stringify(itemToSave),
    })
      .then(async (response) => {
        if (response.ok) return response;
        throw new Error(response.message);
      })
      .then(async (response) => {
        if (response.status == "200") {
          return await response.json();
        } else return Promise.reject(response);
      })
      .catch(async (error) => {
        return Promise.reject((await error.json()).msg);
      });
  }

  static async deleteCoupon(filters = {}) {
    const route = "/coupon" + API.objToQueryString(filters);
    return fetch(this._SERVER_CONFIG.HOST + route, {
      method: "DELETE",
      headers: new Headers({
        Authorization: btoa(API.getToken()),
      }),
    })
      .then(async (response) => {
        if (response.status == "200") {
          return await response.json();
        } else return Promise.reject(response);
      })
      .catch(async (error) => {
        return Promise.reject((await error.json()).msg);
      });
  }

  static async getUsers(filters = {}) {
    const route = "/user" + API.objToQueryString(filters);
    return fetch(this._SERVER_CONFIG.HOST + route, {
      method: "GET",
      headers: new Headers({
        Authorization: btoa(API.getToken()),
      }),
    })
      .then(async (response) => {
        if (response.status == "200") {
          return await response.json();
        } else return Promise.reject(response);
      })
      .catch(async (error) => {
        return Promise.reject((await error.json()).msg);
      });
  }

  static async saveUser(itemToSave) {
    const route = "/user";
    return fetch(this._SERVER_CONFIG.HOST + route, {
      method: "POST",
      headers: new Headers({
        Authorization: btoa(API.getToken()),
      }),
      body: JSON.stringify(itemToSave),
    })
      .then(async (response) => {
        if (response.ok) return response;
        throw new Error(response.message);
      })
      .then(async (response) => {
        if (response.status == "200") {
          return await response.json();
        } else return Promise.reject(response);
      })
      .catch(async (error) => {
        return Promise.reject((await error.json()).msg);
      });
  }

  static async deleteUser(filters = {}) {
    const route = "/user" + API.objToQueryString(filters);
    return fetch(this._SERVER_CONFIG.HOST + route, {
      method: "DELETE",
      headers: new Headers({
        Authorization: btoa(API.getToken()),
      }),
    })
      .then(async (response) => {
        if (response.status == "200") {
          return await response.json();
        } else return Promise.reject(response);
      })
      .catch(async (error) => {
        return Promise.reject((await error.json()).msg);
      });
  }
}
