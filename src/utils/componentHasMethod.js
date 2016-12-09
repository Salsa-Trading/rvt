export function componentHasMethod(element, methodName) {
  if (!element || !element.type) {
    return false;
  }
  const t = element.type;
  if (t instanceof Function && t.prototype && t.prototype[methodName]) {
    return true;
  }
  return false;
}
