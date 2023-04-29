import { useEffect, useState } from "react";
import logo_editor from "./assets/logo_editor.png";
import "./App.css";
import "./styles/FileComponentStyles.css";
import { FileItem } from "./components/File";
import { useActions, useSignal } from "@dilane3/gx";
import { useRef } from "react";
import { annotateCsv } from "./api";
import { instance } from "./api";
import { downloadBaseUrl } from "./utils";

function App() {
  const files = useSignal("files");
  const { loading, finished, link } = useSignal("loading");
  const { addFiles } = useActions("files");
  const { start, stop, setLink } = useActions("loading");
  const [zip, setZip] = useState(null);
  const [counter, setCounter] = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    let timer;

    if (loading) {
      timer = setInterval(() => {
        setCounter((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [loading]);
  const handleOpenFolder = () => {
    if (!loading && inputRef.current) inputRef.current.click();
  };

  const handleFileSelected = (event) => {
    addFiles(event.target.files);
  };
  const handleSubmit = async () => {
    if (files.length === 0) return;
    start();
    setCounter(0);

    const { data } = await annotateCsv(files);

    console.log(data);

    if (data) {
      setLink(data.link);
    }
    stop();
  };
  const handleDownload = async (link) => {
    if (!finished) return;
    const { data } = await instance.get(`/static/${link}`, {
      responseType: "blob",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    const urlToDownload = window.URL.createObjectURL(new Blob([data]));

    const filename = link.split("/").pop();

    console.log({ urlToDownload });
    setZip({
      url: urlToDownload,
      name: filename,
    });
  };

  return (
    <main className="App">
      <header className="headerContainer">
        <div className="headerContainer">
          <div className="headerTextContainer">
            <div>
              <h1 className="headerTitle">SEMANTIC WEB</h1>
            </div>
            <div>
              <h1 className="headerTitle headerTitle1">File Annotation...</h1>
            </div>
          </div>
          <div className="headerLogoContainer">
            <img src={logo_editor} alt="editor_file_logo" width={70} />
          </div>
        </div>
      </header>

      <section className="main">
        <div className="main__title">
          <h1>
            <strong className="defaulTextColor">how does it work?</strong>
          </h1>

          <p style={{ textAlign: "center" }}>
            <strong className="OrangeColor">First (1)</strong> you click on the
            Add File button <strong className="OrangeColor">Then (2)</strong>{" "}
            select your files and click OK.
            <br />
            <strong className="OrangeColor">Finally (3)</strong> you click on
            Generate and download the result.
            <br />
            For a better experience we recommend you to choose{" "}
            <strong className="OrangeColor">a maximum of 5</strong> files at a
            time.
          </p>
        </div>

        <section className="fileMain">
          {files.map((file, index) => (
            <FileItem key={index} file={file} />
          ))}
        </section>
        <div className="main__upload">
          <div className="main__uploader">
            <input
              ref={inputRef}
              type="file"
              onChange={handleFileSelected}
              multiple
              hidden
              accept="text/csv"
            />

            <button className="addButton" onClick={handleOpenFolder}>
              <span>
                Add Files <i className="plusBtn">+</i>
              </span>
            </button>

            {finished && link !== null ? (
              <a
                href={`${downloadBaseUrl}/${link}`}
                download={link.split("/").pop()}
                target="_blanc"
              >
                <button className="main__results">
                  <span>Download</span>
                </button>
              </a>
            ) : (
              <span className="tipiis">
                {/* Use Ctrl or Shift to select many files */}
              </span>
            )}

            <button
              className={`uploadBtn ${files.length > 0 ? "activee" : ""}`}
              onClick={handleSubmit}
            >
              <span>Generate</span>

              {loading ? " ..." : ""}
            </button>
          </div>
        </div>
      </section>

      <footer className="footer"></footer>
    </main>
  );
}

export default App;
