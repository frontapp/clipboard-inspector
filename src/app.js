import ReactDOM from "react-dom";
import React from "react";

function file_info(file) {
  return file
    ? {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }
    : null;
}

class ClipboardInspector extends React.Component {
  render_file(file) {
    return file ? (
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
    ) : (
      <em>N/A</em>
    );
  }

  render() {
    let { dataTransfer } = this.props;

    var render_data = null;

    if (dataTransfer) {
      render_data = {
        data_by_type: Array.from(dataTransfer.types).map(type => {
          let data = dataTransfer.getData(type);
          return {
            type: type,
            data: data
          };
        }),
        items: dataTransfer.items
          ? Array.from(dataTransfer.items).map(item => {
              return {
                kind: item.kind,
                type: item.type,
                as_file: file_info(item.getAsFile())
              };
            })
          : null,
        files: dataTransfer.files
          ? Array.from(dataTransfer.files).map(file => {
              return file_info(file);
            })
          : null
      };
    }

    return render_data ? (
      <div className="clipboard-summary">
        <div className="intro-msg">
          Great! Now download and email to Front for troubleshooting:
          <br/>
          <button type="button" onClick={() => this.downloadData(render_data)}>Download</button>
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
              {render_data.data_by_type.length} type(s) available
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
              {render_data.data_by_type.map((obj, idx) => (
                <tr key={idx}>
                  <td>
                    <code>{obj.type}</code>
                  </td>
                  <td>
                    <code>{obj.data ? <pre>{obj.data}</pre> : <em>Empty string</em>}</code>
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
              {render_data.items ? (
                `${render_data.items.length} item(s) available`
              ) : (
                <em>Undefined</em>
              )}
            </span>
          </h2>

          {render_data.items ? (
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
                {render_data.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <code>{item.kind}</code>
                    </td>
                    <td>
                      <code>{item.type}</code>
                    </td>
                    <td>{this.render_file(item.as_file)}</td>
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
              {render_data.files
                ? `${render_data.files.length} file(s) available`
                : "<em>Undefined</em>"}
            </span>
          </h2>
          {render_data.files ? (
            render_data.files.map((file, idx) => (
              <div key={idx}>{this.render_file(file)}</div>
            ))
          ) : (
            <span>N/A</span>
          )}
        </div>
      </div>
    ) : (
      <div className="intro-msg">Paste something by pressing ⌘V or Ctrl+V</div>
    );
  }

  downloadData(data) {
    const augmentedData = Object.assign({
      userAgent: navigator.userAgent
    }, data);
    const stringifiedData = JSON.stringify(augmentedData);

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringifiedData));
    element.setAttribute('download', `clipboard-${Date.now()}.json`);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}

var app_el = document.getElementById("app");

function render(e) {
  ReactDOM.render(<ClipboardInspector dataTransfer={e ? e.dataTransfer || e.clipboardData : undefined} />, app_el);
}

render();

document.addEventListener("paste", e => {
  render(e);
});

document.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

document.addEventListener('drop', e => {
  e.preventDefault();
  render(e);
});
