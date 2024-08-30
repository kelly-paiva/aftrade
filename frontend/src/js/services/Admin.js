import API from "../providers/API.js";

export default class Admin {
  async saveData(data) {
    try {
      let objToSend = Object.assign({}, data);

      if (objToSend._insert) objToSend._mode = "insert";
      delete objToSend._id;
      delete objToSend._insert;
      delete objToSend._edit;

      let newId = await API.saveUser(objToSend);

      data.id = newId.id;
      data._id = newId.id;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject("Erro ao inserir usuário");
    }
  }

  async deleteData(data) {
    try {
      let ids = data.map((d) => d.id).join(",");
      let deletedIds = await API.deleteUser({ id: ids });
      return Promise.resolve(deletedIds.ids.split(","));
    } catch (error) {
      return Promise.reject("Erro ao deletar usuários");
    }
  }

  async loadData() {
    let loadedData = await API.getUsers({});
    return loadedData;
  }
}
