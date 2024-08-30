import PageRenderer from "../../../lib/PageRenderer.js";

export default class CouponPageController {
  constructor(element, componentsContext, afterInitCallback = () => {}) {
    this._renderer = new PageRenderer();
    this._componentsContext = componentsContext;
    this._element = element;
    this._afterInitCallback = afterInitCallback;
    this._initGrid();
    this._initHandlers();
  }

  _initGrid = async () => {
    const gridElem = this._element.querySelector("div.grid");
    const optionalActions = this._setupOptionalActions(gridElem);
    this._grid = new this._componentsContext.GridComponent(
      await this._renderer.render(gridElem, "@/components/grid"),
      {
        id: "__Id",
        idItem: "Item",
        descricaoItem: "Descrição",
        cliente: "Cliente",
        valor: "Valor (%)",
        limite: "Limite ($)",
      },
      {},
      optionalActions,
    );

    this._grid.onModalConfirm((data) => this._onSaveDataCallback(data));
    this._grid.onDelLine((selected) => this._onDeleteDataCallback(selected));
    this._afterInitCallback();
  };

  _initHandlers() {
    let modal = this._element.querySelector(".coupon-modal");
    modal.querySelector(".button#confirm-btn").addEventListener("click", () => {
      this._onSearchDataCallback();
    });
    modal.querySelector(".button#cancel-btn").addEventListener("click", () => {
      this._closeModal();
    });
  }

  _setupOptionalActions(gridElem) {
    let optionalActions = gridElem.querySelectorAll(".optional-action");
    return [
      [
        optionalActions[0],
        () => {
          this._openSearchModal();
        },
      ],
      [
        optionalActions[1],
        () => {
          this._onDispatchCouponCallback();
        },
      ],
      [
        optionalActions[2],
        () => {
          this._onRefreshCallback();
        },
      ],
    ];
  }

  _openSearchModal() {
    let modal = this._element.querySelector(".coupon-modal");
    modal.classList.toggle("hidden");
  }

  _closeModal() {
    let modal = this._element.querySelector(".coupon-modal");
    modal.classList.toggle("hidden");
    modal.querySelector("input").value = "";
  }

  _onSearchDataCallback() {}
  onSearchData(callback) {
    this._onSearchDataCallback = () => {
      let modal = this._element.querySelector(".coupon-modal");
      callback(modal.querySelector("input").value).then((data) => {
        this.setData(data);
        this._closeModal();
      });
    };
  }

  _onRefreshCallback() {}
  onRefreshData(callback) {
    this._onRefreshCallback = () => {
      callback().then((data) => {
        this.setData(data);
      });
    };
  }

  _onDispatchCouponCallback() {}
  onDispatchCoupon(callback) {
    this._onDispatchCouponCallback = () => {
      callback(this.getSelectedRows()).then((ids) => {
        ids.forEach((id) => {
          this._grid.removeRowById(id);
        });
      });
    };
  }

  _onSaveDataCallback() {}
  /**
   * O callback sera chamado e o dado a ser salvo sera passado
   * como objeto. O callback deve retornar uma promise que deve se resolver
   * com o objeto final de data que foi salvo, ou rejeitado com uma mensagem de erro.
   */
  onSaveData(callback) {
    this._onSaveDataCallback = callback;
  }

  _onDeleteDataCallback() {}
  /**
   * O callback sera chamado e o dado a ser deletado sera passado
   * como objeto. O callback deve retornar uma promise que deve se resolver
   * com um array de ids que será excluido, ou uma mensagem de erro.
   */
  onDeleteData(callback) {
    this._onDeleteDataCallback = callback;
  }

  _afterInitCallback() {}
  afterInit(callback) {
    this._afterInitCallback = callback;
  }

  getSelectedRows() {
    return this._grid.getSelectedRows();
  }
  setData(data) {
    this._grid.setData(data, true);
  }
}
