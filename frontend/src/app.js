import PageRenderer from "./lib/PageRenderer.js";

import Login from "./js/services/Login.js";
import Items from "./js/services/Items.js";
import Admin from "./js/services/Admin.js";
import Coupon from "./js/services/Coupon.js";

import PagesContext from "./pages/index.js";
import ComponentsContext from "./components/index.js";

export default class App {
  constructor() {
    this._renderer = new PageRenderer();
    this.loginPage();
  }

  loginPage = () => {
    this._renderer
      .render(document.querySelector("#main-container"), "@/pages/login")
      .then((loginElement) => {
        this._loginPageController = new PagesContext.LoginPageController(
          loginElement,
        );
        this.loginService = new Login(this._loginPageController);
        if (this.loginService.isLogged()) this.mainPage();
        else this.loginService.onSucessfulLogin(this.mainPage);
      });
  };

  mainPage = () => {
    this._renderer
      .render(document.querySelector("#main-container"), "@/pages/main")
      .then((mainPageElement) => {
        this._mainPageController = new PagesContext.MainPageController(
          mainPageElement,
        );
        this._mainPageController.onOpenItems(this.itemsPage);
        this._mainPageController.onOpenAdmin(this.adminPage);
        this._mainPageController.onOpenCoupon(this.couponPage);
        this._mainPageController.onLogout(this.doLogout);
        this._mainPageController.onSaveData(this.saveData);

        this.itemsPage();
      });
  };

  doLogout = () => {
    this.loginService.doLogout();
    window.location.reload();
  };

  saveData = () => {
    this.loginService.saveData().then(() => {
      alert("Dados salvos no disco!");
    });
  };

  itemsPage = () => {
    this._mainPageController
      .renderPage("@/pages/items")
      .then((itemsPageElement) => {
        this.itemsService = new Items();
        this._itemsPageController = new PagesContext.ItemsPageController(
          itemsPageElement,
          ComponentsContext,
          async () => {
            this._itemsPageController.setData(
              await this.itemsService.loadData(),
            );
          },
        );

        this._itemsPageController.onSaveData(this.itemsService.saveData);
        this._itemsPageController.onDeleteData(this.itemsService.deleteData);
      });
  };

  adminPage = () => {
    this._mainPageController
      .renderPage("@/pages/admin")
      .then((adminPageElement) => {
        this.adminService = new Admin();
        this._adminPageController = new PagesContext.AdminPageController(
          adminPageElement,
          ComponentsContext,
          async () => {
            this._adminPageController.setData(
              await this.adminService.loadData(),
            );
          },
        );

        this._adminPageController.onSaveData(this.adminService.saveData);
        this._adminPageController.onDeleteData(this.adminService.deleteData);
      });
  };

  couponPage = () => {
    this._mainPageController
      .renderPage("@/pages/coupon")
      .then((couponPageElement) => {
        this.couponService = new Coupon();
        this._couponPageController = new PagesContext.CouponPageController(
          couponPageElement,
          ComponentsContext,
          async () => {
            this._couponPageController.setData(
              await this.couponService.loadData(),
            );
          },
        );

        this._couponPageController.onSaveData(this.couponService.saveData);
        this._couponPageController.onDeleteData(this.couponService.deleteData);
        this._couponPageController.onSearchData(this.couponService.searchData);
        this._couponPageController.onDispatchCoupon(
          this.couponService.dispatchCoupon,
        );
        this._couponPageController.onRefreshData(this.couponService.loadData);
      });
  };
}
