import * as React from 'react';

export default function safeMouseDown<T>(mouseDown: React.MouseEventHandler<T>) {
  const onMouseDown = (e: React.MouseEvent<T>) => {
    mouseDown(e);
  };

  document.addEventListener('mousedown', onMouseDown as any);
  return () => {
    document.removeEventListener('mousedown', onMouseDown as any);
  };
}
