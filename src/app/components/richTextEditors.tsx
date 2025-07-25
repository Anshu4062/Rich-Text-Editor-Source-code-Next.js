/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Eye,
  Code,
  Quote,
  Minus,
  Undo,
  Redo,
  Search,
  Download,
  Strikethrough,
  Subscript,
  Superscript,
  Indent,
  Outdent,
  Table,
  Video,
  Hash,
  Calendar,
  AtSign,
  Smile,
  Paperclip,
  Maximize,
  Minimize,
  Settings,
  Copy,
  Scissors,
  ClipboardPaste,
} from "lucide-react";

const EditorjsTextEditor = () => {
  const [content, setContent] = useState("");
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [fontSize, setFontSize] = useState("14");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [history, setHistory] = useState([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  const initialContent = `<p>Welcome to Editor.js Pro! This is a comprehensive rich text editor with advanced features including:</p><ul><li>Complete text formatting options</li><li>Table insertion and editing</li><li>Image and link insertion</li><li>Undo/Redo functionality</li><li>Export capabilities</li><li>Full customization settings</li></ul>`;

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      setContent(htmlContent);
      const textContent = editorRef.current.innerText || "";
      const words = textContent
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(words.length || 0);
      setCharCount(textContent.length);
    }
  }, []);

  const saveToHistory = useCallback(() => {
    if (editorRef.current) {
      const newHistory = history.slice(0, historyIndex + 1);
      if (newHistory[newHistory.length - 1] !== editorRef.current.innerHTML) {
        newHistory.push(editorRef.current.innerHTML);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }
  }, [history, historyIndex]);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set();
    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
      if (document.queryCommandState("strikeThrough"))
        formats.add("strikethrough");
      if (document.queryCommandState("subscript")) formats.add("subscript");
      if (document.queryCommandState("superscript")) formats.add("superscript");
    } catch (e) {}
    setActiveFormats(formats);
  }, []);

  const executeCommand = useCallback(
    (command: string, value: string | null = null) => {
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand(command, false, value as never);
        updateActiveFormats();
        saveToHistory();
      }
    },
    [saveToHistory, updateActiveFormats]
  );

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
      handleInput();
      setHistory([initialContent]);
      setHistoryIndex(0);
    }
  }, [initialContent, handleInput]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
        handleInput();
      }
    }
  }, [historyIndex, history, handleInput]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
        handleInput();
      }
    }
  }, [historyIndex, history, handleInput]);

  const insertTable = useCallback(() => {
    const rows = parseInt(prompt("Number of rows:", "3") || "3");
    const cols = parseInt(prompt("Number of columns:", "3") || "3");
    if (rows && cols && rows > 0 && cols > 0) {
      let tableHTML =
        '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
      for (let i = 0; i < rows; i++) {
        tableHTML += "<tr>";
        for (let j = 0; j < cols; j++) {
          tableHTML +=
            '<td style="padding: 8px; border: 1px solid #ddd;">Cell</td>';
        }
        tableHTML += "</tr>";
      }
      tableHTML += "</table>";
      executeCommand("insertHTML", tableHTML);
    }
  }, [executeCommand]);

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      executeCommand("insertImage", url);
    }
  }, [executeCommand]);

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  }, [executeCommand]);

  const changeFontSize = useCallback((size: string) => {
    setFontSize(size);
    if (editorRef.current) {
      editorRef.current.style.fontSize = size + "px";
    }
  }, []);

  const exportContent = useCallback(() => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "editor-content.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content]);

  const pasteText = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      executeCommand("insertText", text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  }, [executeCommand]);

  return (
    <div
      className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Editor.js Pro</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              type="button"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              type="button"
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>
        {showSettings && (
          <div className="mb-4 p-3 bg-white rounded border border-gray-300">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font Size
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => changeFontSize(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="10">10px</option>
                  <option value="12">12px</option>
                  <option value="14">14px</option>
                  <option value="16">16px</option>
                  <option value="18">18px</option>
                  <option value="20">20px</option>
                  <option value="24">24px</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    if (editorRef.current) {
                      editorRef.current.style.fontFamily = e.target.value;
                    }
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    executeCommand("foreColor", e.target.value);
                  }}
                  className="w-full h-8 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Background
                </label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => {
                    setBackgroundColor(e.target.value);
                    executeCommand("backColor", e.target.value);
                  }}
                  className="w-full h-8 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          <div className="flex gap-1 mr-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50"
              type="button"
            >
              <Undo size={16} />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50"
              type="button"
            >
              <Redo size={16} />
            </button>
            <button
              onClick={exportContent}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              type="button"
              title="Export as HTML"
            >
              <Download size={16} />
            </button>
          </div>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <div className="flex gap-1 mr-2">
            <button
              onClick={() => executeCommand("copy")}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              type="button"
              title="Copy"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={() => executeCommand("cut")}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              type="button"
              title="Cut"
            >
              <Scissors size={16} />
            </button>
            <button
              onClick={pasteText}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              type="button"
              title="Paste"
            >
              <ClipboardPaste size={16} />
            </button>
          </div>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button
            onClick={() => executeCommand("bold")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has("bold")
                ? "bg-blue-200 text-blue-800"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => executeCommand("italic")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has("italic")
                ? "bg-blue-200 text-blue-800"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => executeCommand("underline")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has("underline")
                ? "bg-blue-200 text-blue-800"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Underline size={16} />
          </button>
          <button
            onClick={() => executeCommand("strikeThrough")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has("strikethrough")
                ? "bg-blue-200 text-blue-800"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Strikethrough size={16} />
          </button>
          <button
            onClick={() => executeCommand("subscript")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has("subscript")
                ? "bg-blue-200 text-blue-800"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Subscript size={16} />
          </button>
          <button
            onClick={() => executeCommand("superscript")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has("superscript")
                ? "bg-blue-200 text-blue-800"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Superscript size={16} />
          </button>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button
            onClick={() => executeCommand("justifyLeft")}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => executeCommand("justifyCenter")}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <AlignCenter size={16} />
          </button>
          <button
            onClick={() => executeCommand("justifyRight")}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <AlignRight size={16} />
          </button>
          <button
            onClick={() => executeCommand("justifyFull")}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <AlignJustify size={16} />
          </button>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => executeCommand("insertOrderedList")}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <ListOrdered size={16} />
          </button>
          <button
            onClick={() => executeCommand("indent")}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <Indent size={16} />
          </button>
          <button
            onClick={() => executeCommand("outdent")}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <Outdent size={16} />
          </button>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button
            onClick={insertLink}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <Link size={16} />
          </button>
          <button
            onClick={insertImage}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <Image size={16} />
          </button>
          <button
            onClick={insertTable}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <Table size={16} />
          </button>
          <button
            onClick={() => executeCommand("formatBlock", "<blockquote>")}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <Quote size={16} />
          </button>
          <button
            onClick={() => executeCommand("formatBlock", "<pre>")}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <Code size={16} />
          </button>
          <button
            onClick={() => executeCommand("insertHorizontalRule")}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            type="button"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={(e) => {
          updateActiveFormats();
          if (e.key === " " || e.key === "Enter" || e.key === "Backspace") {
            saveToHistory();
          }
        }}
        onMouseUp={updateActiveFormats}
        onBlur={saveToHistory}
        className={`p-4 focus:outline-none ${
          isFullscreen ? "h-full overflow-auto" : "min-h-[300px]"
        }`}
        style={{
          fontSize: fontSize + "px",
          fontFamily: fontFamily,
          lineHeight: "1.6",
        }}
        suppressContentEditableWarning={true}
      />
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex justify-between text-xs text-gray-500">
        <span>
          Words: {wordCount} | Characters: {charCount}
        </span>
        <span>Editor.js Pro - All features enabled</span>
      </div>
    </div>
  );
};

const QuillEditor = () => {
  const [content, setContent] = useState("");
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const initialContent = `<p>Welcome to <strong>Quill Pro Editor</strong>! This advanced editor includes:</p><ul><li>🎨 <em>Complete formatting options</em> with colors and fonts</li><li>🔍 <u>Search and replace functionality</u></li><li>😀 Emoji insertion and special characters</li><li>📅 Date insertion and math expressions</li><li>👁️ Live preview mode</li></ul><blockquote style="border-left: 4px solid #3b82f6; padding-left: 1rem; margin: 1rem 0; color: #4b5563;">Try out the new features like video and file embedding!</blockquote>`;

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }, []);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set();
    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
      if (document.queryCommandState("subscript")) formats.add("subscript");
      if (document.queryCommandState("superscript")) formats.add("superscript");
    } catch (e) {}
    setActiveFormats(formats);
  }, []);

  const executeCommand = useCallback(
    (command: string, value: string | null = null) => {
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand(command, false, value as never);
        updateActiveFormats();
      }
    },
    [updateActiveFormats]
  );

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
      handleInput();
    }
  }, [initialContent, handleInput]);

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  }, [executeCommand]);

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      executeCommand("insertImage", url);
    }
  }, [executeCommand]);

  const insertVideo = useCallback(() => {
    const url = prompt("Enter video URL (e.g., YouTube embed link):");
    if (url) {
      const videoHtml = `<iframe src="${url}" width="560" height="315" frameborder="0" allowfullscreen style="margin: 10px 0;"></iframe>`;
      executeCommand("insertHTML", videoHtml);
    }
  }, [executeCommand]);

  const insertFile = useCallback(() => {
    const url = prompt("Enter file URL:");
    const name = prompt("Enter file name:", "document.pdf");
    if (url && name) {
      const fileHtml = `<a href="${url}" download="${name}" style="display: inline-flex; align-items: center; background-color: #eef2ff; border: 1px solid #c7d2fe; padding: 4px 8px; border-radius: 4px; text-decoration: none; color: #4338ca; margin: 5px 0;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        ${name}
      </a>`;
      executeCommand("insertHTML", fileHtml);
    }
  }, [executeCommand]);

  const insertEmoji = useCallback(() => {
    const emojis = ["😀", "😊", "😍", "🤔", "👍", "❤️", "🎉", "🚀", "💡", "⭐"];
    const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    executeCommand("insertText", selectedEmoji);
  }, [executeCommand]);

  const searchAndReplace = useCallback(() => {
    if (searchTerm && replaceTerm && editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      const newContent = currentContent.replace(
        new RegExp(searchTerm, "gi"),
        replaceTerm
      );
      editorRef.current.innerHTML = newContent;
      setContent(newContent);
    }
  }, [searchTerm, replaceTerm]);

  const insertDate = useCallback(() => {
    const today = new Date().toLocaleDateString();
    executeCommand("insertText", today);
  }, [executeCommand]);

  const insertMathExpression = useCallback(() => {
    const expression = prompt("Enter math expression (e.g., x² + y² = z²):");
    if (expression) {
      executeCommand(
        "insertHTML",
        `<span style="font-style: italic; color: #0066cc;">${expression}</span>`
      );
    }
  }, [executeCommand]);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-blue-50 border-b border-gray-200 p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Quill Pro Editor
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsCollaborating(!isCollaborating)}
              className={`px-3 py-1 rounded text-sm ${
                isCollaborating
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-600"
              }`}
              type="button"
            >
              {isCollaborating ? "Collaborating" : "Solo"}
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
              type="button"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
        {showSearch && (
          <div className="mb-4 p-3 bg-white rounded border border-gray-300">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Replace with..."
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={searchAndReplace}
                className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                type="button"
              >
                Replace All
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 items-center">
          <select
            onChange={(e) => executeCommand("formatBlock", e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="div">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="p">Paragraph</option>
            <option value="blockquote">Quote</option>
            <option value="pre">Code Block</option>
          </select>
          <select
            onChange={(e) => executeCommand("fontName", e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times</option>
            <option value="Courier New">Courier</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
          <select
            onChange={(e) => executeCommand("fontSize", e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button
            onClick={() => executeCommand("bold")}
            className={`p-2 rounded hover:bg-blue-200 transition-colors ${
              activeFormats.has("bold")
                ? "bg-blue-200 text-blue-800"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => executeCommand("italic")}
            className={`p-2 rounded hover:bg-blue-200 transition-colors ${
              activeFormats.has("italic")
                ? "bg-blue-200 text-blue-800"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => executeCommand("underline")}
            className={`p-2 rounded hover:bg-blue-200 transition-colors ${
              activeFormats.has("underline")
                ? "bg-blue-200 text-blue-800"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Underline size={16} />
          </button>
          <button
            onClick={() => executeCommand("strikeThrough")}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            type="button"
          >
            <Strikethrough size={16} />
          </button>
          <button
            onClick={() => executeCommand("subscript")}
            className={`p-2 rounded hover:bg-blue-200 transition-colors ${
              activeFormats.has("subscript")
                ? "bg-blue-200 text-blue-800"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Subscript size={16} />
          </button>
          <button
            onClick={() => executeCommand("superscript")}
            className={`p-2 rounded hover:bg-blue-200 transition-colors ${
              activeFormats.has("superscript")
                ? "bg-blue-200 text-blue-800"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Superscript size={16} />
          </button>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <input
            type="color"
            onChange={(e) => executeCommand("foreColor", e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            title="Text Color"
          />
          <input
            type="color"
            onChange={(e) => executeCommand("backColor", e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            title="Background Color"
          />
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button
            onClick={insertLink}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            type="button"
          >
            <Link size={16} />
          </button>
          <button
            onClick={insertImage}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            type="button"
          >
            <Image size={16} />
          </button>
          <button
            onClick={insertVideo}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            type="button"
          >
            <Video size={16} />
          </button>
          <button
            onClick={insertFile}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            type="button"
          >
            <Paperclip size={16} />
          </button>
          <button
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            type="button"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => executeCommand("insertOrderedList")}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            type="button"
          >
            <ListOrdered size={16} />
          </button>
          <button
            onClick={() => executeCommand("indent")}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            type="button"
          >
            <Indent size={16} />
          </button>
          <button
            onClick={() => executeCommand("outdent")}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            type="button"
          >
            <Outdent size={16} />
          </button>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button
            onClick={insertEmoji}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            title="Insert Random Emoji"
            type="button"
          >
            <Smile size={16} />
          </button>
          <button
            onClick={insertDate}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            title="Insert Current Date"
            type="button"
          >
            <Calendar size={16} />
          </button>
          <button
            onClick={insertMathExpression}
            className="p-2 rounded hover:bg-blue-200 transition-colors text-gray-600"
            title="Insert Math Expression"
            type="button"
          >
            <Hash size={16} />
          </button>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded hover:bg-blue-200 transition-colors ${
              showPreview ? "bg-blue-200 text-blue-800" : "text-gray-600"
            }`}
            type="button"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
      {showPreview ? (
        <div className="p-4 min-h-[300px] bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Preview Mode:
          </h4>
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="prose max-w-none"
          />
        </div>
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          className="p-4 min-h-[300px] focus:outline-none"
          style={{ fontSize: "14px", lineHeight: "1.6" }}
          suppressContentEditableWarning={true}
        />
      )}
      <div className="bg-blue-50 border-t border-blue-200 px-4 py-2 flex justify-between text-xs text-blue-600">
        <span>Quill Pro - Professional rich text editing</span>
        <span>
          {isCollaborating ? "👥 Collaborative Mode" : "👤 Solo Mode"}
        </span>
      </div>
    </div>
  );
};

const TiptapEditor = () => {
  const [content, setContent] = useState("");
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [showWordCountDetails, setShowWordCountDetails] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [autoSave, setAutoSave] = useState(true);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [plugins, setPlugins] = useState({
    spellCheck: true,
    autoCorrect: true,
    mentions: true,
    hashtags: true,
  });
  const [history, setHistory] = useState([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  const initialContent = `<h1>Welcome to TipTap Ultimate! 🚀</h1><p>This is the most <strong>advanced editor</strong> with features like:</p><div style="background: #e0f2fe; border-left: 4px solid #0288d1; color: #01579b; padding: 12px; margin: 10px 0; border-radius: 4px;"><strong>ℹ️ Info</strong><br>Try out all the amazing features available in this editor!</div><ul><li>🎨 Multiple themes and customization</li><li>📊 Advanced analytics and word counting</li><li>📝 Markdown export functionality</li><li>🔧 Plugin system with toggleable features</li><li>💬 Social features like mentions and hashtags</li><li>📋 Task lists and callout boxes</li></ul><ul style="list-style: none; padding-left: 0;"><li style="margin: 8px 0;"><label style="display: flex; align-items: center;"><input type="checkbox" style="margin-right: 8px;"><span>Try this interactive task list</span></label></li><li style="margin: 8px 0;"><label style="display: flex; align-items: center;"><input type="checkbox" style="margin-right: 8px;"><span>Check off completed items</span></label></li></ul><pre style="background-color: #f8f9fa; padding: 12px; border-radius: 4px; font-family: 'Courier New', monospace; border-left: 4px solid #6366f1; margin: 10px 0;"><code data-language="javascript">// JavaScript Example
console.log('Hello from TipTap Ultimate!');</code></pre><p>Try mentioning someone with <span style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 12px; font-size: 12px;">@username</span> or add hashtags like <span style="color: #3b82f6; font-weight: 500;">#awesome</span>!</p>`;

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      setContent(htmlContent);

      const textContent = editorRef.current.innerText || "";
      const words = textContent
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(words.length || 0);
      setCharCount(textContent.length);
      setReadingTime(Math.ceil(words.length / 200) || 0);

      const basicMarkdown = htmlContent
        .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
        .replace(/<em>(.*?)<\/em>/gi, "*$1*")
        .replace(/<u>(.*?)<\/u>/gi, "_$1_")
        .replace(/<h1>(.*?)<\/h1>/gi, "# $1")
        .replace(/<h2>(.*?)<\/h2>/gi, "## $1")
        .replace(/<h3>(.*?)<\/h3>/gi, "### $1")
        .replace(/<li>(.*?)<\/li>/gi, "- $1")
        .replace(/<[^>]*>/g, "");
      setMarkdown(basicMarkdown);
    }
  }, []);

  const saveToHistory = useCallback(() => {
    if (editorRef.current) {
      const newHistory = history.slice(0, historyIndex + 1);
      if (newHistory[newHistory.length - 1] !== editorRef.current.innerHTML) {
        newHistory.push(editorRef.current.innerHTML);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }
  }, [history, historyIndex]);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set();
    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
    } catch (e) {}
    setActiveFormats(formats);
  }, []);

  const executeCommand = useCallback(
    (command: string, value: string | null = null) => {
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand(command, false, value as never);
        updateActiveFormats();
        saveToHistory();
      }
    },
    [saveToHistory, updateActiveFormats]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
        handleInput();
      }
    }
  }, [historyIndex, history, handleInput]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
        handleInput();
      }
    }
  }, [historyIndex, history, handleInput]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
      handleInput();
      setHistory([initialContent]);
      setHistoryIndex(0);
    }
  }, [initialContent, handleInput]);

  const insertCodeBlock = useCallback(() => {
    const language = prompt("Enter programming language (optional):");
    const codeBlockHtml = `<pre style="background-color: #f8f9fa; padding: 12px; border-radius: 4px; font-family: 'Courier New', monospace; border-left: 4px solid #6366f1; margin: 10px 0;"><code${
      language ? ` data-language="${language}"` : ""
    }>${
      language ? `// ${language.toUpperCase()} Code\n` : ""
    }// Your code here...</code></pre>`;
    executeCommand("insertHTML", codeBlockHtml);
  }, [executeCommand]);

  const insertCallout = useCallback(
    (type: string) => {
      const calloutStyles: { [key: string]: string } = {
        info: "background: #e0f2fe; border-left: 4px solid #0288d1; color: #01579b;",
        warning:
          "background: #fff3e0; border-left: 4px solid #f57c00; color: #e65100;",
        success:
          "background: #e8f5e8; border-left: 4px solid #4caf50; color: #2e7d32;",
        error:
          "background: #ffebee; border-left: 4px solid #f44336; color: #c62828;",
      };
      const icons: { [key: string]: string } = {
        info: "ℹ️",
        warning: "⚠️",
        success: "✅",
        error: "❌",
      };
      const calloutHtml = `<div style="padding: 12px; margin: 10px 0; border-radius: 4px; ${
        calloutStyles[type]
      }"><strong>${icons[type]} ${
        type.charAt(0).toUpperCase() + type.slice(1)
      }</strong><br>Your message here...</div>`;
      executeCommand("insertHTML", calloutHtml);
    },
    [executeCommand]
  );

  const insertTaskList = useCallback(() => {
    const taskListHtml = `<ul style="list-style: none; padding-left: 0;"><li style="margin: 8px 0;"><label style="display: flex; align-items: center;"><input type="checkbox" style="margin-right: 8px;"><span>Task 1</span></label></li><li style="margin: 8px 0;"><label style="display: flex; align-items: center;"><input type="checkbox" style="margin-right: 8px;"><span>Task 2</span></label></li></ul>`;
    executeCommand("insertHTML", taskListHtml);
  }, [executeCommand]);

  const insertMention = useCallback(() => {
    const mention = prompt("Enter username to mention:");
    if (mention) {
      const mentionHtml = `<span style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 12px; font-size: 12px;">@${mention}</span>&nbsp;`;
      executeCommand("insertHTML", mentionHtml);
    }
  }, [executeCommand]);

  const insertHashtag = useCallback(() => {
    const hashtag = prompt("Enter hashtag:");
    if (hashtag) {
      const hashtagHtml = `<span style="color: #3b82f6; font-weight: 500;">#${hashtag}</span>&nbsp;`;
      executeCommand("insertHTML", hashtagHtml);
    }
  }, [executeCommand]);

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  }, [executeCommand]);

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      executeCommand("insertImage", url);
    }
  }, [executeCommand]);

  const exportAsMarkdown = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [markdown]);

  const applyTheme = useCallback((theme: string) => {
    setSelectedTheme(theme);
    if (editorRef.current) {
      const themes: { [key: string]: { bg: string; color: string } } = {
        default: { bg: "#ffffff", color: "#374151" },
        dark: { bg: "#1f2937", color: "#f9fafb" },
        sepia: { bg: "#fef7ed", color: "#92400e" },
        focus: { bg: "#f8fafc", color: "#1e293b" },
      };
      const selectedThemeStyle = themes[theme];
      editorRef.current.style.backgroundColor = selectedThemeStyle.bg;
      editorRef.current.style.color = selectedThemeStyle.color;
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-purple-50 border-b border-gray-200 p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            TipTap Ultimate Editor
          </h3>
          <div className="flex gap-2 items-center">
            <select
              value={selectedTheme}
              onChange={(e) => applyTheme(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="sepia">Sepia</option>
              <option value="focus">Focus</option>
            </select>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="mr-1"
              />
              Auto-save
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 rounded hover:bg-purple-200 transition-colors text-gray-600 bg-white border border-gray-300 disabled:opacity-50"
              type="button"
            >
              <Undo size={16} />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded hover:bg-purple-200 transition-colors text-gray-600 bg-white border border-gray-300 disabled:opacity-50"
              type="button"
            >
              <Redo size={16} />
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={() => executeCommand("bold")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeFormats.has("bold")
                  ? "bg-purple-200 text-purple-800"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-purple-100"
              }`}
              type="button"
            >
              Bold
            </button>
            <button
              onClick={() => executeCommand("italic")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeFormats.has("italic")
                  ? "bg-purple-200 text-purple-800"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-purple-100"
              }`}
              type="button"
            >
              Italic
            </button>
            <button
              onClick={() => executeCommand("underline")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeFormats.has("underline")
                  ? "bg-purple-200 text-purple-800"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-purple-100"
              }`}
              type="button"
            >
              Underline
            </button>
            <button
              onClick={() => executeCommand("strikeThrough")}
              className="px-3 py-1 rounded text-sm font-medium transition-colors bg-white border border-gray-300 text-gray-600 hover:bg-purple-100"
              type="button"
            >
              Strike
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={insertLink}
              className="p-2 rounded hover:bg-purple-200 transition-colors text-gray-600 bg-white border border-gray-300"
              type="button"
            >
              <Link size={16} />
            </button>
            <button
              onClick={insertImage}
              className="p-2 rounded hover:bg-purple-200 transition-colors text-gray-600 bg-white border border-gray-300"
              type="button"
            >
              <Image size={16} />
            </button>
            <button
              onClick={insertCodeBlock}
              className="p-2 rounded hover:bg-purple-200 transition-colors text-gray-600 bg-white border border-gray-300"
              type="button"
            >
              <Code size={16} />
            </button>
            <button
              onClick={() => executeCommand("insertUnorderedList")}
              className="p-2 rounded hover:bg-purple-200 transition-colors text-gray-600 bg-white border border-gray-300"
              type="button"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => executeCommand("insertOrderedList")}
              className="p-2 rounded hover:bg-purple-200 transition-colors text-gray-600 bg-white border border-gray-300"
              type="button"
            >
              <ListOrdered size={16} />
            </button>
            <button
              onClick={insertTaskList}
              className="px-3 py-1 rounded text-sm font-medium transition-colors bg-white border border-gray-300 text-gray-600 hover:bg-purple-100"
              title="Insert Task List"
              type="button"
            >
              ☑️
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={() => insertCallout("info")}
              className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
              title="Info Callout"
              type="button"
            >
              ℹ️
            </button>
            <button
              onClick={() => insertCallout("warning")}
              className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800 hover:bg-orange-200"
              title="Warning Callout"
              type="button"
            >
              ⚠️
            </button>
            <button
              onClick={() => insertCallout("success")}
              className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 hover:bg-green-200"
              title="Success Callout"
              type="button"
            >
              ✅
            </button>
            <button
              onClick={() => insertCallout("error")}
              className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200"
              title="Error Callout"
              type="button"
            >
              ❌
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={insertMention}
              className="p-2 rounded hover:bg-purple-200 transition-colors text-gray-600 bg-white border border-gray-300"
              title="Mention User"
              type="button"
            >
              <AtSign size={16} />
            </button>
            <button
              onClick={insertHashtag}
              className="p-2 rounded hover:bg-purple-200 transition-colors text-gray-600 bg-white border border-gray-300"
              title="Insert Hashtag"
              type="button"
            >
              <Hash size={16} />
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={() => setShowMarkdown(!showMarkdown)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                showMarkdown
                  ? "bg-purple-200 text-purple-800"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-purple-100"
              }`}
              type="button"
            >
              MD
            </button>
            <button
              onClick={exportAsMarkdown}
              className="p-2 rounded hover:bg-purple-200 transition-colors text-gray-600 bg-white border border-gray-300"
              title="Export as Markdown"
              type="button"
            >
              <Download size={16} />
            </button>
          </div>
          <button
            onClick={() => setShowWordCountDetails(!showWordCountDetails)}
            className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
            type="button"
          >
            {wordCount} words | {charCount} chars | {readingTime}m read
          </button>
        </div>
        <div className="flex gap-4 text-sm">
          {Object.entries(plugins).map(([key, value]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setPlugins({ ...plugins, [key]: e.target.checked })
                }
                className="mr-1"
              />
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
          ))}
        </div>
      </div>
      {showWordCountDetails && (
        <div className="bg-purple-100 border-b border-purple-200 p-3 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <strong>Words:</strong> {wordCount}
            </div>
            <div>
              <strong>Characters:</strong> {charCount}
            </div>
            <div>
              <strong>Reading Time:</strong> {readingTime} min
            </div>
            <div>
              <strong>Paragraphs:</strong>{" "}
              {content.split(/<\/(?:p|div|h[1-6])>/g).length - 1}
            </div>
          </div>
        </div>
      )}
      <div className="flex h-96">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onBlur={saveToHistory}
          className={`flex-1 p-4 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:ring-inset overflow-auto ${
            showMarkdown ? "w-1/2" : "w-full"
          }`}
          style={{ fontSize: "14px", lineHeight: "1.6" }}
          suppressContentEditableWarning={true}
          spellCheck={plugins.spellCheck}
        />
        {showMarkdown && (
          <div className="w-1/2 border-l border-gray-200 bg-gray-50">
            <div className="p-2 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-600">
              Markdown Preview
            </div>
            <pre className="p-4 text-sm font-mono text-gray-700 whitespace-pre-wrap overflow-auto h-full">
              {markdown}
            </pre>
          </div>
        )}
      </div>
      <div className="bg-purple-50 border-t border-purple-200 px-4 py-2 flex justify-between text-xs text-purple-600">
        <span>TipTap Ultimate - The most advanced rich text editor</span>
        <div className="flex gap-4">
          <span>{autoSave ? "💾 Auto-saving" : "💾 Manual save"}</span>
          <span>🎨 Theme: {selectedTheme}</span>
          <span>
            🔌 {Object.values(plugins).filter(Boolean).length}/4 plugins active
          </span>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Rich Text Editors Collection
          </h1>
        </div>
        <div className="space-y-8">
          <EditorjsTextEditor />
          <QuillEditor />
          <TiptapEditor />
        </div>
      </div>
    </div>
  );
};

export default App;
