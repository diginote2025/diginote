import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
  convertFromHTML,
  ContentState,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";

// React Icons
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

// --- Decorator to render links ---
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
    <a href={url} className="text-blue-600 underline hover:text-blue-800 transition-colors" target="_blank" rel="noreferrer">
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

// Enhanced Toolbar Button Component
const ToolbarButton = ({ onClick, active, title, children, variant = "default" }) => {
  const baseClasses = "flex items-center justify-center min-w-[36px] h-9 p-2 rounded-md transition-all duration-200 cursor-pointer gap-1 text-sm font-medium";
  const variants = {
    default: `bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 ${active ? "bg-blue-600 shadow-md border-transparent" : ""}`,
    success: "bg-green-500 text-white border-none hover:bg-green-600",
    info: "bg-blue-500 text-white border-none hover:bg-blue-600",
    danger: "bg-red-500 text-white border-none hover:bg-red-600",
  };
  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${variants[variant]}`} title={title}>
      {children}
    </button>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
      <p className="text-gray-600">Loading your content...</p>
    </div>
  </div>
);

// Alert Component
const Alert = ({ type, message, onClose }) => {
  const typeClasses = {
    error: "bg-red-50 border-red-300 text-red-800",
    success: "bg-green-50 border-green-300 text-green-800",
  };
  return (
    <div className={`rounded-lg p-4 mt-6 flex items-center justify-between border ${typeClasses[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 bg-transparent border-none cursor-pointer opacity-80 hover:opacity-100">
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator));
  const [blog, setBlog] = useState({ title: "", content: "", category: "", author: "", tags: [] });
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newAuthorImage, setNewAuthorImage] = useState(null);
  const [authorImagePreview, setAuthorImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const updateWordCount = (state) => {
    const text = state.getCurrentContent().getPlainText('');
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/blog/${id}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        setBlog({
          title: data.title,
          content: data.content,
          category: data.category || "",
          author: data.author || "Anonymous",
          tags: Array.isArray(data.tags) ? data.tags : []
        });
        if (data.content) {
          try {
            const parsedContent = JSON.parse(data.content);
            const contentState = convertFromRaw(parsedContent);
            const newEditorState = EditorState.createWithContent(contentState, decorator);
            setEditorState(newEditorState);
            updateWordCount(newEditorState);
          } catch {
            const blocksFromHTML = convertFromHTML(data.content);
            const contentState = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );
            const newEditorState = EditorState.createWithContent(contentState, decorator);
            setEditorState(newEditorState);
            updateWordCount(newEditorState);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load blog content. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchBlog();
    } else {
      setIsLoading(false);
    }
  }, [id]);

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
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
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

  const saveContent = () => {
    const raw = convertToRaw(editorState.getCurrentContent());
    const contentData = { ...blog, content: JSON.stringify(raw) };
    localStorage.setItem("draftContent", JSON.stringify(contentData));
    setSuccess("Draft saved successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const loadContent = () => {
    const saved = localStorage.getItem("draftContent");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setBlog({
          title: data.title || "",
          category: data.category || "",
          author: data.author || "Anonymous",
          tags: Array.isArray(data.tags) ? data.tags : []
        });
        const content = convertFromRaw(JSON.parse(data.content));
        const newEditorState = EditorState.createWithContent(content, decorator);
        handleEditorChange(newEditorState);
        setSuccess("Draft loaded successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError("Failed to load saved content.");
        setTimeout(() => setError(null), 5000);
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
        const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", { url });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        let newState = EditorState.push(editorState, contentStateWithEntity, "apply-entity");
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

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
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
      blog.tags.forEach(tag => formData.append("tags[]", tag));
      if (newImage) formData.append("image", newImage);
      if (newAuthorImage) formData.append("authorImage", newAuthorImage);

      const endpoint = id ? `/blog/update-with-image/${id}` : `/blog`;
      const method = id ? "PUT" : "POST";
      const res = await fetch(`${API_BASE_URL}${endpoint}`, { method, body: formData });
      if (!res.ok) throw new Error("Failed to submit blog");

      setSuccess(`Blog ${id ? 'updated' : 'created'} successfully! Redirecting...`);
      setTimeout(() => navigate("/admin"), 2000);
    } catch (err) {
      setError("Failed to submit blog. Please check your connection and try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20 font-sans">
        <div className="max-w-4xl mx-auto p-6">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const currentInlineStyles = editorState.getCurrentInlineStyle();
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);

  return (
    <div className="bg-gray-50 min-h-screen pt-20 font-sans">
      <div className="max-w-4xl mx-auto p-6">
        <header className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 bg-transparent border-none cursor-pointer transition-colors hover:text-gray-800">
                <FaArrowLeft />
                <span>Back to Blogs</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">{id ? "Edit Blog Post" : "Create New Blog"}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{wordCount} words</span>
              <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md border-none cursor-pointer transition-colors hover:bg-gray-200">
                <FaEye />
                <span>{showPreview ? "Edit" : "Preview"}</span>
              </button>
            </div>
          </div>
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
        </header>

        <form onSubmit={handleUpdateBlog} className="flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 transition-shadow hover:shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaImage className="mr-2 text-blue-500" />
              Featured Image
            </h2>
            <div className="flex flex-col gap-5">
              {id && (
                <div className="relative">
                  <img
                    src={`${API_BASE_URL}/blog/image/${id}?t=${Date.now()}`}
                    alt="Current blog"
                    className="w-full h-72 object-cover rounded-xl border border-gray-300"
                    onError={(e) => e.target.style.display = "none"}
                  />
                  <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer rounded-xl opacity-0 transition-opacity hover:opacity-100">
                    <span className="text-white font-medium bg-blue-600 px-4 py-2 rounded-lg shadow-md transition-colors hover:bg-blue-700">Change Image</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNewImage, setImagePreview)} className="hidden" />
                  </label>
                </div>
              )}
              {!id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Featured Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNewImage, setImagePreview)} className="w-full border border-gray-300 rounded-lg p-3 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40" />
                </div>
              )}
              {imagePreview && (
                <div>
                  <p className="text-sm font-medium text-green-600 mb-2">New Image Preview:</p>
                  <img src={imagePreview} alt="Preview" className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300 shadow-sm" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 transition-shadow hover:shadow-lg md:flex md:gap-6">
            <div className="w-full md:w-1/3">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaImage className="mr-2 text-blue-500" />
                Author Image
              </h2>
              <div className="flex flex-col gap-5">
                {id && (
                  <div className="relative w-full aspect-square rounded-full overflow-hidden">
                    <img
                      src={`${API_BASE_URL}/blog/author-image/${id}?t=${Date.now()}`}
                      alt="Current author"
                      className="w-32 h-32 object-cover rounded-full border border-gray-300"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer rounded-full opacity-0 transition-opacity hover:opacity-100">
                      <span className="text-white font-medium bg-blue-600 px-4 py-2 rounded-lg shadow-md transition-colors hover:bg-blue-700">Change</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNewAuthorImage, setAuthorImagePreview)} className="hidden" />
                    </label>
                  </div>
                )}
                {!id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Author Image</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNewAuthorImage, setAuthorImagePreview)} className="w-full border border-gray-300 rounded-lg p-3 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40" />
                  </div>
                )}
                {authorImagePreview && (
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">New Author Image Preview:</p>
                    <img src={authorImagePreview} alt="Author Preview" className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-sm" />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title *</label>
                <input type="text" name="title" value={blog.title} onChange={handleInputChange} placeholder="Enter an engaging blog title..." className="w-full border border-gray-300 rounded-lg p-3 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input type="text" name="category" value={blog.category} onChange={handleInputChange} placeholder="e.g., Technology, Travel..." className="w-full border border-gray-300 rounded-lg p-3 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
                <input type="text" name="author" value={blog.author} onChange={handleInputChange} placeholder="Enter author name..." className="w-full border border-gray-300 rounded-lg p-3 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input type="text" value={blog.tags.join(", ")} onChange={handleTagsChange} placeholder="e.g., tech, coding, javascript..." className="w-full border border-gray-300 rounded-lg p-3 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <ToolbarButton onClick={saveContent} variant="success" title="Save Draft">
                  <FaSave /> Save
                </ToolbarButton>
                <ToolbarButton onClick={loadContent} variant="info" title="Load Draft">
                  <FaUpload /> Load
                </ToolbarButton>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex gap-1 pr-3 border-r border-gray-300">
                  <ToolbarButton onClick={() => toggleInlineStyle("BOLD")} active={currentInlineStyles.has("BOLD")} title="Bold (Ctrl+B)"><FaBold /></ToolbarButton>
                  <ToolbarButton onClick={() => toggleInlineStyle("ITALIC")} active={currentInlineStyles.has("ITALIC")} title="Italic (Ctrl+I)"><FaItalic /></ToolbarButton>
                  <ToolbarButton onClick={() => toggleInlineStyle("UNDERLINE")} active={currentInlineStyles.has("UNDERLINE")} title="Underline (Ctrl+U)"><FaUnderline /></ToolbarButton>
                </div>
                <div className="flex gap-1 pr-3 border-r border-gray-300">
                  <ToolbarButton onClick={() => toggleBlockType("header-one")} active={currentBlockType === "header-one"} title="Heading 1">H1</ToolbarButton>
                  <ToolbarButton onClick={() => toggleBlockType("header-two")} active={currentBlockType === "header-two"} title="Heading 2">H2</ToolbarButton>
                  <ToolbarButton onClick={() => toggleBlockType("header-three")} active={currentBlockType === "header-three"} title="Heading 3">H3</ToolbarButton>
                </div>
                <div className="flex gap-1 pr-3 border-r border-gray-300">
                  <ToolbarButton onClick={() => toggleBlockType("unordered-list-item")} active={currentBlockType === "unordered-list-item"} title="Bullet List"><FaListUl /></ToolbarButton>
                  <ToolbarButton onClick={() => toggleBlockType("ordered-list-item")} active={currentBlockType === "ordered-list-item"} title="Numbered List"><FaListOl /></ToolbarButton>
                  <ToolbarButton onClick={() => toggleBlockType("blockquote")} active={currentBlockType === "blockquote"} title="Quote"><FaQuoteRight /></ToolbarButton>
                  <ToolbarButton onClick={() => toggleBlockType("code-block")} active={currentBlockType === "code-block"} title="Code Block"><FaCode /></ToolbarButton>
                </div>
                <div className="flex gap-1">
                  <ToolbarButton onClick={addLink} variant="info" title="Add Link"><FaLink /></ToolbarButton>
                  <ToolbarButton onClick={removeLink} variant="danger" title="Remove Link"><FaUnlink /></ToolbarButton>
                </div>
              </div>
            </div>
            <div className="min-h-[250px] max-h-[300px] overflow-y-auto border border-gray-300 p-3 rounded-md bg-gray-50">
              {showPreview ? (
            <div
  className="[&>h1]:text-4xl [&>h1]:font-extrabold [&>h1]:text-gray-900 [&>h1]:leading-tight"
  dangerouslySetInnerHTML={{ __html: post.title }}
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

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex justify-between items-center">
            <button type="button" onClick={() => navigate("/admin")} className="flex items-center gap-2 px-6 py-2 rounded-lg border border-gray-300 text-gray-700 cursor-pointer transition-colors hover:bg-gray-50">
              <FaTimes />
              <span>Cancel</span>
            </button>
            <div className="flex gap-3">
              <button type="button" onClick={saveContent} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-600 text-white cursor-pointer transition-colors hover:bg-gray-700">
                <FaSave />
                <span>Save Draft</span>
              </button>
              <button type="submit" disabled={isUpdating || !blog.title.trim()} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white min-w-[140px] justify-center cursor-pointer transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {isUpdating ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>{id ? "Update Blog" : "Create Blog"}</span>
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