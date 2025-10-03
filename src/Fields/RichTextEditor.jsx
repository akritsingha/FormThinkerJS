import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { ListItem } from '@tiptap/extension-list-item';
import Heading from '@tiptap/extension-heading';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { AiOutlineUnorderedList, AiOutlineOrderedList } from "react-icons/ai"; 
import { FaLink, FaLinkSlash } from "react-icons/fa6";
import { RiFormatClear } from "react-icons/ri";
import { MdOutlineFormatLineSpacing } from "react-icons/md";



function RichTextWidget({ value, onChange, placeholder, disabled = false, fieldpath }) {
  const [isMounted, setIsMounted] = useState(false);
  const [showLineSpacingOptions, setShowLineSpacingOptions] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLineSpacingOptions && !event.target.closest('.line-spacing-container')) {
        setShowLineSpacingOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLineSpacingOptions]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        paragraph: {
          HTMLAttributes: {
            class: null,
          },
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];
          const classMap = {
            1: 'text-4xl',
            2: 'text-3xl',
            3: 'text-2xl',
          };
          const classes = [HTMLAttributes.class, classMap[level]].filter(Boolean).join(' ');
          return [
            `h${level}`,
            {
              ...HTMLAttributes,
              class: classes,
            },
            0,
          ];
        },
      }),
      TextStyle,
      Color,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      BulletList.extend({
        renderHTML({ HTMLAttributes }) {
          const classes = [HTMLAttributes.class, 'list-disc pl-6'].filter(Boolean).join(' ');
          return [
            'ul',
            {
              ...HTMLAttributes,
              class: classes,
            },
            0,
          ];
        },
      }),
      OrderedList.extend({
        renderHTML({ HTMLAttributes }) {
          const classes = [HTMLAttributes.class, 'list-decimal pl-6'].filter(Boolean).join(' ');
          return [
            'ol',
            {
              ...HTMLAttributes,
              class: classes,
            },
            0,
          ];
        },
      }),
      ListItem,
    ],
    content: value || '',
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onChange) onChange(fieldpath, editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] p-3',
        placeholder: placeholder || 'Enter text...',
      },
    },
  });

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const toggleHeading = (level) => editor?.chain().focus().toggleHeading({ level }).run();
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const setTextAlign = (alignment) => editor?.chain().focus().setTextAlign(alignment).run();
  const setColor = (color) => editor?.chain().focus().setColor(color).run();
  const clearFormat = () => editor?.chain().focus().clearNodes().unsetAllMarks().run();
  const setLinkMark = () => {
    const previousUrl = editor?.getAttributes('link')?.href || '';
    const url = window.prompt('Enter URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };
  const unsetLinkMark = () => editor?.chain().focus().unsetLink().run();

  if (!isMounted || !editor) {
    return (
      <div className="rich-text-editor border border-gray-300 rounded-md shadow-sm">
        <div className="toolbar border-b border-gray-200 p-2 bg-gray-50 rounded-t-md">
          <div className="text-sm text-gray-500">Loading rich text editor...</div>
        </div>
        <div className="p-3 min-h-[150px] bg-white rounded-b-md">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      {/* Toolbar */}
      <div className="toolbar border-b border-gray-200 p-2 bg-gray-50 rounded-t-md flex flex-wrap gap-1">
        {/* Headers */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => toggleHeading(1)}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => toggleHeading(2)}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => toggleHeading(3)}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        {/* Text Formatting */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={toggleBold}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={toggleItalic}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={toggleStrike}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
          <button
            type="button"
            onClick={toggleUnderline}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Underline"
          >
            <span style={{ textDecoration: 'underline' }}>U</span>
          </button>
        </div>

        {/* Links */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={setLinkMark}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Add/Edit Link"
          >
            <FaLink/>
          </button>
          <button
            type="button"
            onClick={unsetLinkMark}
            className="px-2 py-1 text-sm rounded hover:bg-gray-200 text-gray-700"
            title="Remove Link"
          >
            <FaLinkSlash/>
          </button>
        </div>

        {/* Lists */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={toggleBulletList}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Bullet List"
          >
            <AiOutlineUnorderedList/>
          </button>
          <button
            type="button"
            onClick={toggleOrderedList}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Numbered List"
          >
            <AiOutlineOrderedList/>
          </button>
        </div>

        {/* Alignment */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => setTextAlign('left')}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Align Left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setTextAlign('center')}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Align Center"
          >
            ↔
          </button>
          <button
            type="button"
            onClick={() => setTextAlign('right')}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Align Right"
          >
            →
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-2 border-r border-gray-300 pr-2 mr-2">
          <input
            type="color"
            onChange={(e) => setColor(e.target.value)}
            className="h-6 w-6 rounded overflow-hidden cursor-pointer border border-neutral-300"
            title="Pick color"
          />
        </div>

        {/* Clear Format */}
        <button
          type="button"
          onClick={clearFormat}
          className="px-2 py-1 text-sm rounded hover:bg-gray-200 text-gray-700"
          title="Clear Formatting"
        >
          <RiFormatClear/>
        </button>
      </div>

      {/* Editor Content */}
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default RichTextWidget;
