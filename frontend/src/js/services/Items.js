import API from "../providers/API.js";

export default class Items {
  async saveData(data) {
    try {
      let objToSend = Object.assign({}, data);

      if (objToSend._insert) objToSend._mode = "insert";
      delete objToSend._id;
      delete objToSend._insert;
      delete objToSend._edit;

      let newId = await API.saveItem(objToSend);

      data.id = newId.id;
      data._id = newId.id;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject("Erro ao inserir item");
    }
  }

  async deleteData(data) {
    try {
      let ids = data.map((d) => d.id).join(",");
      let deletedIds = await API.deleteItems({ id: ids });
      return Promise.resolve(deletedIds.ids.split(","));
    } catch (error) {
      return Promise.reject("Erro ao deletar itens");
    }
  }

  async loadData() {
    let loadedData = await API.getItems({});
    return loadedData;
  }
}
