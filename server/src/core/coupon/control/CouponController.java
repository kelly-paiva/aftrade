package aftrade.server.core.coupon;

import java.util.*;
import aftrade.server.core.model.*;

public class CouponController {

  public Map<String, Map<String, String>> loadData(){
    Map<String, Map<String, String>> data = (new Coupon()).readAll();
    return data;
  }

  public Map<String, Map<String, String>> searchByCustomer(String customerId){
    Map<String, Map<String, String>> source = (new Coupon()).readAll();
    Map<String, Map<String, String>> target = new HashMap<String, Map<String, String>>();

    for (Map.Entry<String, Map<String, String>> entry : source.entrySet()) {
      if(entry.getValue().get("cliente").equals(customerId)){
        target.put(customerId, entry.getValue());
      }
    }

    return target;
  }

  // Deve retornar o id do usuario inserido ou
  // disparar uma nova Exception contendo a mensagem com 
  // o motivo do erro
  public String insertData(Map<String, String> data) throws Exception{
    boolean inserting = false;
    if(data.containsKey("_mode")){
      inserting = data.get("_mode").equals("insert");
    }

    Coupon couponModel = new Coupon(
        data.get("idItem"), 
        data.get("descricaoItem"), 
        data.get("cliente"), 
        data.get("valor"), 
        data.get("limite"), 
        inserting
        );

    if(!inserting){
      couponModel.setId(data.get("id"));
      couponModel.save();
    }


    return String.valueOf(couponModel.getId());
  }

  public String deleteData(String[] data) throws Exception{
    Coupon couponModel = new Coupon();
    boolean deleted = false;

    if(data[1].contains(",")){
      for (String id : data[1].split(",")) {
        deleted = couponModel.delete(id);
      }
    } else deleted = couponModel.delete(data[1]);

    if(deleted) {
      return data[1];
    } else throw new Exception("Erro ao deletear registro");
  }
}
