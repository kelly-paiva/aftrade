package aftrade.server.core.common;

public interface IStorable<T> {
  boolean save();
  T read(String key);
  boolean delete(String key);
}
