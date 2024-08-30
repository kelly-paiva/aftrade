import API from "../providers/API.js";

export default class Login {
  constructor(loginPageController) {
    this._loginPageController = loginPageController;
    this._loginPageController.onLogin((username, password) => {
      this._loginPageController.hideMessage();
      this.doLogin(username, password)
        .then(this._sucessfulLoginCallback)
        .catch((errMsg) => {
          if (errMsg) {
            this._loginPageController.showMessage(errMsg);
          }
        });
    });
  }

  async doLogin(username, password) {
    try {
      await API.doAuth(username, password);
      localStorage.setItem("userLogged", "logged");
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async saveData() {
    try {
      await API.saveData();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  doLogout() {
    localStorage.setItem("userToken", false);
    localStorage.setItem("userLogged", false);
  }

  _sucessfulLoginCallback() {
    console.error("Not implemented");
  }
  onSucessfulLogin(callback) {
    this._sucessfulLoginCallback = () => {
      callback(this.loggedData);
    };
  }

  isLogged() {
    return localStorage.getItem("userLogged") == "logged" && !!API.getToken();
  }
}
