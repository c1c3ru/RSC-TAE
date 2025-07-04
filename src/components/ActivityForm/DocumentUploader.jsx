
import React, { useState } from 'react';
import { LABELS } from '../../constants/texts';

const DocumentUploader = ({ documents, onDocumentsChange }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValidType = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    const newDocuments = validFiles.map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      url: URL.createObjectURL(file)
    }));

    onDocumentsChange([...documents, ...newDocuments]);
  };

  const removeDocument = (docId) => {
    const updatedDocs = documents.filter(doc => doc.id !== docId);
    onDocumentsChange(updatedDocs);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            {LABELS.arrasteArquivosAquiOu}
            <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
              {LABELS.cliqueParaSelecionar}
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            {LABELS.tiposArquivosPermitidos}
          </p>
        </div>
      </div>

      {/* Documents List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Documentos anexados:</h4>
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {doc.type === 'application/pdf' ? (
                    <span className="text-red-500">📄</span>
                  ) : (
                    <span className="text-green-500">🖼️</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(doc.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeDocument(doc.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remover documento"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
