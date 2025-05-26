import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Certifique-se de que o caminho para supabaseClient está correto
import supabase from '../../utils/supabaseClient'; 

// --- Constantes de Configuração ---
const VALID_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB em bytes
const ACCEPTED_FILE_EXTENSIONS_STRING = '.pdf,.png,.jpg,.jpeg';
const DEFAULT_BUCKET_NAME = 'rscstorage'; // Defina o nome do seu bucket no Supabase Storage aqui

// --- Componentes de Ícone ---
const UploadCloudIcon = ({ className = "w-10 h-10 mb-3 text-gray-400" }) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
  </svg>
);
const PdfFileIcon = ({ className = "h-6 w-6 text-red-500 mr-3 flex-shrink-0" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);
const ImageFileIcon = ({ className = "h-6 w-6 text-blue-500 mr-3 flex-shrink-0" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
  </svg>
);
const TrashIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);
const LoadingSpinnerIcon = ({ className = "animate-spin h-5 w-5 text-indigo-600" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// --- Função Utilitária ---
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// --- Componente Principal ---
const DocumentUploader = ({
  documents = [], // Valor padrão é um array vazio
  onDocumentsChange,
  userId, 
}) => {
  const [uploadingOverall, setUploadingOverall] = useState(false);
  const [errors, setErrors] = useState({}); 

  const handleFileChange = useCallback(async (event) => {
    if (!supabase) {
      console.error("Cliente Supabase não fornecido.");
      setErrors({ general: "Configuração de upload ausente (cliente Supabase). Contate o suporte." });
      return;
    }
    if (!DEFAULT_BUCKET_NAME) {
      console.error("Nome do bucket Supabase não fornecido.");
      setErrors({ general: "Configuração de bucket ausente. Contate o suporte." });
      return;
    }
    if (!userId) {
      console.error("ID do usuário não fornecido para upload.");
      setErrors({ general: "ID do usuário ausente para upload de documentos. Faça login novamente." });
      return;
    }

    setErrors({});
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    setUploadingOverall(true);

    const newClientSideDocuments = selectedFiles.map(file => ({
      id: uuidv4(),
      nome: file.name,
      tipo: file.type,
      tamanho: file.size,
      dataUpload: new Date().toISOString(),
      storagePath: '',
      publicURL: '',
      status: 'validating',
      fileObject: file,
      progress: 0,
    }));

    // Garante que 'documents' seja sempre um array antes de concatenar
    const currentDocsArray = Array.isArray(documents) ? documents : [];
    onDocumentsChange([...currentDocsArray, ...newClientSideDocuments]);

    const uploadPromises = newClientSideDocuments.map(async (doc) => {
      if (!VALID_FILE_TYPES.includes(doc.tipo)) {
        setErrors(prev => ({ ...prev, [doc.id]: `Tipo de arquivo inválido: ${doc.nome}` }));
        return { ...doc, status: 'error', fileObject: null };
      }
      if (doc.tamanho > MAX_FILE_SIZE_BYTES) {
        setErrors(prev => ({ ...prev, [doc.id]: `Arquivo muito grande: ${doc.nome} (${formatFileSize(doc.tamanho)})` }));
        return { ...doc, status: 'error', fileObject: null };
      }

      onDocumentsChange(prevDocs => 
        (Array.isArray(prevDocs) ? prevDocs : []).map(d => d.id === doc.id ? { ...d, status: 'uploading' } : d)
      );

      const fileExt = doc.nome.split('.').pop();
      const filePath = `${userId}/${uuidv4()}.${fileExt}`; 

      try {
        const { data, error: uploadError } = await supabase.storage
          .from(DEFAULT_BUCKET_NAME)
          .upload(filePath, doc.fileObject, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Erro no upload para Supabase Storage:', uploadError);
          setErrors(prev => ({ ...prev, [doc.id]: `Falha no upload: ${doc.nome}. ${uploadError.message}` }));
          return { ...doc, status: 'error', storagePath: filePath, fileObject: null };
        }

        if (data) {
          const { data: urlData } = supabase.storage.from(DEFAULT_BUCKET_NAME).getPublicUrl(filePath);
          return {
            ...doc,
            status: 'success',
            storagePath: data.path,
            publicURL: urlData?.publicUrl || '', // Adiciona verificação para urlData
            fileObject: null,
            progress: 100,
          };
        }
        setErrors(prev => ({ ...prev, [doc.id]: `Falha no upload (resposta inesperada): ${doc.nome}` }));
        return { ...doc, status: 'error', storagePath: filePath, fileObject: null };

      } catch (err) {
        console.error('Erro catastrófico no upload:', err);
        setErrors(prev => ({ ...prev, [doc.id]: `Erro crítico no upload: ${doc.nome}` }));
        return { ...doc, status: 'error', storagePath: filePath, fileObject: null };
      }
    });

    const settledDocuments = await Promise.all(uploadPromises);

    onDocumentsChange(prevDocs => {
        const currentDocs = Array.isArray(prevDocs) ? prevDocs : [];
        const existingDocIds = new Set(newClientSideDocuments.map(nd => nd.id));
        const olderDocs = currentDocs.filter(pd => !existingDocIds.has(pd.id));
        return [...olderDocs, ...settledDocuments.filter(Boolean)];
    });

    setUploadingOverall(false);
    if (event.target) {
      event.target.value = null;
    }
  }, [userId, documents, onDocumentsChange]); // supabase não é uma dependência se for estável


  const handleDelete = useCallback(async (documentIdToDelete) => {
    if (!supabase) {
      console.error("Cliente Supabase não fornecido para exclusão.");
      setErrors({ general: "Configuração de exclusão ausente (cliente Supabase). Contate o suporte." });
      return;
    }
    
    const currentDocsArray = Array.isArray(documents) ? documents : [];
    const docToDelete = currentDocsArray.find(doc => doc.id === documentIdToDelete);

    if (!docToDelete || !docToDelete.storagePath) {
      console.warn("Documento ou caminho de armazenamento não encontrado para exclusão:", documentIdToDelete);
      onDocumentsChange(currentDocsArray.filter(doc => doc.id !== documentIdToDelete));
      return;
    }

    onDocumentsChange(prevDocs => 
        (Array.isArray(prevDocs) ? prevDocs : []).map(d => d.id === documentIdToDelete ? { ...d, status: 'deleting' } : d)
    );

    try {
      const { error: deleteError } = await supabase.storage
        .from(DEFAULT_BUCKET_NAME)
        .remove([docToDelete.storagePath]);

      if (deleteError) {
        console.error('Erro ao deletar do Supabase Storage:', deleteError);
        setErrors(prev => ({ ...prev, [documentIdToDelete]: `Falha ao deletar: ${docToDelete.nome}. ${deleteError.message}` }));
        onDocumentsChange(prevDocs => 
            (Array.isArray(prevDocs) ? prevDocs : []).map(d => d.id === documentIdToDelete ? { ...d, status: docToDelete.status } : d)
        );
        return;
      }

      onDocumentsChange(currentDocsArray.filter(doc => doc.id !== documentIdToDelete));
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[documentIdToDelete];
        return newErrors;
      });

    } catch (err) {
      console.error('Erro catastrófico na exclusão:', err);
      setErrors(prev => ({ ...prev, [documentIdToDelete]: `Erro crítico ao deletar: ${docToDelete.nome}` }));
      onDocumentsChange(prevDocs => 
        (Array.isArray(prevDocs) ? prevDocs : []).map(d => d.id === documentIdToDelete ? { ...d, status: docToDelete.status } : d)
      );
    }
  }, [documents, onDocumentsChange]); // supabase não é uma dependência se for estável

  // Garante que documents é um array para renderização
  const safeDocuments = Array.isArray(documents) ? documents : [];

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-center w-full mb-6">
        <label
          htmlFor="dropzone-file-input"
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer 
                     ${uploadingOverall ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100'} 
                     transition-colors duration-150 ease-in-out`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadCloudIcon />
            {uploadingOverall ? (
              <p className="mb-2 text-sm text-gray-600 font-semibold">Enviando arquivos...</p>
            ) : (
              <>
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold text-indigo-600">Clique para enviar</span> ou arraste e solte
                </p>
                <p className="text-xs text-gray-500">
                  {ACCEPTED_FILE_EXTENSIONS_STRING.toUpperCase().replace(/\./g, '')} (MAX. {formatFileSize(MAX_FILE_SIZE_BYTES)})
                </p>
              </>
            )}
          </div>
          <input
            id="dropzone-file-input"
            type="file"
            className="hidden"
            multiple
            accept={ACCEPTED_FILE_EXTENSIONS_STRING}
            onChange={handleFileChange}
            disabled={uploadingOverall}
          />
        </label>
      </div>

      {errors.general && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm" role="alert">
          <p className="font-bold">Erro de Configuração</p>
          <pre className="whitespace-pre-wrap text-sm">{errors.general}</pre>
        </div>
      )}

      {safeDocuments.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-3 text-gray-700">Documentos Carregados:</h4>
          <ul className="space-y-3">
            {safeDocuments.map((doc) => (
              <li
                key={doc.id || uuidv4()} // Adiciona fallback para key se doc.id não estiver presente
                className="p-3 flex items-center justify-between bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out"
              >
                <div className="flex items-center overflow-hidden mr-2 flex-grow">
                  {doc.tipo && doc.tipo.includes('pdf') ? <PdfFileIcon /> : <ImageFileIcon />}
                  <div className="overflow-hidden flex-grow">
                    <p className="text-sm font-medium text-gray-800 truncate" title={doc.nome || 'Nome indisponível'}>
                      {doc.nome || 'Arquivo sem nome'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {typeof doc.tamanho === 'number' ? formatFileSize(doc.tamanho) : ''}
                      {typeof doc.tamanho === 'number' && (doc.status === 'success' && doc.dataUpload) ? ' - ' : ''}
                      {doc.status === 'success' && doc.dataUpload ? new Date(doc.dataUpload).toLocaleDateString() : doc.status || 'Status desconhecido'}
                      {doc.status === 'uploading' && ` (${doc.progress || 0}%)`}
                    </p>
                    {errors[doc.id] && <p className="text-xs text-red-500 whitespace-pre-wrap">{errors[doc.id]}</p>}
                  </div>
                </div>
                <div className="flex-shrink-0">
                    {doc.status === 'uploading' && <LoadingSpinnerIcon />}
                    {(doc.status === 'success' || doc.status === 'error' || doc.status === 'validating') && doc.id &&
                        <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors duration-150 ease-in-out ml-2"
                        title="Remover documento"
                        aria-label={`Remover o documento ${doc.nome || 'sem nome'}`}
                        disabled={doc.status === 'deleting'}
                        >
                        {doc.status === 'deleting' ? <LoadingSpinnerIcon /> : <TrashIcon />}
                        </button>
                    }
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {safeDocuments.length === 0 && !uploadingOverall && (
         <p className="text-sm text-center text-gray-500 py-4">Nenhum documento adicionado.</p>
      )}
    </div>
  );
};

export default DocumentUploader;
