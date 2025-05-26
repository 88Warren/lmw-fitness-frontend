import { BACKEND_URL } from '../utils/config.js';

const TestConnection = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/test`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ test: "test" }), 
      });
      console.log('Test response:', await res.json());
    } catch (error) {
      console.error('Test error:', error);
    }
  };

export default TestConnection