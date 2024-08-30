package aftrade.util;

import java.util.*;
import org.json.JSONObject;
import java.util.stream.Collectors;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.io.IOException;
import java.lang.reflect.Field;

public class Util{

  public static String inputStreamToString(InputStream input) throws IOException{
     int bufferSize = 1024;
     char[] buffer = new char[bufferSize];
     StringBuilder out = new StringBuilder();
     Reader in = new InputStreamReader(input, StandardCharsets.UTF_8);
     for (int numRead; (numRead = in.read(buffer, 0, buffer.length)) > 0; ) {
       out.append(buffer, 0, numRead);
     }
     return out.toString();
  }

  public static Map<String, String> jsonToMapString(JSONObject object){
      Map<String, Object> objectMap = object.toMap();
      Map<String, String> stringMap = objectMap.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, e -> (String)e.getValue()));
      return stringMap;
  }

  public static Map<String, Object> convertUsingReflection(Object object) throws IllegalAccessException {
    Map<String, Object> map = new HashMap<>();
    Field[] fields = object.getClass().getDeclaredFields();

    for (Field field: fields) {
      field.setAccessible(true);
      map.put(field.getName(), field.get(object));
    }

    return map;
  }
}
