import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import WebView from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const MediaViewerModal = ({ visible, onClose, media }) => {
  if (!media) return null;

  // Debug logging
  console.log('MediaViewerModal received:', { 
    type: media.type, 
    name: media.name, 
    uri: media.uri || media.filePath,
    mimeType: media.mimeType 
  });

  const getGoogleDocsUrl = (fileUrl) => {
    // Use Google Docs Viewer for better document rendering
    const encodedUrl = encodeURIComponent(fileUrl);
    return `https://docs.google.com/gview?embedded=true&url=${encodedUrl}`;
  };

  const renderContent = () => {
    // Get the correct file path (either uri or filePath)
    const filePath = media.uri || media.filePath;
    
    switch (media.type) {
      case 'note':
        console.log('Rendering note content:', media.content);
        if (media.content) {
          try {
            const content = Array.isArray(media.content) ? media.content : [media.content];
            return (
              <View style={styles.noteContainer}>
                {content.map((item, index) => (
                  <View key={index} style={styles.noteItem}>
                    {item.type === 'text' && (
                      <Text style={styles.noteText}>{item.value}</Text>
                    )}
                    {item.type === 'image' && (
                      <Image
                        source={{ uri: item.uri }}
                        style={styles.noteImage}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                ))}
              </View>
            );
          } catch (err) {
            console.error('Error parsing note content:', err);
            return (
              <View style={styles.unsupportedContainer}>
                <Text style={styles.unsupportedText}>Error loading note content</Text>
              </View>
            );
          }
        } else {
          return (
            <View style={styles.unsupportedContainer}>
              <Text style={styles.unsupportedText}>No content available</Text>
            </View>
          );
        }
      case 'image':
        console.log('Rendering image:', filePath);
        return (
          <Image
            source={{ uri: filePath }}
            style={styles.mediaContent}
            resizeMode="contain"
          />
        );
      case 'video':
        console.log('Rendering video:', filePath);
        return (
          <Video
            source={{ uri: filePath }}
            style={styles.mediaContent}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
          />
        );
      case 'document':
        // For documents, determine the best way to display them
        const fileExtension = media.name?.split('.').pop()?.toLowerCase();
        const isImageDoc = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
        const isVideoDoc = ['mp4', 'mov', 'avi', 'mkv', 'webm', '3gp'].includes(fileExtension);
        const isPdf = fileExtension === 'pdf';
        const isTextDoc = ['txt', 'md', 'rtf'].includes(fileExtension);
        
        console.log('Document analysis:', { 
          name: media.name, 
          extension: fileExtension, 
          isImage: isImageDoc, 
          isVideo: isVideoDoc, 
          isPdf, 
          isText: isTextDoc 
        });
        
        if (isImageDoc) {
          console.log('Treating as image document:', filePath);
          return (
            <Image
              source={{ uri: filePath }}
              style={styles.mediaContent}
              resizeMode="contain"
            />
          );
        } else if (isVideoDoc) {
          console.log('Treating as video document:', filePath);
          return (
            <Video
              source={{ uri: filePath }}
              style={styles.mediaContent}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
            />
          );
        } else if (isPdf) {
          // Use Google Docs Viewer for PDFs
          const googleDocsUrl = getGoogleDocsUrl(filePath);
          console.log('Using Google Docs Viewer for PDF:', googleDocsUrl);
          return (
            <WebView
              source={{ uri: googleDocsUrl }}
              style={styles.mediaContent}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading PDF...</Text>
                </View>
              )}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
              }}
            />
          );
        } else if (isTextDoc) {
          // For text files, try to show content directly
          console.log('Treating as text document:', media.uri);
          return (
            <WebView
              source={{ uri: media.uri }}
              style={styles.mediaContent}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading text document...</Text>
                </View>
              )}
            />
          );
        } else {
          // For other document types, try Google Docs Viewer first, then fallback to direct WebView
          const googleDocsUrl = getGoogleDocsUrl(media.uri);
          console.log('Using Google Docs Viewer for document:', googleDocsUrl);
          return (
            <WebView
              source={{ uri: googleDocsUrl }}
              style={styles.mediaContent}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading document...</Text>
                </View>
              )}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('Google Docs Viewer failed, trying direct view: ', nativeEvent);
                // Could implement fallback to direct WebView here if needed
              }}
            />
          );
        }
      default:
        console.log('Unsupported media type:', media.type);
        return (
          <View style={styles.unsupportedContainer}>
            <Text style={styles.unsupportedText}>Unsupported media type: {media.type}</Text>
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {media.name || 'Media Viewer'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            {renderContent()}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaContent: {
    width: '100%',
    height: '100%',
  },
  noteContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  noteItem: {
    marginBottom: 16,
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 8,
  },
  noteImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  unsupportedText: {
    fontSize: 16,
    color: '#666',
  },
});

export default MediaViewerModal; 