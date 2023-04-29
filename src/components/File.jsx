import styles from "./styles/fileItem.module.css";
import "../styles/FileComponentStyles.css";
import { useAction, useSignal } from "@dilane3/gx";
import { formatSize } from "../utils";
import logo from "../assets/csv_annotation.png";
import deleteBtn from "../assets/delete.png";

export const FileItem = ({ file }) => {
  // Global action
  const removeFile = useAction("files", "removeFile");

  // Global state
  const { loading } = useSignal("loading");

  // Some logic
  const handleDelete = () => {
    if (!loading) {
      removeFile(file.name);
    }
  };

  return (
    <div className="fileItem">
      <div className={styles.file__info}>
        <img src={logo} width={125} />
      </div>

      <div>
        <span className="fileSize">{formatSize(file.size)}</span>
      </div>
      <div>
        <span className="fileName">{file.name}</span>
      </div>
      <div onClick={handleDelete}>
        <img className="delete_icon" src={deleteBtn} />
      </div>
    </div>
  );
};
