import React, { FC, MouseEventHandler } from 'react';
import { ClipboardFileInfo, ClipboardSample } from '../clipboardSample';

export interface ClipboardInspectorProps {
  clipboard: ClipboardSample;
  onDownloadClick: MouseEventHandler;
}

export const ClipboardInspector: FC<ClipboardInspectorProps> = ({
  clipboard,
  onDownloadClick,
}) => (
  <div className="clipboard-summary">
    <div className="intro-msg">
      Great! Now download and email to Front for troubleshooting:
      <br />
      <button type="button" onClick={onDownloadClick}>
        Download
      </button>
    </div>

    <h1>
      <a
        className="mdn"
        href="https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData"
      >
        dataTransfer
      </a>
    </h1>

    <div className="clipboard-section">
      <h2>
        <a
          className="mdn"
          href="https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types"
        >
          types
        </a>
        <span className="anno">
          {clipboard.data_by_type.length} type(s) available
        </span>
      </h2>
      <table>
        <thead>
          <tr>
            <th>type</th>
            <th>
              <a
                className="mdn"
                href="https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/getData"
              >
                getData(type)
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {clipboard.data_by_type.map((obj, idx) => (
            <tr key={idx}>
              <td>
                <code>{obj.type}</code>
              </td>
              <td>
                <code>
                  {obj.data ? <pre>{obj.data}</pre> : <em>Empty string</em>}
                </code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="clipboard-section">
      <h2>
        <a
          className="mdn"
          href="https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/items"
        >
          items
        </a>
        <span className="anno">
          {clipboard.items ? (
            `${clipboard.items.length} item(s) available`
          ) : (
            <em>Undefined</em>
          )}
        </span>
      </h2>

      {clipboard.items ? (
        <table>
          <thead>
            <tr>
              <th>kind</th>
              <th>type</th>
              <th>
                <a
                  className="mdn"
                  href="https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFile"
                >
                  getAsFile()
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {clipboard.items.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <code>{item.kind}</code>
                </td>
                <td>
                  <code>{item.type}</code>
                </td>
                <td>{renderFileInfo(item.as_file)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>

    <div className="clipboard-section">
      <h2>
        <a
          className="mdn"
          href="https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/files"
        >
          files
        </a>
        <span className="anno">
          {clipboard.files
            ? `${clipboard.files.length} file(s) available`
            : '<em>Undefined</em>'}
        </span>
      </h2>
      {clipboard.files ? (
        clipboard.files.map((file, idx) => (
          <div key={idx}>{renderFileInfo(file)}</div>
        ))
      ) : (
        <span>N/A</span>
      )}
    </div>
  </div>
);

function renderFileInfo(file: ClipboardFileInfo | null) {
  if (!file) return <em>N/A</em>;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th>Type</th>
          <th>
            <a
              className="mdn"
              href="https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL"
            >
              URL.createObjectURL(file)
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>{file.name}</code>
          </td>
          <td>
            <code>{file.size}</code>
          </td>
          <td>
            <code>{file.type}</code>
          </td>
          <td>
            <code>
              <a href={file.url}>
                <img src={file.url} />
              </a>
            </code>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
