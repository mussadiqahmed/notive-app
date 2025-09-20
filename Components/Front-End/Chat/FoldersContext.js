// FoldersContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFolders, createFolder, updateFolder, deleteFolder as deleteFolderApi, getFilesInFolder, createFile } from '../../../Backend/foldersApi';
import { useAuth } from '../Auth/AuthContext';

const FoldersContext = createContext();

export const FoldersProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentlyDeleted, setRecentlyDeleted] = useState([]);
  const { isAuthenticated, logout: authLogout } = useAuth();

  // Fetch folders only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFolders();
    }
  }, [isAuthenticated]);


  const fetchFolders = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping folder fetch');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Attempting to fetch folders from backend...');
      const fetchedFolders = await getFolders();
      console.log('Successfully fetched folders:', fetchedFolders);
      
      // Transform backend data to match frontend structure
      const transformedFolders = fetchedFolders.map(folder => ({
        id: folder.id.toString(),
        name: folder.name,
        icon: folder.icon || 'folder',
        isFolder: true,
        files: [],
        parentId: folder.parentId,
        isDeleted: folder.isDeleted,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt
      }));
      
      console.log('Transformed folders:', transformedFolders);
      
      // Now fetch files for each folder
      console.log('Fetching files for each folder...');
      for (const folder of transformedFolders) {
        try {
          const files = await getFilesInFolder(parseInt(folder.id));
          console.log(`Files for folder ${folder.name}:`, files);
          folder.files = files.map(file => ({
            id: file.id.toString(),
            name: file.name,
            type: file.type,
            content: file.content,
            filePath: file.filePath,
            mimeType: file.mimeType,
            size: file.size,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt
          }));
        } catch (fileError) {
          console.error(`Failed to fetch files for folder ${folder.name}:`, fileError);
          folder.files = [];
        }
      }
      
      console.log('Folders with files:', transformedFolders);
      setFolders(transformedFolders);
    } catch (err) {
      console.error('Failed to fetch folders:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      // Handle authentication errors
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('Authentication failed, logging out');
        await authLogout();
        setError('Authentication expired. Please log in again.');
        return;
      }
      
      setError(`Network Error: ${err.message}`);
      // Fallback to default folders if API fails
      setFolders([
        { 
          id: '1', 
          name: 'Inbox', 
          icon: 'folder', 
          isFolder: true,
          files: [],
          parentId: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addFolder = async (newFolder, parentId = null) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      const createdFolder = await createFolder({
        name: newFolder.folderName,
        icon: newFolder.selectedIcon?.name || 'folder',
        parentId: parentId ? parseInt(parentId) : null
      });

      const transformedFolder = {
        id: createdFolder.id.toString(),
        name: createdFolder.name,
        icon: createdFolder.icon || 'folder',
        isFolder: true,
        files: [],
        parentId: createdFolder.parentId,
        isDeleted: false,
        createdAt: createdFolder.createdAt,
        updatedAt: createdFolder.updatedAt
      };

      setFolders(prev => [...prev, transformedFolder]);
      return transformedFolder;
    } catch (err) {
      console.error('Failed to create folder:', err);
      throw err;
    }
  };

  const addFile = async (folderId, file) => {
    console.log('addFile called with:', { folderId, file, isAuthenticated });
    
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('Creating file with data:', {
        folderId: parseInt(folderId),
        name: file.name || file.title || 'Untitled Note',
        type: 'note',
        content: file.content
      });
      
      // Call the backend API to create the file
      const createdFile = await createFile({
        folderId: parseInt(folderId),
        name: file.name || file.title || 'Untitled Note',
        type: 'note',
        content: file.content
      });

      console.log('File created successfully:', createdFile);
      
      // Update local state with the created file
      setFolders(prev => 
        prev.map(folder => 
          folder.id === folderId 
            ? { ...folder, files: [...folder.files, {
                id: createdFile.id.toString(),
                name: createdFile.name,
                type: createdFile.type,
                content: createdFile.content,
                createdAt: createdFile.createdAt,
                updatedAt: createdFile.updatedAt
              }] }
            : folder
        )
      );
      
      return createdFile;
    } catch (err) {
      console.error('Failed to create file:', err);
      throw err;
    }
  };

  const deleteFolder = async (folderId) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      await deleteFolderApi(parseInt(folderId));
      
      setFolders(prev => 
        prev.map(folder => 
          folder.id === folderId 
            ? { ...folder, isDeleted: true, deletedAt: new Date().toISOString() }
            : folder
        )
      );
    } catch (err) {
      console.error('Failed to delete folder:', err);
      throw err;
    }
  };

  const restoreFolder = async (folderId) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      await updateFolder({ 
        id: parseInt(folderId), 
        isDeleted: false 
      });
      
      setFolders(prev => 
        prev.map(folder => 
          folder.id === folderId 
            ? { ...folder, isDeleted: false, deletedAt: null }
            : folder
        )
      );
    } catch (err) {
      console.error('Failed to restore folder:', err);
      throw err;
    }
  };

  const permanentlyDeleteFolder = (folderId) => {
    setFolders(prev => prev.filter(folder => folder.id !== folderId));
  };

  const deleteFile = (folderId, fileId) => {
    setFolders(prev => 
      prev.map(folder => {
        if (folder.id === folderId) {
          const fileToDelete = folder.files.find(f => f.id === fileId);
          if (fileToDelete) {
            setRecentlyDeleted(prevDeleted => [...prevDeleted, {
              ...fileToDelete,
              deletedAt: new Date().toISOString()
            }]);
            return {
              ...folder,
              files: folder.files.filter(f => f.id !== fileId)
            };
          }
        }
        return folder;
      })
    );
  };

  const renameFolder = async (folderId, newName) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      await updateFolder({ 
        id: parseInt(folderId), 
        name: newName 
      });
      
      setFolders(prev => 
        prev.map(folder => 
          folder.id === folderId 
            ? { ...folder, name: newName }
            : folder
        )
      );
    } catch (err) {
      console.error('Failed to rename folder:', err);
      throw err;
    }
  };

  const renameFile = (folderId, fileId, newName) => {
    setFolders(prev => 
      prev.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            files: folder.files.map(file => 
              file.id === fileId ? { ...file, name: newName } : file
            )
          };
        }
        return folder;
      })
    );
  };

  const restoreItem = (itemId) => {
    setRecentlyDeleted(prevDeleted => {
      const itemToRestore = prevDeleted.find(item => item.id === itemId);
      if (itemToRestore) {
        if (itemToRestore.isFolder) {
          setFolders(prev => [...prev, itemToRestore]);
        } else {
          // For files, we need to find which folder they belong to
          setFolders(prev => 
            prev.map(folder => {
              if (folder.id === itemToRestore.parentId) {
                return {
                  ...folder,
                  files: [...folder.files, itemToRestore]
                };
              }
              return folder;
            })
          );
        }
        return prevDeleted.filter(item => item.id !== itemId);
      }
      return prevDeleted;
    });
  };

  const refreshFolders = () => {
    if (isAuthenticated) {
      fetchFolders();
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setFolders([]);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update the provider value
  return (
    <FoldersContext.Provider value={{ 
      folders,
      recentlyDeleted,
      loading,
      error,
      isAuthenticated,
      refreshFolders,
      logout,
      addFolder, 
      addFile,
      deleteFolder,
      restoreFolder,
      permanentlyDeleteFolder,
      deleteFile,
      renameFolder,
      renameFile,
      restoreItem
    }}>
      {children}
    </FoldersContext.Provider>
  );
};

export const useFolders = () => useContext(FoldersContext);