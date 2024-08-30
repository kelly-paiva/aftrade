export default class LoginPageController {
  constructor(element) {
    this._element = element;
    this._setupHandlers();
  }

  _setupHandlers() {
    this._element.querySelector("#login-btn").addEventListener("click", () => {
      this._loginCallback();
    });
  }

  _loginCallback() {
    console.warn("Not implemented");
  }
  onLogin(callback) {
    this._loginCallback = () => {
      callback(
        this._element.querySelector("#user-field").value,
        this._element.querySelector("#pass-field").value,
      );
    };
  }

  showMessage(newMessage = "") {
    const msgElement = this._element.querySelector(".message");

    msgElement.innerText = newMessage;
    msgElement.classList.remove("hidden");
  }

  hideMessage() {
    const msgElement = this._element.querySelector(".message");
    msgElement.classList.add("hidden");
  }
}
