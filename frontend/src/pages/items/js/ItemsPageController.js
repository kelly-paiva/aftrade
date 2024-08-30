import PageRenderer from "../../../lib/PageRenderer.js";

export default class ItemsPageController {
  constructor(element, componentsContext, afterInitCallback = () => {}) {
    this._renderer = new PageRenderer();
    this._componentsContext = componentsContext;
    this._element = element;
    this._afterInitCallback = afterInitCallback;
    this._initGrid();
  }

  async _initGrid() {
    const gridElem = this._element.querySelector("div.grid");
    this._grid = new this._componentsContext.GridComponent(
      await this._renderer.render(gridElem, "@/components/grid"),
      {
        id: "__Id",
        descricao: "Descrição",
        estado: "Estado",
        cliente: "Cliente",
      },
    );

    this._grid.onModalConfirm((data) => this._onSaveDataCallback(data));
    this._grid.onDelLine((selected) => this._onDeleteDataCallback(selected));
    this._afterInitCallback();
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
