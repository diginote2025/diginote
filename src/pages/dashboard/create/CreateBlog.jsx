import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  CompositeDecorator,
  ContentState,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";

// Icons
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaCode,
  FaLink,
  FaUnlink,
  FaSave,
  FaUpload,
  FaArrowLeft,
  FaImage,
  FaEye,
  FaSpinner,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:3000";

// --- Link decorator ---
function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
}

const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} className="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noreferrer">
      {props.children}
    </a>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

// Toolbar button
const ToolbarButton = ({ onClick, active, title, children, variant = "default" }) => {
  const baseClasses = "flex items-center justify-center p-2 rounded-md transition-all duration-200 cursor-pointer text-sm gap-1";
  
  const variants = {
    default: `bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 ${active ? "bg-blue-100 border-blue-600 text-blue-600" : ""}`,
    success: "bg-green-100 border-green-700 text-green-700 hover:bg-green-200",
    info: "bg-blue-100 border-blue-700 text-blue-700 hover:bg-blue-200",
    danger: "bg-red-100 border-red-700 text-red-700 hover:bg-red-200",
  };

  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${variants[variant]}`} title={title}>
      {children}
    </button>
  );
};

// Alert
const Alert = ({ type, message, onClose }) => {
  const typeClasses = {
    error: "bg-red-100 text-red-700 border-red-300",
    success: "bg-green-100 text-green-700 border-green-300",
  };
  return (
    <div className={`p-4 rounded-lg text-sm mt-2 flex justify-between items-center border ${typeClasses[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="border-none bg-transparent cursor-pointer text-base">
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export const CreateBlog = () => {
  const navigate = useNavigate();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    category: "",
    author: "",
    tags: [],
  });

  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newAuthorImage, setNewAuthorImage] = useState(null);
  const [authorImagePreview, setAuthorImagePreview] = useState(null);

  const [isCreating, setIsCreating] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // --- Helpers ---
  const updateWordCount = (state) => {
    const text = state.getCurrentContent().getPlainText("");
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleEditorChange = (newState) => {
    setEditorState(newState);
    updateWordCount(newState);
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(" ")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setBlog({ ...blog, tags });
  };

  const handleFileChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPreview(event.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const saveDraft = () => {
    const raw = convertToRaw(editorState.getCurrentContent());
    const contentData = { ...blog, content: JSON.stringify(raw) };
    localStorage.setItem("draftContent", JSON.stringify(contentData));
    setSuccess("Draft saved successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const loadDraft = () => {
    const saved = localStorage.getItem("draftContent");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setBlog({
          title: data.title || "",
          category: data.category || "",
          author: data.author || "Anonymous",
          tags: Array.isArray(data.tags) ? data.tags : [],
        });
        const content = JSON.parse(data.content);
        const contentState = ContentState.createFromBlockArray(content.blocks);
        const newEditorState = EditorState.createWithContent(contentState, decorator);
        handleEditorChange(newEditorState);
        setSuccess("Draft loaded successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } catch {
        setError("Failed to load saved content.");
        setTimeout(() => setError(null), 3000);
      }
    } else {
      setError("No saved draft found.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const addLink = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const url = prompt("Enter the URL:");
      if (url) {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", {
          url,
        });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        let newState = EditorState.push(
          editorState,
          contentStateWithEntity,
          "apply-entity"
        );
        newState = RichUtils.toggleLink(newState, newState.getSelection(), entityKey);
        handleEditorChange(newState);
      }
    } else {
      setError("Please select some text to add a link.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const removeLink = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      handleEditorChange(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const contentState = editorState.getCurrentContent();
      const htmlContent = stateToHTML(contentState);

      const formData = new FormData();
      formData.append("title", blog.title);
      formData.append("content", htmlContent);
      formData.append("category", blog.category);
      formData.append("author", blog.author);
      blog.tags.forEach((tag) => formData.append("tags[]", tag));
      if (newImage) formData.append("image", newImage);
      if (newAuthorImage) formData.append("authorImage", newAuthorImage);

      const res = await fetch(`${API_BASE_URL}/blog`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create blog");

      setSuccess("Blog created successfully! Redirecting...");
      setTimeout(() => navigate("/admin"), 2000);
    } catch (err) {
      setError("Failed to create blog. Please check your connection and try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const currentInlineStyles = editorState.getCurrentInlineStyle();
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);

  return (
    <div className="flex justify-center p-8 bg-gray-50 min-h-screen pt-20">
      <div className="max-w-4xl w-full">
        <header className="bg-white rounded-lg p-5 mb-6 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-3 py-1.5 border-none bg-gray-200 rounded-md cursor-pointer text-sm hover:bg-gray-300">
                <FaArrowLeft />
                <span>Back to Blogs</span>
              </button>
              <div className="w-px h-6 bg-gray-400"></div>
              <h1 className="text-xl font-bold">Create New Blog</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{wordCount} words</span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white rounded-md cursor-pointer text-sm hover:bg-gray-100"
              >
                <FaEye />
                <span>{showPreview ? "Edit" : "Preview"}</span>
              </button>
            </div>
          </div>
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
          {success && (
            <Alert type="success" message={success} onClose={() => setSuccess(null)} />
          )}
        </header>

        <form onSubmit={handleCreateBlog} className="flex flex-col gap-6">
          {/* Featured Image */}
          <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
            <h2 className="text-lg font-bold flex items-center mb-4">
              <FaImage className="mr-2 text-gray-700" />
              Featured Image
            </h2>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setNewImage, setImagePreview)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {imagePreview && (
              <div>
                <p className="text-sm text-gray-600 mt-2">New Image Preview:</p>
                <img src={imagePreview} alt="Preview" className="max-w-full mt-3 rounded-md border border-gray-300 max-h-52 object-cover" />
              </div>
            )}
          </div>

          {/* Author Image */}
          <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
            <h2 className="text-lg font-bold flex items-center mb-4">
              <FaImage className="mr-2 text-gray-700" />
              Author Image
            </h2>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setNewAuthorImage, setAuthorImagePreview)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {authorImagePreview && (
              <div>
                <p className="text-sm text-gray-600 mt-2">New Author Image Preview:</p>
                <img
                  src={authorImagePreview}
                  alt="Author Preview"
                  className="max-w-xs mt-3 rounded-full border border-gray-300 h-24 w-24 object-cover"
                />
              </div>
            )}
          </div>

          {/* Blog details */}
          <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block font-medium mb-1">Blog Title *</label>
                <input
                  type="text"
                  name="title"
                  value={blog.title}
                  onChange={handleInputChange}
                  placeholder="Enter an engaging blog title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={blog.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Technology, Travel..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Author Name</label>
                <input
                  type="text"
                  name="author"
                  value={blog.author}
                  onChange={handleInputChange}
                  placeholder="Enter author name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Tags</label>
                <input
                  type="text"
                  value={blog.tags.join(" ")}
                  onChange={handleTagsChange}
                  placeholder="e.g., tech coding javascript..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Content editor */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex justify-between flex-wrap mb-3 gap-3">
              <div className="flex gap-2">
                <ToolbarButton onClick={saveDraft} variant="success" title="Save Draft">
                  <FaSave /> Save
                </ToolbarButton>
                <ToolbarButton onClick={loadDraft} variant="info" title="Load Draft">
                  <FaUpload /> Load
                </ToolbarButton>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex gap-1 pr-3">
                  <ToolbarButton onClick={() => toggleInlineStyle("BOLD")} active={currentInlineStyles.has("BOLD")} title="Bold"><FaBold /></ToolbarButton>
                  <ToolbarButton onClick={() => toggleInlineStyle("ITALIC")} active={currentInlineStyles.has("ITALIC")} title="Italic"><FaItalic /></ToolbarButton>
                  <ToolbarButton onClick={() => toggleInlineStyle("UNDERLINE")} active={currentInlineStyles.has("UNDERLINE")} title="Underline"><FaUnderline /></ToolbarButton>
                </div>
                <div className="flex gap-1">
                  <ToolbarButton onClick={() => toggleBlockType("unordered-list-item")} active={currentBlockType === "unordered-list-item"} title="Bullet List"><FaListUl /></ToolbarButton>
                  <ToolbarButton onClick={() => toggleBlockType("ordered-list-item")} active={currentBlockType === "ordered-list-item"} title="Numbered List"><FaListOl /></ToolbarButton>
                  <ToolbarButton onClick={() => toggleBlockType("blockquote")} active={currentBlockType === "blockquote"} title="Quote"><FaQuoteRight /></ToolbarButton>
                  <ToolbarButton onClick={() => toggleBlockType("code-block")} active={currentBlockType === "code-block"} title="Code Block"><FaCode /></ToolbarButton>
                </div>
                <div className="flex gap-1">
                  <select
                    value={currentBlockType}
                    onChange={(e) => toggleBlockType(e.target.value)}
                    className="px-2 py-1 rounded-md border border-gray-300 text-sm bg-white cursor-pointer focus:outline-none focus:border-gray-500"
                  >
                    <option value="unstyled">Paragraph</option>
                    <option value="header-one">Heading 1</option>
                    <option value="header-two">Heading 2</option>
                    <option value="header-three">Heading 3</option>
                    <option value="header-four">Heading 4</option>
                    <option value="header-five">Heading 5</option>
                    <option value="header-six">Heading 6</option>
                  </select>
                </div>
                <div className="flex gap-1">
                  <ToolbarButton onClick={addLink} variant="info" title="Add Link"><FaLink /></ToolbarButton>
                  <ToolbarButton onClick={removeLink} variant="danger" title="Remove Link"><FaUnlink /></ToolbarButton>
                </div>
              </div>
            </div>
            <div className="min-h-[250px] border border-gray-300 p-3 rounded-md bg-gray-50">
              {showPreview ? (
                <div
                  className="prose max-w-none p-2 bg-white rounded-md border border-gray-300"
                  dangerouslySetInnerHTML={{
                    __html: stateToHTML(editorState.getCurrentContent()),
                  }}
                />
              ) : (
                <Editor
                  editorState={editorState}
                  onChange={handleEditorChange}
                  handleKeyCommand={handleKeyCommand}
                  placeholder="Start writing your blog content..."
                  spellCheck
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg p-5 shadow-sm flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm cursor-pointer border-none bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={saveDraft}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm cursor-pointer border-none bg-green-100 text-green-700 hover:bg-green-200"
              >
                <FaSave />
                <span>Save Draft</span>
              </button>
              <button
                type="submit"
                disabled={isCreating || !blog.title.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm cursor-pointer border-none bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>Create Blog</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};