package aftrade.server.storage;

import java.io.*;

public abstract class Storage<T> {
  public abstract boolean saveTo(String key, T data);
  public abstract boolean saveTo(String key, T data, String path);
  public abstract T readFrom(String key, String path) throws IOException;
}
