class SessionStorage {
  static setItem(key: string, item: string) {
    if (typeof window !== "undefined") {
      if (item && typeof item === "object") {
        item = JSON.stringify(item);
      }
      sessionStorage.setItem(key, item);
    }
  }

  static getItem(key: string) {
    if (typeof window !== "undefined") {
      let item = sessionStorage.getItem(key);
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
      sessionStorage.removeItem(key);
    }
  }
}

export default SessionStorage;
