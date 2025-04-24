import { 
    collection, 
    doc, 
    setDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    where, 
    onSnapshot,
    serverTimestamp,
    addDoc 
  } from 'firebase/firestore';
  import { db } from '../FirebaseConfig';
  
  const COLLECTION_NAME = 'requests';
  
  /**
   * Create a new request
   * 
   * @param {Object} requestData - The request data
   * @param {string} requestData.requester - Name of the requester (required)
   * @param {string} requestData.description - Request description (required)
   * @param {string} [requestData.technician] - Assigned technician
   * @param {string} [requestData.status='Open'] - Request status
   * @param {string} [requestData.priority='Normal'] - Request priority
   * @param {string} [requestData.site] - Request site location
   * @returns {Promise<string>} - The ID of the created request
   */
  export const createRequest = async (requestData: { requester: string; description: string; technician?: string; status?: string; priority?: string; site?: string; }): Promise<string> => {
    try {
      // Validate required fields
      if (!requestData.requester || !requestData.description) {
        throw new Error('Requester and description are required fields');
      }
      
      // Generate a new document ID
      const requestRef = doc(collection(db, COLLECTION_NAME));
      const requestId = requestRef.id;
      
      // Prepare the request document
      const fullRequestData = {
        id: requestId,
        ...requestData,
        status: requestData.status || 'Open',
        priority: requestData.priority || 'Normal',
        date: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // Save the document
      await setDoc(requestRef, fullRequestData);
      
      return requestId;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  };
  
  /**
   * Update an existing request
   * 
   * @param {string} requestId - The ID of the request to update
   * @param {Object} requestData - The request data to update
   * @returns {Promise<void>}
   */
  export const updateRequest = async (requestId: string, requestData: object): Promise<void> => {
    try {
      const requestRef = doc(db, COLLECTION_NAME, requestId);
      
      const updatedData = {
        ...requestData,
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(requestRef, updatedData, { merge: true });
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  };
  
  /**
   * Delete a request
   * 
   * @param {string} requestId - The ID of the request to delete
   * @returns {Promise<void>}
   */
  export const deleteRequest = async (requestId: string): Promise<void> => {
    try {
      const requestRef = doc(db, COLLECTION_NAME, requestId);
      await deleteDoc(requestRef);
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  };
  
  /**
   * Get all requests with real-time updates
   * 
   * @param {Function} onSuccess - Callback function for successful data retrieval
   * @param {Function} onError - Callback function for errors
   * @returns {Function} - Unsubscribe function to stop listening for updates
   */
  export const getAllRequests = (onSuccess: Function, onError: Function): Function => {
    try {
      const requestsRef = collection(db, COLLECTION_NAME);
      const q = query(requestsRef, orderBy('date', 'desc'));
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          onSuccess(requests);
        },
        (error) => {
          console.error('Error getting requests:', error);
          onError(error);
        }
      );
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up request listener:', error);
      onError(error);
      return () => {}; // Return empty function as fallback
    }
  };
  
  /**
   * Get filtered requests
   * 
   * @param {Object} filters - Filters to apply
   * @param {string} [filters.status] - Filter by status
   * @param {string} [filters.priority] - Filter by priority
   * @param {string} [filters.technician] - Filter by technician
   * @param {Function} onSuccess - Callback function for successful data retrieval
   * @param {Function} onError - Callback function for errors
   * @returns {Function} - Unsubscribe function to stop listening for updates
   */
  export const getFilteredRequests = (filters: { status?: string; priority?: string; technician?: string; }, onSuccess: Function, onError: Function): Function => {
    try {
      const requestsRef = collection(db, COLLECTION_NAME);
      
      // Build query constraints
      const queryConstraints = [];
      
      if (filters.status) {
        queryConstraints.push(where('status', '==', filters.status));
      }
      
      if (filters.priority) {
        queryConstraints.push(where('priority', '==', filters.priority));
      }
      
      if (filters.technician) {
        queryConstraints.push(where('technician', '==', filters.technician));
      }
      
      // Always sort by date
      queryConstraints.push(orderBy('date', 'desc'));
      
      const q = query(requestsRef, ...queryConstraints);
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          onSuccess(requests);
        },
        (error) => {
          console.error('Error getting filtered requests:', error);
          onError(error);
        }
      );
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up filtered request listener:', error);
      onError(error);
      return () => {}; // Return empty function as fallback
    }
  };