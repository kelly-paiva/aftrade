package aftrade.server.core.model;

import aftrade.server.core.common.*;

import java.util.HashMap;
import java.util.Map;

public class Item extends Storable {
  private static int id = -1;
  private int _id = -1;

  public Item(){
    super("item", "id");
  }
  
  public Item(String desc, String state, String customer, boolean autosave){
    super("item", "id");

    if(Item.id<0){
      Item.id = this.readAll().size();
    }

    Item.id++;
    this._id = Item.id;
    this.data = new HashMap<String, String>();
    this.data.put("id", String.valueOf(this._id));

    this.data.put("descricao", desc);
    this.data.put("estado", state);
    this.data.put("cliente", customer);

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
