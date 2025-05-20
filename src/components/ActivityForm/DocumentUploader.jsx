import React, { useState } from 'react';

const DocumentUploader = ({ documents = [], onDocumentsChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle file selection
  const handleFileChange = (e) => {
    setError('');
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check file size and type
    const invalidFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      return !validTypes.includes(file.type) || file.size > maxSize;
    });
    
    if (invalidFiles.length > 0) {
      setError('Alguns arquivos são inválidos. Certifique-se que são PDF, JPG ou PNG e menores que 5MB.');
      return;
    }
    
    // Simulate upload - in a real implementation, you would upload to a server
    setUploading(true);
    
    // Create document objects
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      nome: file.name,
      tipo: file.type,
      tamanho: file.size,
      dataUpload: new Date().toISOString(),
      arquivo: URL.createObjectURL(file),
      status: 'pendente'
    }));
    
    // Wait a moment to simulate upload
    setTimeout(() => {
      setUploading(false);
      onDocumentsChange([...documents, ...newDocuments]);
    }, 1000);
  };
  
  // Delete document handler
  const handleDelete = (documentId) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    onDocumentsChange(updatedDocuments);
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <div className="bg-gray-50 p-4 border border-gray-300 rounded-md">
      {/* File input */}
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            {uploading ? (
              <p className="mb-2 text-sm text-gray-500">Enviando...</p>
            ) : (
              <>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                </p>
                <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
              </>
            )}
          </div>
          <input 
            id="dropzone-file" 
            type="file" 
            className="hidden" 
            multiple 
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      {/* Document list */}
      {documents.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Documentos enviados:</h4>
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li key={doc.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center">
                  {/* Icon based on file type */}
                  {doc.tipo.includes('pdf') ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{doc.nome}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(doc.tamanho)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(doc.id)} 
                  className="text-red-500 hover:text-red-700"
                  title="Remover documento"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;