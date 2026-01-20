import api from './api';

export const assessmentApi = {
  // Save or update assessment result
  saveAssessment: async (assessmentData) => {
    try {
      const response = await api.post('/api/assessments/save', assessmentData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error saving assessment:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to save assessment' 
      };
    }
  },

  // Get all assessment history for user
  getAssessmentHistory: async () => {
    try {
      const response = await api.get('/api/assessments/history');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch assessment history' 
      };
    }
  },

  // Get comparison between Day 1 and Day 30 for a program
  getAssessmentComparison: async (programName) => {
    try {
      const response = await api.get(`/api/assessments/compare/${programName}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching assessment comparison:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch assessment comparison' 
      };
    }
  },

  // Get assessments for specific program and day
  getProgramAssessments: async (programName, dayNumber) => {
    try {
      const response = await api.get(`/api/assessments/${programName}/day/${dayNumber}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching program assessments:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch program assessments' 
      };
    }
  },

  // Delete specific assessment
  deleteAssessment: async (assessmentId) => {
    try {
      const response = await api.delete(`/api/assessments/${assessmentId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error deleting assessment:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to delete assessment' 
      };
    }
  }
};

export default assessmentApi;