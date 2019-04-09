import ReactDOM from 'react-dom';
import React, { FC, useEffect, useState } from 'react';
import {
  ClipboardSample,
  buildClipboardSample,
  downloadClipboardSample,
  importClipboardSample,
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

    async function onPasteOrDrop(event: ClipboardEvent | DragEvent) {
      event.preventDefault();

      const dataTransfer = isClipboardEvent(event)
        ? event.clipboardData
        : event.dataTransfer;
      if (!dataTransfer) {
        setClipboard(undefined);
        return;
      }

      if (
        dataTransfer.files.length > 0 &&
        dataTransfer.files[0].name.match(/^clipboard-\d+.json$/)
      ) {
        setClipboard(await importClipboardSample(dataTransfer.files[0]));
        return;
      }

      setClipboard(buildClipboardSample(dataTransfer));
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
