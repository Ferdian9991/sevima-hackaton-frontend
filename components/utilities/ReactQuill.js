import React from "react";
import ReactQuill, { Quill } from "react-quill";
import MarkdownShortcuts from "quill-markdown-shortcuts";

Quill.register("modules/markdownShortcuts", MarkdownShortcuts);

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "color", "strike"],
      ["link", "image", "video"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["clean"],
    ],
  },
  markdownShortcuts: {},
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

const ReactQuillEditor = ({ onChange, value }) => {
  return (
    <ReactQuill
      style={{ width: "75%" }}
      theme="snow"
      value={value}
      formats={formats}
      modules={modules}
      onChange={onChange}
    />
  );
};

export default ReactQuillEditor;
