package aftrade.server.core.model;

import aftrade.server.core.common.*;

import java.util.HashMap;
import java.util.Map;

public class Coupon extends Storable {
  private static int id = -1;
  private int _id = -1;

  public Coupon(){
    super("coupon", "id");
  }
  
  public Coupon(String item, String desc, String customer, String value, String limit, boolean autosave){
    super("coupon", "id");

    if(Coupon.id<0){
      Coupon.id = this.readAll().size();
    }

    Coupon.id++;
    this._id = Coupon.id;
    this.data = new HashMap<String, String>();
    this.data.put("id", String.valueOf(this._id));

    this.data.put("idItem", item);
    this.data.put("descricaoItem", desc);
    this.data.put("cliente", customer);
    this.data.put("valor", value);
    this.data.put("limite", limit);

    if(autosave){
      this.save();
    }
  }

  public int setId(String id){
    this._id = Integer.valueOf(id);
    this.data.put("id", String.valueOf(this._id));
    return this._id;
  }

  public int getId(){
    return this._id;
  }
}
