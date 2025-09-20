import axiosInstance from './axiosSingleton';

/**
 * Get all folders for the authenticated user
 * @returns {Promise<Array>} Array of folders
 */
export const getFolders = async () => {
  try {
    console.log('Making request to:', axiosInstance.defaults.baseURL + '/folders');
    const response = await axiosInstance.get('/folders');
    console.log('Response received:', response.status, response.data);
    
    if (response.data.success) {
      return response.data.folders;
    } else {
      throw new Error(response.data.error || 'Failed to fetch folders');
    }
  } catch (error) {
    console.error('Get folders error:', error);
    console.error('Error config:', error.config);
    throw error;
  }
};

/**
 * Create a new folder
 * @param {Object} params - Folder creation parameters
 * @param {string} params.name - Name of the folder
 * @param {string} params.icon - Icon for the folder
 * @param {number} params.parentId - Parent folder ID (optional)
 * @returns {Promise<Object>} Created folder details
 */
export const createFolder = async ({ name, icon, parentId }) => {
  try {
    const response = await axiosInstance.post('/folders', {
      name,
      icon,
      parentId
    });

    if (response.data.success) {
      return response.data.folder;
    } else {
      throw new Error(response.data.error || 'Folder creation failed');
    }
  } catch (error) {
    console.error('Create folder error:', error);
    throw error;
  }
};

/**
 * Update a folder
 * @param {Object} params - Folder update parameters
 * @param {number} params.id - Folder ID
 * @param {string} params.name - New name (optional)
 * @param {string} params.icon - New icon (optional)
 * @param {number} params.parentId - New parent folder ID (optional)
 * @returns {Promise<Object>} Updated folder details
 */
export const updateFolder = async ({ id, name, icon, parentId }) => {
  try {
    const response = await axiosInstance.put(`/folders/${id}`, {
      name,
      icon,
      parentId
    });

    if (response.data.success) {
      return response.data.folder;
    } else {
      throw new Error(response.data.error || 'Folder update failed');
    }
  } catch (error) {
    console.error('Update folder error:', error);
    throw error;
  }
};

/**
 * Delete a folder (soft delete)
 * @param {number} id - Folder ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteFolder = async (id) => {
  try {
    const response = await axiosInstance.delete(`/folders/${id}`);
    
    if (response.data.success) {
      return true;
    } else {
      throw new Error(response.data.error || 'Folder deletion failed');
    }
  } catch (error) {
    console.error('Delete folder error:', error);
    throw error;
  }
};

/**
 * Get files in a specific folder
 * @param {number} folderId - Folder ID
 * @returns {Promise<Array>} Array of files
 */
export const getFilesInFolder = async (folderId) => {
  try {
    const response = await axiosInstance.get('/files', {
      params: { folderId }
    });

    if (response.data.success) {
      return response.data.files;
    } else {
      throw new Error(response.data.error || 'Failed to fetch files');
    }
  } catch (error) {
    console.error('Get files error:', error);
    throw error;
  }
};

/**
 * Create a new file
 * @param {Object} params - File creation parameters
 * @param {number} params.folderId - Folder ID
 * @param {string} params.name - File name
 * @param {string} params.type - File type
 * @param {Array} params.content - File content
 * @returns {Promise<Object>} Created file details
 */
export const createFile = async ({ folderId, name, type, content }) => {
  try {
    const response = await axiosInstance.post('/files', {
      folderId: parseInt(folderId),
      name,
      type,
      content
    });

    if (response.data.success) {
      return response.data.file;
    } else {
      throw new Error(response.data.error || 'File creation failed');
    }
  } catch (error) {
    console.error('Create file error:', error);
    throw error;
  }
};