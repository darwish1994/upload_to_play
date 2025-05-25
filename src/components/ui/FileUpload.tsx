import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import Button from './Button';

interface FileUploadProps {
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
  onPreviewChange: (preview: string) => void;
  preview?: string;
  error?: string;
  required?: boolean;
  maxSize?: number; // in MB
  width?: number; // required width in pixels
  height?: number; // required height in pixels
  multiple?: boolean;
  onMultipleChange?: (files: File[]) => void;
  onMultiplePreviewChange?: (previews: string[]) => void;
  previews?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  onChange,
  onPreviewChange,
  preview = '',
  error,
  required = false,
  maxSize = 5, // Default 5MB
  width,
  height,
  multiple = false,
  onMultipleChange,
  onMultiplePreviewChange,
  previews = [],
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [dimensionError, setDimensionError] = useState<string>('');
  
  const maxSizeBytes = maxSize * 1024 * 1024;

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setDimensionError('');
    
    if (multiple && onMultipleChange && onMultiplePreviewChange) {
      const filesArray = Array.from(files);
      
      // Check file size
      const validFiles = filesArray.filter(file => file.size <= maxSizeBytes);
      if (validFiles.length !== filesArray.length) {
        setDimensionError(`Some files exceed the maximum size of ${maxSize}MB`);
      }
      
      onMultipleChange(validFiles);
      
      // Create previews
      const newPreviews: string[] = [];
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            if (newPreviews.length === validFiles.length) {
              onMultiplePreviewChange(newPreviews);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = files[0];
      
      // Check file size
      if (file.size > maxSizeBytes) {
        setDimensionError(`File exceeds the maximum size of ${maxSize}MB`);
        return;
      }
      
      onChange(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const dataUrl = e.target.result as string;
          onPreviewChange(dataUrl);
          
          // Check dimensions if required
          if (width && height) {
            const img = new Image();
            img.onload = () => {
              if (img.width !== width || img.height !== height) {
                setDimensionError(`Image must be exactly ${width}x${height}px`);
              }
            };
            img.src = dataUrl;
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleClear = (index?: number) => {
    if (multiple && onMultipleChange && onMultiplePreviewChange && typeof index === 'number') {
      const newPreviews = [...previews];
      newPreviews.splice(index, 1);
      onMultiplePreviewChange(newPreviews);
      
      // Since we don't have direct access to the files array, we can only update the previews
      // The caller will need to handle this in their logic
    } else {
      onChange(null);
      onPreviewChange('');
    }
    setDimensionError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${error || dimensionError ? 'border-red-500' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {multiple ? (
          <div>
            {previews.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {previews.map((previewUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={previewUrl}
                      alt={`Preview ${index}`}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleClear(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop files here, or click to select files
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Maximum file size: {maxSize}MB
                </p>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              Select Files
            </Button>
          </div>
        ) : (
          <div>
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto max-h-48 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleClear()}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="py-6">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop a file here, or click to select
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Maximum file size: {maxSize}MB
                  {width && height && `, Required dimensions: ${width}x${height}px`}
                </p>
              </div>
            )}
            {!preview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                Select File
              </Button>
            )}
          </div>
        )}
        
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
          multiple={multiple}
        />
      </div>
      
      {(error || dimensionError) && (
        <p className="mt-1 text-sm text-red-600">{error || dimensionError}</p>
      )}
    </div>
  );
};

export default FileUpload;