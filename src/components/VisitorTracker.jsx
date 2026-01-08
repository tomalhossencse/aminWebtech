import { useVisitorTracking } from '../hooks/useVisitorTracking';

const VisitorTracker = () => {
  // This component automatically tracks visitors when mounted
  useVisitorTracking();
  
  // This component doesn't render anything visible
  return null;
};

export default VisitorTracker;