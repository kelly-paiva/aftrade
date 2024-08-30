package aftrade.server.core.admin;

import java.util.*;
import aftrade.server.core.model.*;

public class AdminController {
  public Map<String, Map<String, String>> loadUserData(){
    Map<String, Map<String, String>> data = (new User()).readAll();
    return data;
  }

  public String insertUserData(Map<String, String> data) throws Exception{
    boolean inserting = false;
    if(data.containsKey("_mode")){
      inserting = data.get("_mode").equals("insert");
    }

    User userModel = new User(
        data.get("login"), 
        data.get("nome"), 
        data.get("pass"), 
        data.get("tipo"), 
        data.get("situacao"), 
        inserting
        );

    if(!inserting){
      userModel.setId(data.get("login"));
      userModel.save();
    }


    return String.valueOf(userModel.getId());
  }

  public String deleteUserData(String[] data) throws Exception{
    User userModel = new User();
    boolean deleted = false;

    if(data[1].contains(",")){
      for (String id : data[1].split(",")) {
        deleted = userModel.delete(id);
      }
    } else deleted = userModel.delete(data[1]);

    if(deleted) {
      return data[1];
    } else throw new Exception("Erro ao deletear registro");
  }
}
