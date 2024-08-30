export default class GridComponent {
  constructor(element, cols = {}, data = {}, optActions = []) {
    this._element = element;
    this._cols = cols;
    this._data = data;
    this._optActions = optActions;

    this._addOptinalActions();
    this._drawTable();
    this._initHandlers();
  }

  _drawTable() {
    const gridTable = this._element.querySelector(".grid-table");
    let hasData = this._toggleNoData(gridTable);

    if (hasData) {
      this._renderData(gridTable);
    }
  }

  _initHandlers() {
    let gridActions = this._element.querySelector(".grid-actions");
    let gridModal = this._element.querySelector(".grid-modal");
    gridActions
      .querySelector(".button#add-btn")
      .addEventListener("click", () => {
        this._addNewLine();
      });
    gridActions
      .querySelector(".button#del-btn")
      .addEventListener("click", () => {
        this._delCallback();
      });
    gridActions
      .querySelector(".button#edit-btn")
      .addEventListener("click", () => {
        this._editLine();
      });
    gridModal
      .querySelector(".button#confirm-btn")
      .addEventListener("click", () => {
        this._modalConfirmCallback();
      });
    gridModal
      .querySelector(".button#cancel-btn")
      .addEventListener("click", () => {
        this._modalCancelCallback();
      });
  }

  _addOptinalActions() {
    let gridActions = this._element.querySelector(".grid-actions");
    this._optActions.forEach((action) => {
      if (action.length != 2)
        throw new Error("optional actions not correct format");

      let actionElm = action[0];
      let actionHandler = action[1];

      actionElm.addEventListener("click", () => {
        actionHandler();
      });

      gridActions.appendChild(actionElm);
    });
  }

  _toggleNoData(gridTableElem) {
    if (Object.keys(this._data).length) {
      gridTableElem.querySelector(".no-data").classList.add("hidden");
      gridTableElem.querySelector("table").classList.remove("hidden");
      return true;
    }

    gridTableElem.querySelector(".no-data").classList.remove("hidden");
    gridTableElem.querySelector("table").classList.add("hidden");
    return false;
  }

  _renderData(gridTableElem) {
    const tableElem = gridTableElem.querySelector("table");
    tableElem.tBodies[0].innerHTML = "";
    this._renderHeader(tableElem);
    this._renderRows(tableElem);
  }

  _renderHeader(tableElem) {
    let newRow = tableElem.tBodies[0].insertRow();
    for (const col in this._cols) {
      if (this._cols.hasOwnProperty(col)) {
        const colDescription = this._cols[col];
        if (!colDescription.includes("$$")) {
          let colH = document.createElement("th");
          colH.innerText = colDescription.replaceAll("__", "");
          newRow.appendChild(colH);
        }
      }
    }
  }

  _renderRows(tableElem) {
    for (const key in this._data) {
      if (this._data.hasOwnProperty(key)) {
        const valObj = this._data[key];
        let newRow = tableElem.tBodies[0].insertRow();
        newRow.setAttribute("id", key);
        valObj._id = key;
        newRow.classList.add("row");
        newRow.addEventListener("click", (event) => {
          let row = event.target.parentElement;
          let marked = row.classList.toggle("selected");
          this._data[row.getAttribute("id")]._selected = marked;
        });

        for (const col in this._cols) {
          if (this._cols.hasOwnProperty(col)) {
            const colDescription = this._cols[col];
            if (!colDescription.includes("$$")) {
              let newCol = document.createElement("td");
              newCol.innerText = valObj[col];
              newRow.appendChild(newCol);
            }
          }
        }
      }
    }
  }

  insertRow(insertData) {
    const tableElem = this._element.querySelector(".grid-table table");
    let newRow = tableElem.tBodies[0].insertRow();
    newRow.setAttribute("id", insertData._id);
    newRow.classList.add("row");
    newRow.addEventListener("click", (event) => {
      let row = event.target.parentElement;
      let marked = row.classList.toggle("selected");
      this._data[row.getAttribute("id")]._selected = marked;
    });
    this._data[insertData._id] = insertData;

    for (const col in this._cols) {
      if (this._cols.hasOwnProperty(col)) {
        let newCol = document.createElement("td");
        newCol.innerText = insertData[col] || "";
        newRow.appendChild(newCol);
      }
    }
  }

  setData(data, autorender = false) {
    const gridTable = this._element.querySelector(".grid-table");
    this._data = data;
    let hasData = this._toggleNoData(gridTable);

    if (autorender && hasData) {
      this._renderData(gridTable);
    }
  }

  _addNewLine() {
    this._openModal(this._cols, "Novo Registro", {}, "_insert");
  }
  afterAddLine(callback) {
    this._afterAddLineCallback = callback;
  }

  _delCallback() {
    console.log("Not implemented");
  }
  onDelLine(callback) {
    this._delCallback = () => {
      callback(this.getSelectedRows())
        .then((idsToRemove = []) => {
          idsToRemove.forEach((id) => {
            this.removeRowById(id);
          });
        })
        .catch((message) => alert(message));
    };
  }
  removeRowById(id) {
    const tableBody = this._element.querySelector(".grid-table table tbody");
    delete this._data[id];
    const row = tableBody.querySelector(`tr.row[id='${id}']`);
    tableBody.removeChild(row);
  }

  _openModal(fields, title = "", data = {}, mode = "_edit") {
    let gridModal = this._element.querySelector(".grid-modal");
    gridModal.classList.toggle("hidden");
    gridModal.setAttribute("mode", mode);
    gridModal.setAttribute("row-id", data._id);
    let modalActions = gridModal.querySelector(".modal-actions");

    for (const field in fields) {
      if (fields.hasOwnProperty(field)) {
        const fieldDesc = fields[field];
        let fieldElm = document.createElement("input");
        fieldElm.setAttribute("type", "text");
        fieldElm.setAttribute("name", field);
        fieldElm.setAttribute("placeholder", fieldDesc.replaceAll("$$", ""));
        fieldElm.value = data[field] || "";

        if (fieldDesc.includes("__")) fieldElm.classList.add("hidden");

        gridModal.insertBefore(fieldElm, modalActions);
      }
    }

    gridModal.querySelector(".modal-title").innerText = title;
  }
  _closeModal(gridModal) {
    gridModal.classList.toggle("hidden");
    gridModal.replaceChildren(
      gridModal.children[0],
      gridModal.children[gridModal.children.length - 1],
    );
  }

  _modalConfirmCallback() {
    console.error("Not implemented");
  }
  onModalConfirm = (callback) => {
    this._modalConfirmCallback = () => {
      let gridModal = this._element.querySelector(".grid-modal");
      let dataObj = {};
      for (const field of gridModal.querySelectorAll("input")) {
        dataObj[field.getAttribute("name")] = field.value;
      }
      dataObj[gridModal.getAttribute("mode")] = true;
      dataObj._id = gridModal.getAttribute("row-id");

      return callback(dataObj)
        .then((retData) => {
          if (!Object.keys(this._data).length) {
            const gridTable = this._element.querySelector(".grid-table");
            this._renderHeader(gridTable.querySelector("table"));
            this.insertRow(retData);
            this._toggleNoData(gridTable);
          } else {
            this.insertRow(retData);
          }

          if (retData._edit) {
            console.log("edit");
            this.removeRowById(retData._id);
          }

          this._closeModal(gridModal);
        })
        .catch((errMsg) => this._modalShowError(errMsg, gridModal));
    };
  };
  _modalShowError(msg, gridModal) {
    let modalActions = gridModal.querySelector(".modal-actions");
    let errorMsg = document.createElement("span");
    errorMsg.classList.add("err-msg");
    errorMsg.innerText = msg;

    gridModal.insertBefore(errorMsg, modalActions);
  }
  _modalCancelCallback() {
    let gridModal = this._element.querySelector(".grid-modal");
    this._closeModal(gridModal);
  }

  getSelectedRows = () => {
    return Object.values(this._data).filter((item) => item._selected);
  };

  _editLine() {
    let selectedLines = this.getSelectedRows();
    if (selectedLines.length == 1) {
      selectedLines[0]._edit = true;
      this._openModal(this._cols, "Editar Registro", selectedLines[0]);
    } else alert("Mais de uma linha selecionada");
  }
}
