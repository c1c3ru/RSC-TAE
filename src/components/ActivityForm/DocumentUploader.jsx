
import React, { useState } from 'react';
import { LABELS } from '../../constants/texts';
import supabase from '../../utils/supabaseClient';

const BUCKET_NAME = 'rscstorage';

const DocumentUploader = ({ documents, onDocumentsChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = React.useRef();

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

  // Tornar toda a área de upload clicável
  const handleAreaClick = () => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Função para upload real para o Supabase Storage
  const handleFiles = async (files) => {
    setUploading(true);
    setUploadError('');
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const validFiles = files.filter(file => {
      const isValidType = allowedTypes.includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });
    const uploadedDocs = [];
    for (const file of validFiles) {
      const filePath = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, { upsert: false });
      if (error) {
        setUploadError(`Erro ao enviar ${file.name}: ${error.message}`);
        continue;
      }
      // Gerar URL assinada temporária para download
      const { data: urlData } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(filePath, 60 * 60); // 1h
      uploadedDocs.push({
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData?.signedUrl || '',
        filePath
      });
    }
    setUploading(false);
    if (uploadedDocs.length > 0) {
      onDocumentsChange([...documents, ...uploadedDocs]);
    }
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
        onClick={handleAreaClick}
        style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
      >
        <div className="space-y-2">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            {LABELS.arrasteArquivosAquiOu}
            <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
              {LABELS.cliqueParaSelecionar}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileInput}
              className="hidden"
              disabled={uploading}
            />
          </div>
          <p className="text-xs text-gray-500">
            {LABELS.tiposArquivosPermitidos}
          </p>
          {uploading && <div className="text-blue-600 text-xs mt-2">Enviando arquivo(s)...</div>}
          {uploadError && <div className="text-red-600 text-xs mt-2">{uploadError}</div>}
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
                  {doc.url && (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Ver documento</a>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeDocument(doc.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remover documento"
                disabled={uploading}
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
