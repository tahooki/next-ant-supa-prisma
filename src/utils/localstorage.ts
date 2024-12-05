class LocalStorage {
  static setItem(key: string, item: any) {
    if (typeof window !== "undefined") {
      if (item && typeof item === "object") {
        item = JSON.stringify(item);
      }
      localStorage.setItem(key, item);
    }
  }

  static getItem(key: string) {
    if (typeof window !== "undefined") {
      let item = localStorage.getItem(key);
      try {
        if (item && typeof item === "string") {
          item = JSON.parse(item as string);
        }
      } catch (e) {
        return item;
      }

      return item;
    }
    return null;
  }

  static removeItem(key: string) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }
}

export default LocalStorage;
