export interface ClipboardSample {
  data_by_type: {
    type: string;
    data: string;
  }[];
  items:
    | {
        kind: string;
        type: string;
        as_file: ClipboardFileInfo | null;
      }[]
    | null;
  files: (ClipboardFileInfo | null)[] | null;
}

export interface ClipboardFileInfo {
  name: string;
  size: number;
  type: string;
  url: string;
}

export function buildClipboardSample(
  dataTransfer: DataTransfer,
): ClipboardSample {
  return {
    data_by_type: Array.from(dataTransfer.types).map(type => ({
      type,
      data: dataTransfer.getData(type),
    })),
    items: dataTransfer.items
      ? Array.from(dataTransfer.items).map(item => ({
          kind: item.kind,
          type: item.type,
          as_file: buildFileInfo(item.getAsFile()),
        }))
      : null,
    files: dataTransfer.files
      ? Array.from(dataTransfer.files).map(buildFileInfo)
      : null,
  };
}

function buildFileInfo(file: File | null): ClipboardFileInfo | null {
  return file
    ? {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }
    : null;
}

export function downloadClipboardSample(data: ClipboardSample) {
  const augmentedData = Object.assign(
    {
      userAgent: navigator.userAgent,
    },
    data,
  );
  const stringifiedData = JSON.stringify(augmentedData);

  var element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(stringifiedData),
  );
  element.setAttribute('download', `clipboard-${Date.now()}.json`);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
