import * as React from 'react';

export default function safeMouseMove<T>(
  e: React.MouseEvent<T>,
  onMove: React.MouseEventHandler<T>,
  onUp?: React.MouseEventHandler<T>) {
  const onMouseMove = (moveEvent: React.MouseEvent<T>) => {
    onMove(moveEvent);
    moveEvent.preventDefault();
  };

  const onMouseUp = (upEvent: React.MouseEvent<T>) => {
    try {
      if(onUp) {
        onUp(upEvent);
      }
    }
    catch(err) {}
    document.removeEventListener('mousemove', onMouseMove as any);
    document.removeEventListener('mouseup', onMouseUp as any);
    upEvent.preventDefault();
  };

  document.addEventListener('mousemove', onMouseMove as any);
  document.addEventListener('mouseup', onMouseUp as any);
  e.preventDefault();
}

