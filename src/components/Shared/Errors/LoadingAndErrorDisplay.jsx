import PropTypes from 'prop-types';

const LoadingAndErrorDisplay = ({ loading, error, message }) => {
  if (loading) {
    return (
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-3 bg-customGray/50 backdrop-blur-sm px-6 py-4 rounded-lg border border-brightYellow/20">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brightYellow"></div>
          <span className="text-brightYellow font-titillium">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-center backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-titillium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="mb-8">
        <div className="bg-limeGreen/20 border border-limeGreen/50 text-limeGreen p-4 rounded-lg text-center backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-titillium">{message}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingAndErrorDisplay;

LoadingAndErrorDisplay.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  message: PropTypes.string,
};