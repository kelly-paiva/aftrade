import PageRenderer from "../../../lib/PageRenderer.js";

export default class MainPageController {
  constructor(element) {
    this._renderer = new PageRenderer();
    this._element = element;
    this._setupHandlers();
  }

  _setupHandlers() {
    this._element
      .querySelector("#side-menu .entry#items-entry")
      .addEventListener("click", () => {
        this._itemsEntryCallback();
      });
    this._element
      .querySelector("#side-menu .entry#coupon-entry")
      .addEventListener("click", () => {
        this._couponEntryCallback();
      });
    this._element
      .querySelector("#side-menu .entry#admin-entry")
      .addEventListener("click", () => {
        this._adminEntryCallback();
      });
    this._element
      .querySelector("#side-menu .entry#logout-entry")
      .addEventListener("click", () => {
        this._logoutCallback();
      });
    this._element
      .querySelector("#side-menu .entry#save-entry")
      .addEventListener("click", () => {
        this._saveDataCallback();
      });
  }

  _itemsEntryCallback() {
    console.log("Method not implemented");
  }
  onOpenItems(callback) {
    this._itemsEntryCallback = () => {
      callback();
    };
  }

  _couponEntryCallback() {
    console.log("Method not implemented");
  }
  onOpenCoupon(callback) {
    this._couponEntryCallback = () => {
      callback();
    };
  }

  _adminEntryCallback() {
    console.log("Method not implemented");
  }
  onOpenAdmin(callback) {
    this._adminEntryCallback = () => {
      callback();
    };
  }

  _logoutCallback() {
    console.log("Method not implemented");
  }
  onLogout(callback) {
    this._logoutCallback = () => {
      callback();
    };
  }

  _saveDataCallback() {
    console.log("Method not implemented");
  }
  onSaveData(callback) {
    this._saveDataCallback = () => {
      callback();
    };
  }

  renderPage(path) {
    return this._renderer.render(
      this._element.querySelector(".main-section .container#page-container"),
      path,
    );
  }
}
