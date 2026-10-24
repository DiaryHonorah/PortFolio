import React, { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

const RichTextEditor = ({ value, onChange, placeholder = 'Écrivez votre contenu ici...' }) => {
    const editorRef = useRef(null);
    const quillInstance = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            // Initialiser Quill
            quillInstance.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: placeholder,
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        [{ 'align': [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ],
                },
            });

            // Écouter les changements
            quillInstance.current.on('text-change', () => {
                const html = quillInstance.current.root.innerHTML;
                onChange(html);
            });

            setIsReady(true);
        }

        return () => {
            if (quillInstance.current) {
                quillInstance.current = null;
            }
        };
    }, [onChange, placeholder]);

    // Mettre à jour le contenu quand value change
    useEffect(() => {
        if (isReady && quillInstance.current && value !== quillInstance.current.root.innerHTML) {
            quillInstance.current.root.innerHTML = value || '';
        }
    }, [value, isReady]);

    // Styles personnalisés pour le mode sombre
    const customStyles = `
        .ql-toolbar {
            background: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px 8px 0 0 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        .ql-toolbar .ql-stroke {
            stroke: #9ca3af !important;
        }
        .ql-toolbar .ql-fill {
            fill: #9ca3af !important;
        }
        .ql-toolbar button:hover .ql-stroke {
            stroke: #00D4FF !important;
        }
        .ql-toolbar button:hover .ql-fill {
            fill: #00D4FF !important;
        }
        .ql-toolbar .ql-active .ql-stroke {
            stroke: #00D4FF !important;
        }
        .ql-toolbar .ql-active .ql-fill {
            fill: #00D4FF !important;
        }
        .ql-container {
            background: rgba(255, 255, 255, 0.03) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            border-radius: 0 0 8px 8px !important;
            min-height: 200px !important;
            color: #e5e7eb !important;
            font-size: 14px !important;
        }
        .ql-editor {
            min-height: 200px !important;
            color: #e5e7eb !important;
            font-family: inherit !important;
        }
        .ql-editor.ql-blank::before {
            color: #6b7280 !important;
            font-style: italic !important;
        }
        .ql-editor a {
            color: #00D4FF !important;
        }
        .ql-editor blockquote {
            border-left-color: #00D4FF !important;
            color: #9ca3af !important;
        }
        .ql-editor code {
            background: rgba(255, 255, 255, 0.1) !important;
            color: #f472b6 !important;
            padding: 2px 4px !important;
            border-radius: 4px !important;
        }
        .ql-editor pre.ql-syntax {
            background: rgba(0, 0, 0, 0.3) !important;
            color: #e5e7eb !important;
            border-radius: 8px !important;
            padding: 12px !important;
        }
        .ql-editor h1, .ql-editor h2, .ql-editor h3 {
            color: #ffffff !important;
        }
        .ql-editor ul, .ql-editor ol {
            color: #e5e7eb !important;
        }
        @media (max-width: 640px) {
            .ql-toolbar {
                flex-wrap: wrap !important;
                gap: 2px !important;
            }
            .ql-toolbar .ql-formats {
                margin-right: 4px !important;
            }
            .ql-editor {
                font-size: 13px !important;
                min-height: 150px !important;
            }
        }
    `;

    return (
        <div className="rich-text-editor">
            <style>{customStyles}</style>
            <div ref={editorRef} />
        </div>
    );
};

export default RichTextEditor;