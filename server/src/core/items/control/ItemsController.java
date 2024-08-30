package aftrade.server.core.items;

import java.util.*;
import aftrade.server.core.model.*;

public class ItemsController {
  public Map<String, Map<String, String>> loadData(){
    Map<String, Map<String, String>> data = (new Item()).readAll();
    return data;
  }

  // Deve retornar o id do usuario inserido ou
  // disparar uma nova Exception contendo a mensagem com 
  // o motivo do erro
  public String insertData(Map<String, String> data) throws Exception{
    boolean inserting = false;
    if(data.containsKey("_mode")){
      inserting = data.get("_mode").equals("insert");
    }

    Item itemModel = new Item(
        data.get("descricao"), 
        data.get("estado"), 
        data.get("cliente"), 
        inserting
        );

    if(!inserting){
      itemModel.setId(data.get("id"));
      itemModel.save();
    }


    return String.valueOf(itemModel.getId());
  }

  public String deleteData(String[] data) throws Exception{
    Item itemModel = new Item();
    boolean deleted = false;

    if(data[1].contains(",")){
      for (String id : data[1].split(",")) {
        deleted = itemModel.delete(id);
      }
    } else deleted = itemModel.delete(data[1]);

    if(deleted) {
      return data[1];
    } else throw new Exception("Erro ao deletear registro");
  }
}
