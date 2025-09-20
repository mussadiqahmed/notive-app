import axiosInstance from './axiosSingleton';

/**
 * Upload a file to the server
 * @param {Object} params - Upload parameters
 * @param {string} params.folderId - ID of the folder to upload to
 * @param {string} params.name - Name of the file
 * @param {string} params.uri - Local URI of the file
 * @param {string} params.type - Type of file ('image', 'video', 'document')
 * @param {string} params.mimeType - MIME type of the file
 * @returns {Promise<Object>} Upload result with file details
 */
export const uploadFile = async ({ folderId, name, uri, type, mimeType }) => {
  try {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: mimeType || 'application/octet-stream',
      name: name || 'file'
    });
    
    if (folderId) {
      formData.append('folderId', folderId);
    }
    if (name) {
      formData.append('name', name);
    }
    if (type) {
      formData.append('type', type);
    }

    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.file;
    } else {
      throw new Error(response.data.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Create a note file
 * @param {Object} params - Note creation parameters
 * @param {string} params.folderId - ID of the folder to create note in
 * @param {string} params.name - Name of the note
 * @param {Array} params.content - Note content array
 * @returns {Promise<Object>} Created note file details
 */
export const createNoteFile = async ({ folderId, name, content }) => {
  try {
    const response = await axiosInstance.post('/files', {
      folderId,
      name,
      type: 'note',
      content
    });

    if (response.data.success) {
      return response.data.file;
    } else {
      throw new Error(response.data.error || 'Note creation failed');
    }
  } catch (error) {
    console.error('Create note error:', error);
    throw error;
  }
};

/**
 * Get files from a folder
 * @param {string} folderId - ID of the folder to get files from
 * @returns {Promise<Array>} Array of files
 */
export const getFiles = async (folderId) => {
  try {
    const params = folderId ? { folderId } : {};
    const response = await axiosInstance.get('/files', { params });

    if (response.data.success) {
      return response.data.files;
    } else {
      throw new Error(response.data.error || 'Failed to get files');
    }
  } catch (error) {
    console.error('Get files error:', error);
    throw error;
  }
};

/**
 * Update a file
 * @param {string} fileId - ID of the file to update
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated file details
 */
export const updateFile = async (fileId, updates) => {
  try {
    const response = await axiosInstance.put(`/files/${fileId}`, updates);

    if (response.data.success) {
      return response.data.file;
    } else {
      throw new Error(response.data.error || 'File update failed');
    }
  } catch (error) {
    console.error('Update file error:', error);
    throw error;
  }
};

/**
 * Delete a file
 * @param {string} fileId - ID of the file to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteFile = async (fileId) => {
  try {
    const response = await axiosInstance.delete(`/files/${fileId}`);

    if (response.data.success) {
      return true;
    } else {
      throw new Error(response.data.error || 'File deletion failed');
    }
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
}; 