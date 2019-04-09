import ReactDOM from 'react-dom';
import React, { FC, useEffect, useState } from 'react';
import {
  ClipboardSample,
  buildClipboardSample,
  downloadClipboardSample,
} from './clipboardSample';
import { ClipboardInspector } from './components/ClipboardInspector';
import { Intro } from './components/intro';

const rootElement = document.getElementById('app');

const App: FC = () => {
  const [clipboard, setClipboard] = useState<ClipboardSample>();

  useEffect(() => {
    function onDragOver(event: DragEvent) {
      if (!event.dataTransfer) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }

    function onPasteOrDrop(event: ClipboardEvent | DragEvent) {
      event.preventDefault();

      const dataTransfer = isClipboardEvent(event)
        ? event.clipboardData
        : event.dataTransfer;
      setClipboard(
        dataTransfer ? buildClipboardSample(dataTransfer) : undefined,
      );
    }

    function onCopy(event: ClipboardEvent) {}

    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onPasteOrDrop);
    document.addEventListener('paste', onPasteOrDrop);
    document.addEventListener('copy', onCopy);

    return () => {
      document.addEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onPasteOrDrop);
      document.removeEventListener('paste', onPasteOrDrop);
      document.removeEventListener('copy', onCopy);
    };
  }, []);

  function onDownloadClick() {
    if (!clipboard) {
      return;
    }

    downloadClipboardSample(clipboard);
  }

  return clipboard ? (
    <ClipboardInspector
      clipboard={clipboard}
      onDownloadClick={onDownloadClick}
    />
  ) : (
    <Intro />
  );
};

ReactDOM.render(<App />, rootElement);

function isClipboardEvent(
  event: ClipboardEvent | DragEvent,
): event is ClipboardEvent {
  return 'clipboardData' in event;
}
