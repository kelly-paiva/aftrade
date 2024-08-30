import API from "../providers/API.js";

export default class Coupon {
  async saveData(data) {
    try {
      let objToSend = Object.assign({}, data);

      if (objToSend._insert) objToSend._mode = "insert";
      delete objToSend._id;
      delete objToSend._insert;
      delete objToSend._edit;

      let newId = await API.saveCoupon(objToSend);

      data.id = newId.id;
      data._id = newId.id;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject("Erro ao inserir cupom");
    }
  }

  async deleteData(data) {
    try {
      let ids = data.map((d) => d.id).join(",");
      let deletedIds = await API.deleteCoupon({ id: ids });
      return Promise.resolve(deletedIds.ids.split(","));
    } catch (error) {
      return Promise.reject("Erro ao deletar cupons");
    }
  }

  async loadData() {
    let loadedData = await API.getCoupon({});
    return loadedData;
  }

  async searchData(customerId) {
    let loadedData = await API.getCoupon({ customerId });
    return loadedData;
  }

  async dispatchCoupon(data) {
    try {
      let ids = data.map((d) => d.id).join(",");
      let deletedIds = await API.deleteCoupon({ id: ids, mode: "dispatch" });
      return Promise.resolve(deletedIds.ids.split(","));
    } catch (error) {
      return Promise.reject("Erro ao processar cupons");
    }
  }
}
