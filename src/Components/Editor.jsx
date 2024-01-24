import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
  SelectionState,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./Editor.css";

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    // Load content from local storage on component mount
    const savedContent = localStorage.getItem("draftEditorContent");
    if (savedContent) {
      setEditorState(
        EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      );
    }
  }, []);

  const handleInputChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleSave = () => {
    // Save content to local storage
    const contentState = editorState.getCurrentContent();
    localStorage.setItem(
      "draftEditorContent",
      JSON.stringify(convertToRaw(contentState))
    );
  };

  const handleBeforeInput = (char, editorState) => {
    const selectionState = editorState.getSelection();
    const currentBlockKey = selectionState.getStartKey();

    // Get the current content
    const contentState = editorState.getCurrentContent();

    // Get the current line text
    const currentLineText = contentState
      .getBlockForKey(currentBlockKey)
      .getText();

    if (
      char === " " &&
      currentLineText.startsWith("#") &&
      currentLineText.length < 2
    ) {
      // Handle '#' and space condition
      const newText = currentLineText.slice(2);
      const newContentState = Modifier.replaceText(
        contentState,
        new SelectionState({
          anchorKey: currentBlockKey,
          anchorOffset: 0,
          focusKey: currentBlockKey,
          focusOffset: currentLineText.length,
        }),
        newText,
        contentState.getBlockForKey(currentBlockKey).getInlineStyleAt(0)
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "replace-text"
      );
      const headerEditorState = RichUtils.toggleBlockType(
        newEditorState,
        "header-one"
      );
      setEditorState(EditorState.moveFocusToEnd(headerEditorState));
      return "handled";
    } else if (
      char === " " &&
      currentLineText.startsWith("***") &&
      currentLineText.length < 4
    ) {
      // Handle '***' and space condition
      const newText = currentLineText.slice(3);
      const newContentState = Modifier.replaceText(
        contentState,
        new SelectionState({
          anchorKey: currentBlockKey,
          anchorOffset: 0,
          focusKey: currentBlockKey,
          focusOffset: currentLineText.length,
        }),
        newText,
        contentState.getBlockForKey(currentBlockKey).getInlineStyleAt(0)
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "replace-text"
      );
      const underLineEditorState = RichUtils.toggleInlineStyle(
        newEditorState,
        "UNDERLINE"
      );
      setEditorState(underLineEditorState);
      return "handled";
    } else if (
      char === " " &&
      currentLineText.startsWith("**") &&
      currentLineText.length < 3
    ) {
      // Handle '**' and space condition
      const newText = currentLineText.slice(2);
      const newContentState = Modifier.replaceText(
        contentState,
        new SelectionState({
          anchorKey: currentBlockKey,
          anchorOffset: 0,
          focusKey: currentBlockKey,
          focusOffset: currentLineText.length,
        }),
        newText,
        contentState.getBlockForKey(currentBlockKey).getInlineStyleAt(0)
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "replace-text"
      );
      const boldEditorState = RichUtils.toggleInlineStyle(
        newEditorState,
        "RED"
      );
      setEditorState(boldEditorState);
      return "handled";
    } else if (
      char === " " &&
      currentLineText.startsWith("*") &&
      currentLineText.length < 2
    ) {
      // Handle '*' and space condition
      const newText = currentLineText.slice(1);
      const newContentState = Modifier.replaceText(
        contentState,
        new SelectionState({
          anchorKey: currentBlockKey,
          anchorOffset: 0,
          focusKey: currentBlockKey,
          focusOffset: currentLineText.length,
        }),
        newText,
        contentState.getBlockForKey(currentBlockKey).getInlineStyleAt(0)
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "replace-text"
      );
      const boldEditorState = RichUtils.toggleInlineStyle(
        newEditorState,
        "BOLD"
      );
      setEditorState(boldEditorState);
      return "handled";
    }

    return "not-handled";
  };

  const styleMap = {
    RED: {
      color: "red",
    },
  };

  return (
    <div>
      <div className="header">
        <h1>Demo Editor By Rahul Saharan</h1>
      </div>

      <div className="editor-container">
        <Editor
          customStyleMap={styleMap}
          editorState={editorState}
          onChange={handleInputChange}
          handleBeforeInput={handleBeforeInput}
        />
        <div>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftEditor;
